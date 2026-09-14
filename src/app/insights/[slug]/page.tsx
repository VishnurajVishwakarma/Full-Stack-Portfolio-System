import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialPage } from '@/components/public/EditorialPage'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
async function getArticle(slug: string) { const { data } = await supabase.from('articles').select('*').eq('slug', slug).eq('visible', true).single(); return data }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> { const article = await getArticle(params.slug); if (!article) return {}; return { title: article.seoTitle || `${article.title} | Vishnuraj Vishwakarma`, description: article.seoDescription || article.excerpt, alternates: { canonical: `/insights/${article.slug}` }, openGraph: { title: article.seoTitle || article.title, description: article.seoDescription || article.excerpt, type: 'article', publishedTime: article.publishedAt || undefined, images: article.coverImage ? [article.coverImage] : undefined } } }
export default async function ArticlePage({ params }: { params: { slug: string } }) { const article = await getArticle(params.slug); if (!article) notFound(); return <EditorialPage eyebrow={`${article.category}${article.publishedAt ? ` · ${article.publishedAt}` : ''}`} title={article.title} intro={article.excerpt}><article className="prose prose-invert max-w-3xl whitespace-pre-wrap text-[#b9b5ab] leading-8">{article.content}</article></EditorialPage> }
