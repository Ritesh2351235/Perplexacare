/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  env: {
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    PERPLEXITY_BASE_URL: process.env.PERPLEXITY_BASE_URL || "https://api.perplexity.ai",
  },
  // Move serverComponentsExternalPackages to root level as serverExternalPackages
  serverExternalPackages: ["openai"],
  // Configure allowed image domains
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    // This is necessary to ensure .ts files are properly processed
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', ...config.resolve.extensions];
    return config;
  },
};

module.exports = nextConfig; 