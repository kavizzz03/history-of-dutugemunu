import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // pin the project root so Next doesn't pick up a stray package-lock.json from a parent folder
  turbopack: { root: here },
};
export default nextConfig;
