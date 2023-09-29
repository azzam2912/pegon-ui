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
  webpack: (config, { isServer }) => {
    // Add a rule to handle .md files with the raw-loader
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;
  },
};

module.exports = withPWA(nextConfig);
