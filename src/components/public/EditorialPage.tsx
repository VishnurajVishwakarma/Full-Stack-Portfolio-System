import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export function EditorialPage({ eyebrow, title, intro, children }: { eyebrow: string, title: string, intro: string, children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#0a0a09] px-5 py-12 text-[#f3f0e8] md:px-8">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#96928a] hover:text-[#c8a96b]"><ArrowLeft size={16} /> Vishnuraj Vishwakarma</Link>
      <header className="max-w-3xl py-16"><p className="text-xs font-semibold uppercase tracking-[.24em] text-[#c8a96b]">{eyebrow}</p><h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1><p className="mt-6 text-lg leading-8 text-[#96928a]">{intro}</p></header>
      {children}
    </div>
  </main>
}

export function EditorialList({ items, basePath }: { items: any[], basePath?: string }) {
  if (!items.length) return <div className="max-w-2xl border-l border-[#c8a96b]/50 pl-6 text-lg leading-8 text-[#96928a]">This collection is intentionally selective. New work will be shared when it is ready to stand on its own.</div>
  return <div className="divide-y divide-white/10 border-y border-white/10">{items.map(item => {
    const content = <><div><p className="text-xs uppercase tracking-[.18em] text-[#c8a96b]">{item.category || item.researchArea || item.publication || 'Publication'} {item.publishedAt || item.year ? `· ${item.publishedAt || item.year}` : ''}</p><h2 className="mt-3 text-2xl font-semibold text-[#f3f0e8]">{item.title}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-[#96928a]">{item.description || item.excerpt || item.summary}</p></div>{basePath && <ArrowUpRight className="shrink-0 text-[#5d5a54] group-hover:text-[#c8a96b]" />}</>
    return basePath ? <Link key={item.id} href={`${basePath}/${item.slug}`} className="group flex items-start justify-between gap-6 py-8">{content}</Link> : <article key={item.id} className="flex items-start justify-between gap-6 py-8">{content}</article>
  })}</div>
}
