'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Textarea } from '@/components/ui'
import { settingsService } from '@/lib/services'
import type { SiteSettings } from '@/types'

const fields: Array<{ key: keyof SiteSettings, label: string, placeholder: string }> = [
  { key: 'nowBuilding', label: 'Building', placeholder: 'Zaprill' },
  { key: 'nowOperating', label: 'Operating', placeholder: 'Austrange Solutions' },
  { key: 'nowContributing', label: 'Contributing', placeholder: 'CIEL' },
  { key: 'nowLearning', label: 'Learning', placeholder: 'Finance · Valuation · Strategy' },
  { key: 'nowResearching', label: 'Researching', placeholder: 'Businesses · AI · Markets' },
  { key: 'nowExploring', label: 'Exploring', placeholder: 'New products · Partnerships · Opportunities' }
]

export default function NowAdmin() {
  const [form, setForm] = useState<Partial<SiteSettings>>({})
  const [loading, setLoading] = useState(false)
  useEffect(() => settingsService.subscribe(settings => setForm(settings)), [])
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      await settingsService.update({ nowText: form.nowText, ...Object.fromEntries(fields.map(field => [field.key, form[field.key]])) })
      toast.success('Now dashboard updated')
    } catch (error: any) {
      toast.error(error.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }
  return <div className="max-w-3xl"><p className="mb-2 font-mono text-[10px] uppercase tracking-[.25em] text-[#7dd3fc]">Living founder dashboard</p><h1 className="mb-8 text-2xl font-bold text-white">Now</h1><form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-ink-900 p-6"><Textarea label="Homepage summary" rows={3} value={form.nowText || ''} onChange={(event: any) => setForm({ ...form, nowText: event.target.value })} placeholder="Building products, operating businesses..." />{fields.map(field => <Textarea key={field.key} label={field.label} rows={2} value={String(form[field.key] || '')} onChange={(event: any) => setForm({ ...form, [field.key]: event.target.value })} placeholder={field.placeholder} />)}<Button type="submit" loading={loading} className="bg-[#00f0ff] text-ink-950 hover:bg-[#67e8f9]">Save Now Dashboard</Button></form></div>
}
