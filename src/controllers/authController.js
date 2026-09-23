const jwt = require("jsonwebtoken");
const User = require("../models/User");
const handleError = require("../utils/handleError");

// Helper: create a token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Helper: coerce body fields to plain strings.
// Stops query-operator injection such as { "email": { "$gt": "" } }.
const asString = (value) => (typeof value === "string" ? value : "");

// REGISTER
exports.register = async (req, res) => {
  try {
    const name = asString(req.body.name);
    const email = asString(req.body.email).trim().toLowerCase();
    const password = asString(req.body.password);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    // Also covers the duplicate-email race via the unique index (409)
    handleError(res, error);
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const email = asString(req.body.email).trim().toLowerCase();
    const password = asString(req.body.password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user and explicitly include password
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  const { _id, name, email, role, createdAt } = req.user;
  res.status(200).json({ _id, name, email, role, createdAt });
};
