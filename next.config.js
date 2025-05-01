// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: "export",
//     images: {
//         unoptimized: true,
//     }
// };

// export default nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: "/chat",
        destination: "http://152.53.229.172:5010/chat",
      },
    ];
  },
};
