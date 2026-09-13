import { supabase } from '@/lib/supabase'
import type {
  Project, Certificate, Skill, GalleryImage,
  CVFile, ContactMessage, SiteSettings, DashboardStats,
  Metric, FinanceItem, ResearchPublication, Article
} from '@/types'
import { v4 as uuidv4 } from 'uuid'
import imageCompression from 'browser-image-compression';

// ─── CACHE UTILITIES ─────────────────────────────────────────────────────────

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(`cache_${key}`)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        // Use cache if under 5 minutes old
        if (Date.now() - timestamp < 1000 * 60 * 5) {
          return data
        }
      } catch (e) {
        // Ignore JSON errors
      }
    }
  }

  const data = await fetcher()

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  return data
}

export const clearCache = (prefix?: string) => {
  if (typeof window !== 'undefined') {
    const keysToRemove: string[] = []
    
    // First, collect all keys that match our criteria
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i)
      if (k) {
        if (!prefix && k.startsWith('cache_')) {
          keysToRemove.push(k)
        } else if (prefix && k.startsWith(`cache_${prefix}`)) {
          keysToRemove.push(k)
        }
      }
    }
    
    // Then safely remove them
    keysToRemove.forEach(k => sessionStorage.removeItem(k))
  }
}

// ─── UPLOAD TRACKER ──────────────────────────────────────────────────────────

type ProgressCallback = (msg: string, percent: number) => void;
let listeners: ProgressCallback[] = [];

export const uploadTracker = {
  subscribe(fn: ProgressCallback) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn) };
  },
  emit(msg: string, percent: number) {
    listeners.forEach(l => l(msg, percent));
  }
}

const timestamp = () => new Date().toISOString()

async function uploadFile(file: File, bucket: string): Promise<string> {
  try {
    let fileToUpload = file;
    
    if (file.type.startsWith('image/') && !file.type.includes('svg') && !file.type.includes('gif')) {
      uploadTracker.emit(`Optimizing image...`, 15)
      const options = {
        maxSizeMB: 1, // Compress to max 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8
      }
      fileToUpload = await imageCompression(file, options)
    }

    uploadTracker.emit(`Initializing connection to Supabase Storage...`, 30)
    
    // Sanitize filename for Supabase (remove spaces and special chars)
    const safeName = fileToUpload.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
    const filePath = `${uuidv4()}-${safeName}`
    
    uploadTracker.emit(`Uploading ${fileToUpload.name}...`, 50)
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, { cacheControl: '3600', upsert: false })

    if (error) {
      console.error("Supabase Storage Upload Error:", error)
      throw new Error(`Upload Failed: ${error.message}`)
    }

    uploadTracker.emit(`Finalizing security tokens...`, 90)
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
      
    uploadTracker.emit(`Upload Complete! Syncing to Database...`, 100)
    setTimeout(() => uploadTracker.emit('', 0), 2000)
    
    return publicUrl
  } catch (error: any) {
    uploadTracker.emit(`Failed to start upload: ${error.message}`, 0)
    throw error
  }
}

async function deleteFile(url: string, bucket: string): Promise<void> {
  try {
    const parts = url.split('/')
    const fileName = parts[parts.length - 1]
    if (fileName) {
      await supabase.storage.from(bucket).remove([fileName])
    }
  } catch {
    // File may not exist — ignore
  }
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export const projectsService = {
  async getAll(publishedOnly = false): Promise<Project[]> {
    return fetchWithCache(`projects_v2_${publishedOnly}`, async () => {
      let query = supabase.from('projects').select('*').order('order')
      // Removed status filter entirely so admin-uploaded items always show
      const { data, error } = await query
      if (error) throw error
      return data as Project[]
    })
  },

  async getById(id: string): Promise<Project | null> {
    return fetchWithCache(`project_${id}`, async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (error) return null
      return data as Project
    })
  },

  async getBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()
    if (error) return null
    return data as Project
  },

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File): Promise<string> {
    let imageUrl = data.imageUrl
    if (imageFile) imageUrl = await uploadFile(imageFile, 'projects')
    const { data: res, error } = await supabase.from('projects').insert({
      ...data, imageUrl, status: 'published', createdAt: timestamp(), updatedAt: timestamp(),
    }).select().single()
    if (error) throw error
    clearCache('projects')
    return res.id
  },

  async update(id: string, data: Partial<Project>, imageFile?: File): Promise<void> {
    let imageUrl = data.imageUrl
    if (imageFile) {
      if (imageUrl) await deleteFile(imageUrl, 'projects')
      imageUrl = await uploadFile(imageFile, 'projects')
    }
    const { error } = await supabase.from('projects').update({ ...data, imageUrl, updatedAt: timestamp() }).eq('id', id)
    if (error) throw error
    clearCache('projects')
    clearCache(`project_${id}`)
  },

  async delete(id: string, imageUrl?: string): Promise<void> {
    if (imageUrl) await deleteFile(imageUrl, 'projects')
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    clearCache('projects')
    clearCache(`project_${id}`)
  },

  subscribe(callback: (projects: Project[]) => void, publishedOnly = false) {
    const fetchAndCall = async () => {
      const data = await this.getAll(publishedOnly)
      callback(data)
    }
    fetchAndCall()
    const channel = supabase.channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        clearCache('projects')
        fetchAndCall()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}

// ─── EXECUTIVE CONTENT ──────────────────────────────────────────────────────

function createContentService<T extends { id: string }>(table: string) {
  return {
    async getAll(): Promise<T[]> {
      const { data, error } = await supabase.from(table).select('*').order('order')
      // New sections stay gracefully empty until the checked-in migration is applied.
      if (error) return []
      return (data || []) as T[]
    },
    async getBySlug(slug: string): Promise<T | null> {
      const { data, error } = await supabase.from(table).select('*').eq('slug', slug).single()
      if (error) return null
      return data as T
    },
    async create(data: Omit<T, 'id'>): Promise<string> {
      const { data: result, error } = await supabase.from(table).insert(data).select('id').single()
      if (error) throw error
      clearCache(table)
      return result.id
    },
    async update(id: string, data: Partial<T>): Promise<void> {
      const { error } = await supabase.from(table).update(data).eq('id', id)
      if (error) throw error
      clearCache(table)
    },
    async delete(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      clearCache(table)
    },
    subscribe(callback: (items: T[]) => void) {
      const refresh = async () => callback(await this.getAll())
      refresh()
      const channel = supabase.channel(`${table}_changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, refresh)
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }
  }
}

export const metricsService = createContentService<Metric>('metrics')
export const financeService = createContentService<FinanceItem>('finance_items')
export const researchService = createContentService<ResearchPublication>('research_publications')
export const articlesService = createContentService<Article>('articles')

// ─── CERTIFICATES ─────────────────────────────────────────────────────────────

export const certificatesService = {
  async getAll(publishedOnly = false): Promise<Certificate[]> {
    return fetchWithCache(`certificates_v2_${publishedOnly}`, async () => {
      let query = supabase.from('certificates').select('*').order('order')
      // Removed status filter
      const { data, error } = await query
      if (error) throw error
      return data as Certificate[]
    })
  },

  async create(data: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File): Promise<string> {
    let imageUrl = data.imageUrl
    if (imageFile) imageUrl = await uploadFile(imageFile, 'certificates')
    const { data: res, error } = await supabase.from('certificates').insert({
      ...data, imageUrl, status: 'published', createdAt: timestamp(), updatedAt: timestamp(),
    }).select().single()
    if (error) throw error
    clearCache('certificates')
    return res.id
  },

  async update(id: string, data: Partial<Certificate>, imageFile?: File): Promise<void> {
    let imageUrl = data.imageUrl
    if (imageFile) {
      if (imageUrl) await deleteFile(imageUrl, 'certificates')
      imageUrl = await uploadFile(imageFile, 'certificates')
    }
    const { error } = await supabase.from('certificates').update({ ...data, imageUrl, updatedAt: timestamp() }).eq('id', id)
    if (error) throw error
    clearCache('certificates')
  },

  async delete(id: string, imageUrl?: string): Promise<void> {
    if (imageUrl) await deleteFile(imageUrl, 'certificates')
    const { error } = await supabase.from('certificates').delete().eq('id', id)
    if (error) throw error
    clearCache('certificates')
  },

  subscribe(callback: (certs: Certificate[]) => void, publishedOnly = false) {
    const fetchAndCall = async () => {
      const data = await this.getAll(publishedOnly)
      callback(data)
    }
    fetchAndCall()
    const channel = supabase.channel('certificates_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => {
        clearCache('certificates')
        fetchAndCall()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

export const skillsService = {
  async getAll(publishedOnly = false): Promise<Skill[]> {
    return fetchWithCache(`skills_v2_${publishedOnly}`, async () => {
      let query = supabase.from('skills').select('*').order('order')
      // Removed status filter
      const { data, error } = await query
      if (error) throw error
      return data as Skill[]
    })
  },

  async create(data: Omit<Skill, 'id'>): Promise<string> {
    const { data: res, error } = await supabase.from('skills').insert({
      ...data, status: 'published'
    }).select().single()
    if (error) throw error
    clearCache('skills')
    return res.id
  },

  async update(id: string, data: Partial<Skill>): Promise<void> {
    const { error } = await supabase.from('skills').update(data).eq('id', id)
    if (error) throw error
    clearCache('skills')
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) throw error
    clearCache('skills')
  },

  subscribe(callback: (skills: Skill[]) => void) {
    const fetchAndCall = async () => {
      const data = await this.getAll(true)
      callback(data)
    }
    fetchAndCall()
    const channel = supabase.channel('skills_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        clearCache('skills')
        fetchAndCall()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

export const galleryService = {
  async getAll(publishedOnly = false): Promise<GalleryImage[]> {
    return fetchWithCache(`gallery_all_${publishedOnly}`, async () => {
      let query = supabase.from('gallery').select('*').order('order')
      if (publishedOnly) query = query.eq('status', 'published')
      const { data, error } = await query
      if (error) throw error
      return data as GalleryImage[]
    })
  },

  async upload(file: File, caption?: string, tag?: string): Promise<string> {
    const url = await uploadFile(file, 'gallery')
    const { count } = await supabase.from('gallery').select('*', { count: 'exact', head: true })
    
    const { data: res, error } = await supabase.from('gallery').insert({
      url, caption: caption || '', tag: tag || '',
      order: count || 0, status: 'published', createdAt: timestamp(),
    }).select().single()
    if (error) throw error
    clearCache('gallery')
    return res.id
  },

  async update(id: string, data: Partial<GalleryImage>): Promise<void> {
    const { error } = await supabase.from('gallery').update(data).eq('id', id)
    if (error) throw error
    clearCache('gallery')
  },

  async delete(id: string, url: string): Promise<void> {
    await deleteFile(url, 'gallery')
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw error
    clearCache('gallery')
  },

  subscribe(callback: (images: GalleryImage[]) => void) {
    const fetchAndCall = async () => {
      const data = await this.getAll(true)
      callback(data)
    }
    fetchAndCall()
    const channel = supabase.channel('gallery_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
        clearCache('gallery')
        fetchAndCall()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}

// ─── CV ───────────────────────────────────────────────────────────────────────

export const cvService = {
  async getActive(): Promise<CVFile | null> {
    return fetchWithCache(`cv_active`, async () => {
      const { data, error } = await supabase.from('cv').select('*').eq('active', true).limit(1).single()
      if (error) return null
      return data as CVFile
    })
  },

  async getAll(): Promise<CVFile[]> {
    return fetchWithCache(`cv_all`, async () => {
      const { data, error } = await supabase.from('cv').select('*').order('uploadedAt', { ascending: false })
      if (error) throw error
      return data as CVFile[]
    })
  },

  async upload(file: File, version: string): Promise<string> {
    const url = await uploadFile(file, 'cv')
    await supabase.from('cv').update({ active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
    const { data: res, error } = await supabase.from('cv').insert({
      url, filename: file.name, version, uploadedAt: timestamp(), active: true,
    }).select().single()
    if (error) throw error
    clearCache('cv')
    return res.id
  },

  async setActive(id: string): Promise<void> {
    await supabase.from('cv').update({ active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('cv').update({ active: true }).eq('id', id)
    clearCache('cv')
  },

  async delete(id: string, url: string): Promise<void> {
    await deleteFile(url, 'cv')
    const { error } = await supabase.from('cv').delete().eq('id', id)
    if (error) throw error
    clearCache('cv')
  },
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export const messagesService = {
  async create(data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<void> {
    const { error } = await supabase.from('messages').insert({
      ...data, read: false, createdAt: timestamp(),
    })
    if (error) throw error
    clearCache('messages')
  },

  async getAll(): Promise<ContactMessage[]> {
    return fetchWithCache(`messages_all`, async () => {
      const { data, error } = await supabase.from('messages').select('*').order('createdAt', { ascending: false })
      if (error) throw error
      return data as ContactMessage[]
    })
  },

  async markRead(id: string): Promise<void> {
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id)
    if (error) throw error
    clearCache('messages')
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) throw error
    clearCache('messages')
  },

  subscribeUnread(callback: (count: number) => void) {
    const fetchAndCall = async () => {
      const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false)
      callback(count || 0)
    }
    fetchAndCall()
    const channel = supabase.channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        clearCache('messages')
        fetchAndCall()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    return fetchWithCache(`settings_site`, async () => {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'site').single()
      if (error || !data) {
        return {
          name: '',
          role: '',
          tagline: '',
          bio: '',
          email: '',
          phone: '',
          location: '',
          githubUrl: '',
          linkedinUrl: '',
          availability: false,
          profileImage: '',
          nowText: '',
          academicProofUrl: '',
          companyUrl: ''
        } as SiteSettings
      }
      return data as SiteSettings
    })
  },

  async update(data: Partial<SiteSettings>, imageFile?: File): Promise<void> {
    let profileImage = data.profileImage
    if (imageFile) profileImage = await uploadFile(imageFile, 'gallery') // store in gallery bucket

    const { error } = await supabase.from('settings').upsert({ id: 'site', ...data, profileImage })
    if (error) throw error
    clearCache('settings')
  },

  subscribe(callback: (settings: SiteSettings) => void) {
    const fetchAndCall = async () => {
      const data = await this.get()
      if (data) callback(data)
    }
    fetchAndCall()
    const channel = supabase.channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        clearCache('settings')
        fetchAndCall()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchWithCache(`dashboard_stats`, async () => {
    const [projectsRes, pubProjectsRes, certsRes, skillsRes, galleryRes, messagesRes] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('certificates').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false),
    ])
    
    return {
      totalProjects: projectsRes.count || 0,
      publishedProjects: pubProjectsRes.count || 0,
      totalCertificates: certsRes.count || 0,
      totalSkills: skillsRes.count || 0,
      totalImages: galleryRes.count || 0,
      unreadMessages: messagesRes.count || 0,
    }
  })
}
