'use client'

import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, Input, Modal, Textarea } from '@/components/ui'

export type Field = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'date' | 'checkbox'
  required?: boolean
  placeholder?: string
}

type Service = {
  subscribe: (callback: (items: any[]) => void) => () => void
  create: (data: any) => Promise<string>
  update: (id: string, data: any) => Promise<void>
  delete: (id: string) => Promise<void>
}

export default function ContentManager({ title, singular, fields, service }: {
  title: string
  singular: string
  fields: Field[]
  service: Service
}) {
  const defaults = Object.fromEntries(fields.map(field => [field.key, field.type === 'checkbox' ? false : field.type === 'number' ? 0 : '']))
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>(defaults)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => service.subscribe(setItems), [service])

  const showForm = (item?: any) => {
    setEditing(item || null)
    setForm(item ? Object.fromEntries(fields.map(field => [field.key, item[field.key] ?? defaults[field.key]])) : defaults)
    setOpen(true)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      editing ? await service.update(editing.id, form) : await service.create(form)
      toast.success(`${singular} ${editing ? 'updated' : 'created'}`)
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || `Could not save ${singular.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (item: any) => {
    if (!window.confirm(`Delete “${item.title || item.label || singular}”?`)) return
    try {
      await service.delete(item.id)
      toast.success(`${singular} deleted`)
    } catch (error: any) {
      toast.error(error.message || 'Delete failed')
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#7dd3fc]">Content management</p>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        <Button onClick={() => showForm()} className="bg-[#00f0ff] text-ink-950 hover:bg-[#67e8f9]">
          <Plus size={16} className="mr-2" /> Add {singular}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-4 border-b border-white/10 p-5 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-white">{item.title || item.label || item.value}</h2>
                {item.category && <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-ink-400">{item.category}</span>}
                {item.visible === false && <span className="text-[10px] uppercase tracking-wider text-amber-300">Hidden</span>}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-400">{item.description || item.excerpt || item.summary || item.content || 'No description'}</p>
            </div>
            <button aria-label={`Edit ${singular}`} onClick={() => showForm(item)} className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-white/5 hover:text-[#00f0ff]"><Pencil size={16} /></button>
            <button aria-label={`Delete ${singular}`} onClick={() => remove(item)} className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-red-500/10 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
        ))}
        {items.length === 0 && <div className="p-10 text-center text-sm text-ink-500">No {title.toLowerCase()} yet. Add the first entry when verified content is ready.</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`${editing ? 'Edit' : 'New'} ${singular}`} size="lg">
        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          {fields.map(field => field.type === 'checkbox' ? (
            <label key={field.key} className="flex min-h-11 items-center gap-3 text-sm text-ink-700 dark:text-ink-300">
              <input type="checkbox" checked={Boolean(form[field.key])} onChange={event => setForm({ ...form, [field.key]: event.target.checked })} /> {field.label}
            </label>
          ) : field.type === 'textarea' ? (
            <div key={field.key} className="sm:col-span-2"><Textarea label={field.label} required={field.required} placeholder={field.placeholder} value={form[field.key]} onChange={(event: any) => setForm({ ...form, [field.key]: event.target.value })} /></div>
          ) : (
            <Input key={field.key} label={field.label} required={field.required} placeholder={field.placeholder} type={field.type || 'text'} value={form[field.key]} onChange={(event: any) => setForm({ ...form, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })} />
          ))}
          <div className="flex justify-end gap-3 border-t border-white/10 pt-5 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={loading} className="bg-[#00f0ff] text-ink-950 hover:bg-[#67e8f9]">Save {singular}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
