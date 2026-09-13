'use client'
import ContentManager from '@/components/admin/ContentManager'
import { metricsService } from '@/lib/services'
export default function MetricsAdmin() { return <ContentManager title="Metrics" singular="Metric" service={metricsService} fields={[
  { key: 'value', label: 'Verified value', required: true }, { key: 'label', label: 'Label', required: true },
  { key: 'description', label: 'Description', type: 'textarea' }, { key: 'order', label: 'Display order', type: 'number' },
  { key: 'visible', label: 'Visible publicly', type: 'checkbox' }
]} /> }
