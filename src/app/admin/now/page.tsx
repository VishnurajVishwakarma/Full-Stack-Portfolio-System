'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Textarea } from '@/components/ui'
import { settingsService } from '@/lib/services'

export default function NowAdmin() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => settingsService.subscribe(settings => setValue(settings.nowText || '')), [])
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); try { await settingsService.update({ nowText: value }); toast.success('Now section updated') } catch (error: any) { toast.error(error.message || 'Update failed') } finally { setLoading(false) } }
  return <div className="max-w-3xl"><p className="mb-2 font-mono text-[10px] uppercase tracking-[.25em] text-[#7dd3fc]">Current focus</p><h1 className="mb-8 text-2xl font-bold text-white">Now</h1><form onSubmit={submit} className="rounded-xl border border-white/10 bg-ink-900 p-6"><Textarea label="Public Now statement" rows={5} value={value} onChange={(event: any) => setValue(event.target.value)} placeholder="Currently pursuing PGDM while building..." /><p className="mt-3 text-xs leading-5 text-ink-500">Keep this current, specific, and concise. It appears as a highlighted section on the homepage.</p><Button type="submit" loading={loading} className="mt-6 bg-[#00f0ff] text-ink-950 hover:bg-[#67e8f9]">Save Now</Button></form></div>
}
