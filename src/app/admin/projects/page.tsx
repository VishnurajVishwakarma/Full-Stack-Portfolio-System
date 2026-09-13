'use client'
import { useState, useEffect } from 'react'
import { projectsService } from '@/lib/services'
import type { Project } from '@/types'
import { Button, Input, Modal, Textarea, Badge } from '@/components/ui'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const emptyForm = { title: '', slug: '', category: 'Technology', description: '', summary: '', problem: '', objective: '', role: '', approach: '', businessImpact: '', results: '', stack: '', githubUrl: '', liveUrl: '', proofUrl: '', featured: false, visible: true, order: 0 }
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    return projectsService.subscribe(setProjects)
  }, [])

  const handleOpen = (proj?: Project) => {
    if (proj) {
      setEditing(proj)
      setFormData({
        title: proj.title,
        slug: proj.slug || '',
        category: proj.category || 'Technology',
        description: proj.description,
        summary: proj.summary || '',
        problem: proj.problem || '',
        objective: proj.objective || '',
        role: proj.role || '',
        approach: proj.approach || '',
        businessImpact: proj.businessImpact || '',
        results: proj.results || '',
        stack: proj.stack.join(', '),
        githubUrl: proj.githubUrl || '',
        liveUrl: proj.liveUrl || '',
        proofUrl: proj.proofUrl || '',
        featured: proj.featured || false,
        visible: proj.visible !== false,
        order: proj.order || 0
      })
    } else {
      setEditing(null)
      setFormData(emptyForm)
    }
    setFile(undefined)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formData.category,
      description: formData.description,
      summary: formData.summary,
      problem: formData.problem,
      objective: formData.objective,
      role: formData.role,
      approach: formData.approach,
      businessImpact: formData.businessImpact,
      results: formData.results,
      stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      proofUrl: formData.proofUrl,
      featured: formData.featured,
      visible: formData.visible,
      order: formData.order
    }

    try {
      if (editing) {
        await projectsService.update(editing.id, payload, file)
        toast.success('Project updated')
      } else {
        await projectsService.create(payload, file)
        toast.success('Project created')
      }
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (proj: Project) => {
    if (!window.confirm('Delete this project forever?')) return
    try {
      await projectsService.delete(proj.id, proj.imageUrl)
      toast.success('Project deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-mono tracking-widest">CASE STUDIES</h1>
        <Button onClick={() => handleOpen()} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">
          <Plus size={16} className="mr-2" /> Add Case Study
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(proj => (
          <div key={proj.id} className="bg-ink-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 bg-ink-950 relative border-b border-white/10 flex items-center justify-center">
              {proj.imageUrl ? (
                <Image src={proj.imageUrl} alt={proj.title} fill className="object-cover" />
              ) : (
                <ImageIcon size={48} className="text-ink-800" />
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">{proj.title}</h3>
              <p className="text-ink-400 text-xs mb-4 line-clamp-2 flex-1">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.stack.slice(0, 3).map(s => <Badge key={s} className="bg-white/5">{s}</Badge>)}
                {proj.stack.length > 3 && <Badge className="bg-transparent border border-white/10">+{proj.stack.length - 3}</Badge>}
              </div>
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button onClick={() => handleOpen(proj)} className="flex-1 py-2 text-xs font-semibold bg-white/5 text-ink-300 rounded hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-colors flex items-center justify-center gap-2"><Pencil size={14} /> Edit</button>
                <button onClick={() => handleDelete(proj)} className="flex-1 py-2 text-xs font-semibold bg-white/5 text-ink-300 rounded hover:bg-[#ff4d6d]/10 hover:text-[#ff4d6d] transition-colors flex items-center justify-center gap-2"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Case Study' : 'New Case Study'} size="lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Project Title" value={formData.title} onChange={(e: any) => setFormData({ ...formData, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Slug" value={formData.slug} onChange={(e: any) => setFormData({ ...formData, slug: e.target.value })} placeholder="generated-from-title" />
            <Input label="Category" value={formData.category} onChange={(e: any) => setFormData({ ...formData, category: e.target.value })} placeholder="Business Systems, AI, Analytics..." />
          </div>
          <Textarea label="Description" value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} required />
          <Textarea label="Short Summary" value={formData.summary} onChange={(e: any) => setFormData({ ...formData, summary: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea label="Problem" value={formData.problem} onChange={(e: any) => setFormData({ ...formData, problem: e.target.value })} />
            <Textarea label="Objective" value={formData.objective} onChange={(e: any) => setFormData({ ...formData, objective: e.target.value })} />
            <Textarea label="My Role" value={formData.role} onChange={(e: any) => setFormData({ ...formData, role: e.target.value })} />
            <Textarea label="Solution / Approach" value={formData.approach} onChange={(e: any) => setFormData({ ...formData, approach: e.target.value })} />
            <Textarea label="Business Impact" value={formData.businessImpact} onChange={(e: any) => setFormData({ ...formData, businessImpact: e.target.value })} />
            <Textarea label="Verified Results / Metrics" value={formData.results} onChange={(e: any) => setFormData({ ...formData, results: e.target.value })} />
          </div>
          <Input label="Tech Stack (comma separated)" value={formData.stack} onChange={(e: any) => setFormData({ ...formData, stack: e.target.value })} required placeholder="React, Node.js, Firebase" />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="GitHub URL (Optional)" value={formData.githubUrl} onChange={(e: any) => setFormData({ ...formData, githubUrl: e.target.value })} />
            <Input label="Live URL (Optional)" value={formData.liveUrl} onChange={(e: any) => setFormData({ ...formData, liveUrl: e.target.value })} />
          </div>
          <Input label="Proof URL (Optional)" value={formData.proofUrl} onChange={(e: any) => setFormData({ ...formData, proofUrl: e.target.value })} placeholder="Link to metric verification or case study" />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-ink-500 uppercase tracking-widest">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e: any) => setFile(e.target.files?.[0])} className="text-sm text-ink-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#00f0ff]/10 file:text-[#00f0ff] hover:file:bg-[#00f0ff]/20 bg-ink-950/50 rounded-md p-2 border border-white/5" />
            {(editing?.imageUrl && !file) && <p className="text-xs text-ink-500 mt-1">Current image will be kept if no new file is selected.</p>}
          </div>

          <Input label="Display Order" type="number" value={formData.order} onChange={(e: any) => setFormData({ ...formData, order: Number(e.target.value) })} required />
          <div className="flex flex-wrap gap-6 text-sm text-ink-300">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.visible} onChange={e => setFormData({ ...formData, visible: e.target.checked })} /> Visible publicly</label>
          </div>
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" loading={loading} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">{editing ? 'Save Project' : 'Publish Project'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
