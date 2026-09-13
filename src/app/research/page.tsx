import type { Metadata } from 'next'
import { EditorialList, EditorialPage } from '@/components/public/EditorialPage'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Research & Publications | Vishnuraj Vishwakarma', description: 'Verified research and publications across technology, cybersecurity, business, and analytics.' }
export default async function ResearchPage() { const { data } = await supabase.from('research_publications').select('*').eq('visible', true).order('order'); return <EditorialPage eyebrow="Evidence & Inquiry" title="Research & Publications" intro="Research presented with authorship, publication details, summaries, and source documents where available."><EditorialList items={data || []} /></EditorialPage> }
