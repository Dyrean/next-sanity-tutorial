/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "imgix",
    domains: ["cdn.sanity.io"],
    path: "",
  },
};

module.exports = nextConfig;
