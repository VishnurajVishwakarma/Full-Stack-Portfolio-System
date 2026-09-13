'use client'
import ContentManager from '@/components/admin/ContentManager'
import { articlesService } from '@/lib/services'
export default function InsightsAdmin() { return <ContentManager title="Insights" singular="Article" service={articlesService} fields={[
  { key: 'title', label: 'Title', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'category', label: 'Category', required: true },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true }, { key: 'content', label: 'Article content', type: 'textarea' },
  { key: 'coverImage', label: 'Cover image URL' }, { key: 'publishedAt', label: 'Published date', type: 'date' }, { key: 'seoTitle', label: 'SEO title' },
  { key: 'seoDescription', label: 'SEO description', type: 'textarea' }, { key: 'featured', label: 'Featured', type: 'checkbox' },
  { key: 'visible', label: 'Visible publicly', type: 'checkbox' }, { key: 'order', label: 'Display order', type: 'number' }
]} /> }
