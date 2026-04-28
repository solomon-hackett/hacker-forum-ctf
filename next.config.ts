const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        process.env.CODESPACE_NAME
          ? `${process.env.CODESPACE_NAME}-3000.app.github.dev`
          : "",
      ].filter(Boolean),
    },
  },
};

export default nextConfig;
