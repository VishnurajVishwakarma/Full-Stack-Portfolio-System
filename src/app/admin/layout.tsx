'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { messagesService, uploadTracker } from '@/lib/services'
import { Spinner } from '@/components/ui'
import {
  LayoutDashboard, FolderOpen, Award, Image, FileText, Zap, MessageSquare,
  Settings, LogOut, ChevronRight, Menu, X, Gauge, Landmark, BookOpen, Newspaper, Radio
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Case Studies', icon: FolderOpen },
  { href: '/admin/metrics', label: 'Metrics', icon: Gauge },
  { href: '/admin/finance', label: 'Finance & Strategy', icon: Landmark },
  { href: '/admin/research', label: 'Research', icon: BookOpen },
  { href: '/admin/insights', label: 'Insights', icon: Newspaper },
  { href: '/admin/now', label: 'Now', icon: Radio },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/cv', label: 'CV Upload', icon: FileText },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ msg: '', percent: 0 })

  useEffect(() => {
    return uploadTracker.subscribe((msg, percent) => setUploadStatus({ msg, percent }))
  }, [])

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin') router.replace('/admin')
  }, [user, loading, pathname, router])

  useEffect(() => {
    if (!user) return
    return messagesService.subscribeUnread(setUnread)
  }, [user])

  if (loading) return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <Spinner size={32} />
    </div>
  )
  if (!user && pathname !== '/admin') return null

  if (pathname === '/admin') return <>{children}</>

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 flex flex-col w-64 h-screen bg-ink-900 border-r border-white/7 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/7">
          <div>
            <span className="font-display text-2xl text-[#00f0ff] tracking-widest">VV.</span>
            <span className="font-mono text-[10px] text-ink-500 ml-2 uppercase tracking-widest">Admin</span>
          </div>
          <button className="lg:hidden text-ink-400" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-600 px-3 mb-3">Navigation</p>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-all mb-0.5 ${active
                  ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-l-2 border-[#00f0ff] pl-[10px]'
                  : 'text-ink-400 hover:bg-white/5 hover:text-ink-100'}`}>
                <item.icon size={15} />
                <span className="flex-1">{item.label}</span>
                {item.badge && unread > 0 && (
                  <span className="bg-[#ff4d6d] text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unread}
                  </span>
                )}
                {active && <ChevronRight size={12} />}
              </Link>
            )
          })}

          <div className="border-t border-white/7 mt-4 pt-4">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-600 px-3 mb-3">System</p>
            <Link href="/" target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono text-ink-400 hover:bg-white/5 hover:text-ink-100 transition-all mb-0.5">
              <ChevronRight size={15} />
              View Portfolio
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/7">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/25 flex items-center justify-center text-[#00f0ff] text-xs font-mono font-bold">
              V
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-ink-200 truncate">Admin</p>
              <p className="font-mono text-[10px] text-ink-500 truncate">{user?.email}</p>
            </div>
            <button onClick={signOut} className="text-ink-500 hover:text-[#ff4d6d] transition-colors" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/7 flex items-center justify-between px-6 bg-ink-950/80 backdrop-blur flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-ink-400 hover:text-ink-100" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="font-mono text-xs text-ink-400 uppercase tracking-widest">
                {navItems.find(n => n.href === pathname)?.label || 'Admin'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {uploadStatus.msg ? (
              <div className="flex items-center justify-center gap-2 bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-3 py-1.5 rounded-full overflow-hidden">
                <div className="text-[#00f0ff] flex items-center justify-center translate-y-[1px]">
                  <Spinner size={12} />
                </div>
                <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-widest font-bold whitespace-nowrap">
                  {uploadStatus.msg}
                </span>
                
                {/* Visual Progress Bar Overlay */}
                <div 
                  className="absolute bottom-0 left-0 h-[2px] bg-[#00f0ff] transition-all duration-300 ease-out" 
                  style={{ width: `${uploadStatus.percent}%` }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7fff6e] animate-pulse shadow-[0_0_10px_rgba(127,255,110,0.5)]" />
                <span className="font-mono text-[10px] text-[#7fff6e] font-bold">
                  Connected to DB: Supabase
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
