import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Now', description: 'What Vishnuraj Vishwakarma is building, operating, contributing to, learning, and researching now.', alternates: { canonical: '/now' } }

export default async function NowPage() {
  const { data } = await supabase.from('settings').select('*').eq('id', 'site').single()
  const sections = [
    ['Building', data?.nowBuilding || 'Zaprill'],
    ['Operating', data?.nowOperating || 'Austrange Solutions'],
    ['Contributing', data?.nowContributing || 'CIEL'],
    ['Learning', data?.nowLearning || 'Finance · Valuation · Strategy'],
    ['Researching', data?.nowResearching || 'Businesses · AI · Markets'],
    ['Exploring', data?.nowExploring || 'New products · Partnerships · Opportunities']
  ]
  return <main className="min-h-screen bg-[#0a0a09] px-5 py-12 text-[#f3f0e8] md:px-10"><div className="mx-auto max-w-5xl"><Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#96928a] hover:text-[#c8a96b]"><ArrowLeft size={16} /> Vishnuraj Vishwakarma</Link><header className="py-20"><p className="text-xs uppercase tracking-[.28em] text-[#c8a96b]">September 2026</p><h1 className="mt-6 text-7xl font-semibold tracking-[-.06em] sm:text-9xl">NOW<span className="text-[#c8a96b]">.</span></h1><p className="mt-8 max-w-2xl text-xl leading-9 text-[#96928a]">{data?.nowText || 'A living dashboard of what I’m building, learning and exploring.'}</p></header><div className="divide-y divide-white/[.09] border-y border-white/[.09]">{sections.map(([label, value], index) => <section key={label} className="grid gap-5 py-8 sm:grid-cols-[80px_180px_1fr]"><span className="text-xs text-[#5d5a54]">0{index + 1}</span><h2 className="text-xs uppercase tracking-[.2em] text-[#c8a96b]">{label}</h2><p className="text-xl leading-8 text-[#d7d2c8]">{value}</p></section>)}</div></div></main>
}
