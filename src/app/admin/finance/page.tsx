'use client'
import ContentManager from '@/components/admin/ContentManager'
import { financeService } from '@/lib/services'
export default function FinanceAdmin() { return <ContentManager title="Finance & Strategy" singular="Item" service={financeService} fields={[
  { key: 'title', label: 'Title', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'category', label: 'Category', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true }, { key: 'content', label: 'Content', type: 'textarea' },
  { key: 'externalUrl', label: 'External link' }, { key: 'documentUrl', label: 'Document link' }, { key: 'publishedAt', label: 'Publication date', type: 'date' },
  { key: 'featured', label: 'Featured', type: 'checkbox' }, { key: 'visible', label: 'Visible publicly', type: 'checkbox' }, { key: 'order', label: 'Display order', type: 'number' }
]} /> }
