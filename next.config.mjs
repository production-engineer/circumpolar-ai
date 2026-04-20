const nextConfig = {
  images: { unoptimized: true },
  webpack: (config, { dev }) => {
    // mapbox-gl contains Unicode sequences that SWC/Terser can't minify
    if (!dev) config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
