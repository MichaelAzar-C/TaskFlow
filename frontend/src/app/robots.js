export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/projects/", "/login"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}