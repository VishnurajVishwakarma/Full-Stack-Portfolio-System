import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/admin/' }], sitemap: 'https://www.vishnurajvishwakarma.in/sitemap.xml', host: 'https://www.vishnurajvishwakarma.in' }
}
