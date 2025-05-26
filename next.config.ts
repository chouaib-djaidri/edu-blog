import createNextIntlPlugin from "next-intl/plugin";
type protocol = "https" | "http" | undefined;

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https" as protocol,
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https" as protocol,
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https" as protocol,
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https" as protocol,
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https" as protocol,
        hostname: process.env.NEXT_PUBLIC_BUNNYCDN_CDN_HOST as string,
        pathname: "/**",
      },
    ],
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
