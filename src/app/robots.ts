import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/demo/",
      },
    ],
    sitemap: "https://raffi.studio/sitemap.xml",
  };
}
