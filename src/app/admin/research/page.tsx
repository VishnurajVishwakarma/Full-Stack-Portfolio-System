'use client'
import ContentManager from '@/components/admin/ContentManager'
import { researchService } from '@/lib/services'
export default function ResearchAdmin() { return <ContentManager title="Research & Publications" singular="Publication" service={researchService} fields={[
  { key: 'title', label: 'Title', required: true }, { key: 'slug', label: 'Slug', required: true }, { key: 'authors', label: 'Authors' },
  { key: 'publication', label: 'Publication' }, { key: 'year', label: 'Year' }, { key: 'researchArea', label: 'Research area' },
  { key: 'summary', label: 'Abstract / summary', type: 'textarea' }, { key: 'publicationUrl', label: 'Publication link' }, { key: 'documentUrl', label: 'PDF / document link' },
  { key: 'featured', label: 'Featured', type: 'checkbox' }, { key: 'visible', label: 'Visible publicly', type: 'checkbox' }, { key: 'order', label: 'Display order', type: 'number' }
]} /> }
