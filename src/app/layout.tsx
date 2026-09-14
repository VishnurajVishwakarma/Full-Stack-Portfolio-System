import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://www.vishnurajvishwakarma.in'),
    title: { default: 'Vishnuraj Vishwakarma | Founder, Operator & Builder', template: '%s | Vishnuraj Vishwakarma' },
    description: 'Vishnuraj Vishwakarma builds products, businesses and systems at the intersection of AI, technology and finance.',
    alternates: { canonical: '/' },
    openGraph: { title: 'Vishnuraj Vishwakarma | Founder, Operator & Builder', description: 'Building products, businesses and systems at the intersection of technology, AI, data and business.', url: '/', siteName: 'Vishnuraj Vishwakarma', type: 'profile' },
    twitter: { card: 'summary_large_image', title: 'Vishnuraj Vishwakarma | Founder, Operator & Builder', description: 'Building products, businesses and systems at the intersection of technology, AI, data and business.' },
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Vishnuraj Vishwakarma', url: 'https://www.vishnurajvishwakarma.in/', image: 'https://peujmdmnwsbafoqvwclx.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-09-14%20at%205.48.15%20AM.jpeg', jobTitle: 'Founder & COO', sameAs: ['https://in.linkedin.com/in/vishnuraj-vishwakarma', 'https://github.com/VishnurajVishwakarma', 'https://www.instagram.com/vishnuraj_vishwakarma', 'https://www.youtube.com/@vishnurajvishwakarma4239', 'https://x.com/Vishnuraj_r_v'], knowsAbout: ['Business Strategy', 'Product Building', 'Operations', 'Finance', 'Artificial Intelligence', 'Technology'] }) }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
