import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://www.vishnurajvishwakarma.in'),
    title: { default: 'Vishnuraj Vishwakarma | Business, Finance & Technology', template: '%s | Vishnuraj Vishwakarma' },
    description: 'Founder and PGDM candidate building businesses with data, finance, analytics, operations, AI, and scalable technology systems.',
    alternates: { canonical: '/' },
    openGraph: { title: 'Vishnuraj Vishwakarma | Business, Finance & Technology', description: 'Founder and PGDM candidate focused on business strategy, analytics, operations, finance, and scalable digital systems.', url: '/', siteName: 'Vishnuraj Vishwakarma', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'Vishnuraj Vishwakarma | Business, Finance & Technology', description: 'Building businesses with data, finance, analytics, operations, AI, and technology.' },
    robots: { index: true, follow: true },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Vishnuraj Vishwakarma', url: 'https://www.vishnurajvishwakarma.in/', jobTitle: 'Founder & COO', knowsAbout: ['Business Strategy', 'Analytics', 'Operations', 'Finance', 'Artificial Intelligence', 'Technology'] }) }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
