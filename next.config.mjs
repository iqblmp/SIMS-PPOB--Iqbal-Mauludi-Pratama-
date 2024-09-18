/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["minio.nutech-integrasi.com"],
  },

  //   experimental: {
  //     middleware: true,
  //   },
}

export default nextConfig
