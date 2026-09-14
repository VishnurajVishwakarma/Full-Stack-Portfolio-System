import type { Metadata } from 'next'
import { EditorialList, EditorialPage } from '@/components/public/EditorialPage'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Thinking in Public', description: 'Insights on business, finance, strategy, AI, technology, and analytics.' }
export default async function InsightsPage() { const { data } = await supabase.from('articles').select('*').eq('visible', true).order('publishedAt', { ascending: false }); return <EditorialPage eyebrow="Insights" title="What I&apos;m Learning & Building" intro="Working notes and considered essays on building businesses with finance, strategy, analytics, AI, and technology."><EditorialList items={data || []} basePath="/insights" /></EditorialPage> }
