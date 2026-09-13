'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { User, LogOut, Upload, Link as LinkIcon, Briefcase } from 'lucide-react'
import { settingsService } from '@/lib/services'
import type { SiteSettings } from '@/types'
import { Input, Textarea, Button } from '@/components/ui'

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SiteSettings>()

  useEffect(() => {
    return settingsService.subscribe((s) => {
      setSettings(s)
      if (s) {
        reset(s)
        if (s.profileImage) setPreviewUrl(s.profileImage)
      }
    })
  }, [reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreviewUrl(URL.createObjectURL(f))
    }
  }

  const onSubmit = async (data: SiteSettings) => {
    try {
      await settingsService.update(data, file || undefined)
      toast.success('Settings updated successfully!')
      setFile(null)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings')
    }
  }

  if (!settings) return null

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-mono tracking-widest uppercase">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Profile Image Section */}
        <div className="bg-ink-900 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <User size={18} className="text-[#00f0ff]" />
            <h2 className="text-lg font-bold text-white">Profile Identity</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-ink-950 border border-white/10 relative flex items-center justify-center">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Profile" fill className="object-cover" />
                ) : (
                  <User size={32} className="text-ink-500" />
                )}
              </div>
              <label className="cursor-pointer">
                <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <span className="flex items-center gap-2 text-xs font-mono bg-white/5 hover:bg-white/10 text-ink-300 px-3 py-1.5 rounded-md transition-colors">
                  <Upload size={14} /> Upload Photo
                </span>
              </label>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <Input label="Full Name" {...register('name', { required: true })} />
              <Input label="Professional Role" placeholder="e.g. Founder & Engineer" {...register('role')} />
              <Input label="Tagline" placeholder="Brief 1-liner visible in Hero" {...register('tagline')} />
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="bg-ink-900 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Biography</h2>
          </div>
          <Textarea 
            label="About Text (Supports multiple paragraphs)" 
            rows={5} 
            {...register('bio')} 
          />
        </div>

        <div className="bg-ink-900 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase size={18} className="text-[#00f0ff]" />
            <h2 className="text-lg font-bold text-white">Now</h2>
          </div>
          <Textarea
            label="Current focus"
            rows={3}
            placeholder="Currently pursuing PGDM while building..."
            {...register('nowText')}
          />
        </div>

        {/* Contact Links */}
        <div className="bg-ink-900 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon size={18} className="text-[#7fff6e]" />
            <h2 className="text-lg font-bold text-white">Contact & Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Public Email" type="email" {...register('email')} />
            <Input label="Phone Number" {...register('phone')} />
            <Input label="Location (e.g. Mumbai, India)" {...register('location')} />
            <Input label="GitHub URL" {...register('githubUrl')} />
            <Input label="LinkedIn URL" {...register('linkedinUrl')} />
            <Input label="Academic Record / Credential URL" {...register('academicProofUrl')} />
            <Input label="Austrange Company / Product URL" {...register('companyUrl')} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input type="checkbox" id="availability" {...register('availability')} className="w-4 h-4 bg-ink-950 border-white/10 text-[#00f0ff] rounded" />
            <label htmlFor="availability" className="text-sm text-ink-300 font-mono">Available for Hire / Open to Work</label>
          </div>
        </div>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">
          Save Settings
        </Button>
      </form>
    </div>
  )
}
