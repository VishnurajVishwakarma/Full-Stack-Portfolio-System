import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.vishnurajvishwakarma.in'
  return ['', '/finance', '/research', '/insights', '/projects', '/skills', '/certificates'].map(path => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path ? 'monthly' : 'weekly', priority: path ? .7 : 1 }))
}
