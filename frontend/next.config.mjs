import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo root has the backend's own package-lock.json. Pin the Next.js
  // project root to this folder so Turbopack doesn't guess the wrong one.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
