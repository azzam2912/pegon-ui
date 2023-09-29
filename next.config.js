/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  reactStrictMode: true,
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
