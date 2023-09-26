/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: true, // Set this to true if the redirect is permanent (HTTP 301)
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
