// Turns any error thrown in a controller into a clean, safe API response.
// Known client mistakes get a clear 4xx message; anything unexpected is
// logged on the server and returned as a generic 500, so internal details
// (model names, field paths, stack traces) never reach the client.
module.exports = (res, error) => {
  // Schema validation failed, e.g. a missing required field or a password that's too short
  if (error.name === "ValidationError") {
    const first = Object.values(error.errors)[0];
    const message =
      first.name === "CastError" ? `Invalid ${first.path}` : first.message;
    return res.status(400).json({ message });
  }

  // A value couldn't be converted to the expected type, e.g. a malformed ObjectId
  if (error.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${error.path}` });
  }

  // Unique index violation, e.g. two registrations with the same email
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "Value";
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    return res.status(409).json({ message: `${label} already in use` });
  }

  console.error(error);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
};
