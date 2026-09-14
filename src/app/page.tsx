'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowDown, ArrowRight, Award, BarChart3, BookOpen, Briefcase, Check, CheckCircle2, Copy, Github, Layers3, Linkedin, Mail, MapPin, Menu, X } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { articlesService, cvService, financeService, messagesService, metricsService, projectsService, researchService, settingsService } from '@/lib/services'
import type { Article, CVFile, FinanceItem, Metric, Project, ResearchPublication, SiteSettings } from '@/types'

const ZAPRILL_SITE = 'https://www.zaprill.com/'
const ZAPRILL_APP = 'https://app.zaprill.com/'
const AUSTRANGE = 'https://in.linkedin.com/company/austrange-solutions'
const CIEL = 'https://www.cielhub.org/about#joint-steering-committee'
const LINKEDIN = 'https://in.linkedin.com/in/vishnuraj-vishwakarma'
const GITHUB = 'https://github.com/VishnurajVishwakarma'
const PORTRAIT = 'https://peujmdmnwsbafoqvwclx.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-09-14%20at%205.48.15%20AM.jpeg'
const reveal = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-70px' }, transition: { duration: .38 } }

function SocialLinks({ settings, compact = false }: { settings: SiteSettings | null, compact?: boolean }) {
  const links = [{ label: 'LinkedIn', href: settings?.linkedinUrl || LINKEDIN, icon: Linkedin }, { label: 'GitHub', href: settings?.githubUrl || GITHUB, icon: Github }]
  return <div className="flex flex-wrap items-center gap-2">{links.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`Vishnuraj Vishwakarma on ${label}`} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] text-[#d7d2c8] transition hover:border-[#c8a96b]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96b] ${compact ? 'h-10 w-10 px-0' : 'px-4 text-sm'}`}><Icon size={17} />{!compact && label}</a>)}</div>
}

function Header({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen] = useState(false)
  const links = [['Building', '/#building'], ['Work', '/#work'], ['Thinking', '/#thinking'], ['About', '/#about']]
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.08] bg-[#0a0a09]/90 backdrop-blur-xl">
    <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
      <Link href="/#home" className="flex min-w-0 items-center gap-2.5 py-2 text-sm font-semibold tracking-[-.02em] text-[#f3f0e8] sm:gap-4 sm:text-base">
        <svg width="26" height="20" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-white" aria-hidden="true">
          <path d="M2 3L9.5 21L17 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 3L22.5 21L30 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-semibold tracking-[0.03em] text-xs sm:text-base text-white truncate">
          VISHNURAJ VISHWAKARMA<span className="text-[#c8a96b]">.</span>
        </span>
      </Link>

      <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="rounded-lg px-4 py-2 text-sm text-[#a7a39a] hover:text-[#f3f0e8] hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96b]">
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2.5 md:flex">
        <a href={settings?.linkedinUrl || LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#d7d2c8] transition hover:border-[#c8a96b]/40 hover:text-white">
          <Linkedin size={18} />
        </a>
        <a href={settings?.githubUrl || GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#d7d2c8] transition hover:border-[#c8a96b]/40 hover:text-white">
          <Github size={18} />
        </a>
        <Link href="/#contact" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#c8a96b]/50 bg-white/[0.02] px-4 text-sm font-medium text-[#f3f0e8] transition hover:bg-[#c8a96b]/10 hover:border-[#c8a96b]">
          Let&apos;s Talk <ArrowRight size={14} />
        </Link>
      </div>

      <button aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#f3f0e8] hover:bg-white/5 md:hidden">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>

    {open && (
      <nav aria-label="Mobile navigation" className="border-t border-white/[.08] bg-[#0a0a09]/95 backdrop-blur-2xl px-5 py-4 md:hidden">
        {[...links, ['Zaprill', ZAPRILL_SITE], ["Let's Talk", '/#contact']].map(([label, href]) => (
          <a key={label} href={href} onClick={() => setOpen(false)} className="block min-h-11 rounded-lg px-3 py-2.5 text-base font-medium text-[#d7d2c8] hover:bg-white/5 hover:text-white transition-colors">
            {label}
          </a>
        ))}
        <div className="mt-3 flex items-center gap-3 border-t border-white/[.08] px-3 pt-3">
          <SocialLinks settings={settings} />
        </div>
      </nav>
    )}
  </header>
}

function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.25em] text-[#c8a96b]">{children}</p> }
function SectionHeading({ eyebrow, title, copy }: { eyebrow: string, title: string, copy?: string }) { return <div className="mb-12 max-w-4xl md:mb-14"><Eyebrow>{eyebrow}</Eyebrow><h2 className="text-4xl font-medium leading-[1.05] tracking-[-.04em] text-[#f3f0e8] sm:text-6xl">{title}</h2>{copy && <p className="mt-6 max-w-2xl text-base leading-8 text-[#a7a39a] sm:text-lg">{copy}</p>}</div> }

function FounderVisual() {
  const reduced = useReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 85, damping: 20 }), sy = useSpring(my, { stiffness: 85, damping: 20 })
  const rotateY = useTransform(sx, [-.5, .5], [-3, 3]), rotateX = useTransform(sy, [-.5, .5], [2, -2])

  return (
    <div
      className="relative w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[660px] xl:max-w-[720px] [perspective:1200px]"
      onPointerMove={event => {
        if (reduced || event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        mx.set((event.clientX - rect.left) / rect.width - .5)
        my.set((event.clientY - rect.top) / rect.height - .5)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
    >
      <motion.div
        style={reduced ? undefined : { rotateX, rotateY }}
        className="relative w-full aspect-[682/885]"
      >
        {/* 1. Coded CSS Warm Radial Glow (z-0) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[40%] top-[36%] -translate-x-1/2 -translate-y-1/2 z-0 h-[320px] w-[320px] sm:h-[460px] sm:w-[460px] lg:h-[560px] lg:w-[560px] rounded-full bg-[radial-gradient(circle,rgba(212,170,92,0.25)_0%,rgba(180,135,60,0.08)_40%,transparent_70%)] blur-3xl"
        />

        {/* 2. Coded SVG Golden Halo Arc (z-0, behind portrait) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 sm:-left-20 top-4 sm:top-8 z-0 h-[340px] w-[340px] sm:h-[480px] sm:w-[480px] lg:h-[580px] lg:w-[580px]"
        >
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <defs>
              <linearGradient id="goldHaloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5dd9d" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#d4aa5c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#9e7529" stopOpacity="0.2" />
              </linearGradient>
              <filter id="haloGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur1" />
                <feGaussianBlur stdDeviation="2.5" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="250"
              cy="250"
              r="220"
              stroke="url(#goldHaloGradient)"
              strokeWidth="2.5"
              filter="url(#haloGlow)"
            />
          </svg>
        </div>

        {/* 3. True Transparent PNG Cutout of Vishnuraj (z-10) */}
        <div className="relative z-10 h-full w-full">
          <Image
            src="/images/vishnu-portrait.png"
            alt="Vishnuraj Vishwakarma - Founder, Builder, Operator"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px"
            className="object-contain object-bottom select-none pointer-events-none"
          />
        </div>

        {/* 4. Coded Signature Quote on Right Side (z-20) */}
        <div className="pointer-events-none absolute right-1 sm:right-3 top-[26%] sm:top-[28%] z-20 select-none">
          <Image
            src="/images/quote-pure.png"
            alt="Better Ideas. A Brighter Tomorrow."
            width={200}
            height={110}
            className="w-28 sm:w-40 md:w-48 h-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
          />
        </div>
      </motion.div>
    </div>
  )
}

function PromotionCard({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText('H2VISHNU')
      setCopied(true)
      toast.success('Founder code H2VISHNU copied!')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      toast.error('Copy failed. Code: H2VISHNU')
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#c8a96b]/35 bg-[#0b0b0a]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md transition-all hover:border-[#c8a96b]/60 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(212,170,92,0.18)_0%,transparent_70%)] blur-xl" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:divide-x sm:divide-white/10 gap-4 sm:gap-6">
        <div className="flex flex-col justify-between sm:pr-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#e5c98e]">50%</span>
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">OFF</span>
            </div>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em] text-stone-300">ON ZAPRILL</p>
          </div>
          <a href={ZAPRILL_SITE} target="_blank" rel="noreferrer" className="mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#dcb162] hover:bg-[#eac47a] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0a0a09] transition-all shadow-md active:scale-95">
            Try Zaprill Now <ArrowRight size={14} />
          </a>
        </div>

        <div className="h-px w-full bg-white/10 sm:hidden" />

        <div className="flex flex-1 flex-col justify-between sm:pl-6">
          <div>
            <p className="text-xs text-stone-400 font-normal">Use founder code</p>
            <button type="button" onClick={copyCode} aria-label="Copy founder promotion code H2VISHNU" className="group mt-1.5 flex h-10 w-full items-center justify-between rounded-lg border border-white/15 bg-black/60 px-3.5 text-left transition hover:border-[#c8a96b]/60 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96b]">
              <span className="font-bold tracking-[0.16em] text-[#e5c98e] text-sm sm:text-base select-all">H2VISHNU</span>
              <span className="ml-3 flex h-7 w-7 items-center justify-center rounded text-stone-400 group-hover:text-white transition-colors">
                {copied ? <Check size={16} className="text-[#9eba72]" /> : <Copy size={16} />}
              </span>
            </button>
            <p className="mt-1.5 text-xs text-stone-400">Your exclusive founder offer.</p>
          </div>

          <div className="mt-2.5 pt-1 sm:pt-0">
            <span className="inline-block border-b border-stone-600/60 pb-0.5 text-[11px] text-stone-400">
              Available through Vishnu —
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero({ settings }: { settings: SiteSettings | null }) {
  const status = [
    { icon: MapPin, title: settings?.location || 'Mumbai, India', copy: 'Based in India' },
    { icon: Briefcase, title: 'Founder & COO', copy: 'Austrange Solutions' },
    { icon: Layers3, title: 'AI Systems', copy: 'Zaprill' }
  ]

  return (
    <section id="home" className="relative overflow-hidden border-b border-white/[.08] pt-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(212,170,92,0.12),transparent_55%)]" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1600px] items-center gap-8 px-5 py-8 md:px-10 md:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-8 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="order-2 z-10 lg:order-1 flex flex-col justify-center"
        >
          <p className="mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a96b]">
            FOUNDER · BUILDER · OPERATOR
          </p>

          <h1 className="text-[clamp(2.75rem,5.2vw,5.2rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white">
            Vishnuraj<br />
            Vishwakarma<span className="text-[#c8a96b]">.</span>
          </h1>

          <p className="mt-5 sm:mt-6 max-w-xl text-xl sm:text-2xl md:text-[1.75rem] leading-snug tracking-[-0.02em] text-[#d7d2c8]">
            Building products, businesses<br className="hidden sm:block" /> and systems.
          </p>

          <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#8a867e]">
            At the intersection of AI, technology and business.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={ZAPRILL_SITE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 sm:min-h-12 items-center justify-center gap-2 rounded-lg bg-[#d4aa5c] hover:bg-[#dfba6f] px-6 sm:px-7 py-3 text-sm font-semibold text-[#0a0a09] transition-all duration-200 shadow-[0_4px_20px_rgba(212,170,92,0.22)] active:scale-95"
            >
              Explore Zaprill <ArrowRight size={16} />
            </a>

            <Link
              href="/#work"
              className="inline-flex min-h-11 sm:min-h-12 items-center justify-center rounded-lg border border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/35 px-6 sm:px-7 py-3 text-sm font-medium text-[#f3f0e8] transition-all duration-200 active:scale-95"
            >
              View My Work
            </Link>
          </div>

          <div className="mt-6 max-w-lg">
            <PromotionCard />
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/[.08] pt-6 grid-cols-1 sm:grid-cols-3">
            {status.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon size={19} className="shrink-0 text-[#e7e1d6]" />
                <div>
                  <p className="text-sm font-medium text-[#f3f0e8]">{title}</p>
                  <p className="mt-0.5 text-xs text-[#77746d]">{copy}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#building"
            className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#77746d] hover:text-[#c8a96b] transition-colors"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:border-[#c8a96b]/50">
              <ArrowDown size={13} />
            </span>
            SCROLL TO EXPLORE
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="order-1 lg:order-2 flex justify-center lg:justify-end items-end h-full w-full self-end"
        >
          <FounderVisual />
        </motion.div>
      </div>
    </section>
  )
}

function Building() {
  const ventures = [{ n: '01', name: 'ZAPRILL', type: 'AI Career Intelligence', copy: 'Know Your Worth. Get the Job.', href: ZAPRILL_SITE, cta: 'Explore Zaprill', second: ZAPRILL_APP, secondLabel: 'Launch App' }, { n: '02', name: 'AUSTRANGE SOLUTIONS', type: 'Technology · Innovation · Business', copy: 'Building accessible technology and solutions for real-world problems.', href: AUSTRANGE, cta: 'Visit Austrange' }, { n: '03', name: 'CIEL', type: 'Professional · Institutional · Strategic', copy: 'Official CIEL involvement and Joint Steering Committee reference.', href: CIEL, cta: 'View CIEL' }]
  return <section id="building" className="border-b border-white/[.08] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="02 / Currently" title="What I’m Building" /><div className="grid gap-4 lg:grid-cols-3">{ventures.map((v, index) => <motion.article key={v.name} {...reveal} transition={{ duration: .35, delay: index * .05 }} whileHover={{ y: -5, rotateX: 1.5 }} className="flex min-h-[340px] flex-col rounded-xl border border-white/[.09] bg-[#0f0f0e] p-7 shadow-2xl shadow-black/20 [transform-style:preserve-3d] sm:p-8"><span className="text-xs text-[#716e67]">{v.n}</span><p className="mt-12 text-2xl font-medium tracking-[-.03em] text-[#f3f0e8]">{v.name}</p><p className="mt-3 text-xs uppercase leading-6 tracking-[.16em] text-[#c8a96b]">{v.type}</p><p className="mt-6 flex-1 text-base leading-7 text-[#96928a]">{v.copy}</p><div className="mt-8 flex flex-wrap gap-4"><a href={v.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#f3f0e8] hover:text-[#c8a96b]">{v.cta} <ArrowRight size={15} /></a>{v.second && <a href={v.second} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm text-[#c8a96b]">{v.secondLabel}</a>}</div></motion.article>)}</div></div></section>
}

function ProductInterface() {
  const items = [['Salary Intelligence', '₹ Market range'], ['ATS Intelligence', 'Profile signals'], ['Skill Intelligence', 'Next skills'], ['Job Intelligence', 'Matched opportunities']]
  return <div aria-label="Zaprill product interface preview" className="relative overflow-hidden rounded-xl border border-white/10 bg-[#10110f] p-4 shadow-[0_45px_100px_rgba(0,0,0,.55)] sm:p-7"><div className="flex items-center justify-between border-b border-white/[.08] pb-4"><div><p className="text-[10px] uppercase tracking-[.24em] text-[#716e67]">Zaprill intelligence</p><p className="mt-1 text-sm font-medium text-[#f3f0e8]">Career command center</p></div><span className="flex items-center gap-2 text-xs text-[#9eba72]"><span className="h-1.5 w-1.5 rounded-full bg-[#9eba72]" /> Live</span></div><div className="grid gap-3 pt-4 sm:grid-cols-2">{items.map(([title, copy], i) => <motion.div key={title} whileHover={{ scale: 1.02, z: 20 }} className="rounded border border-white/[.07] bg-white/[.025] p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#c8a96b]">0{i + 1}</span><CheckCircle2 size={14} className="text-[#9eba72]" /></div><p className="mt-6 text-sm font-medium text-[#f3f0e8]">{title}</p><p className="mt-2 text-xs leading-5 text-[#77746d]">{copy}</p></motion.div>)}</div></div>
}

function Zaprill() {
  return <section id="zaprill" className="relative overflow-hidden border-b border-white/[.08] px-5 py-24 md:px-10 md:py-32"><div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8a96b]/[.04] blur-3xl" /><div className="relative mx-auto max-w-[1440px]"><SectionHeading eyebrow="03 / Flagship Product" title="Know Your Worth. Get the Job." copy="Zaprill is an AI-powered career intelligence and salary transparency platform." /><div className="grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]"><motion.div {...reveal} className="[perspective:1400px]"><motion.div whileHover={{ rotateX: 2, rotateY: -2 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}><ProductInterface /></motion.div><div className="mx-auto h-4 w-4/5 rounded-b-2xl bg-gradient-to-b from-[#37352f] to-[#151513] shadow-xl" /></motion.div><div><p className="text-xl leading-9 text-[#d7d2c8]">Career decisions become clearer when market, salary, resume and skill signals live in one system.</p><div className="mt-8"><PromotionCard /></div><p className="mt-8 text-sm leading-7 text-[#77746d]">Built with the product team.<br /><span className="text-[#d7d2c8]">Vishnuraj Vishwakarma</span><br />AI Systems · Product · Operations · Market Intelligence</p><div className="3mt-8 flex flex-col gap-3 sm:flex-row"><a href={ZAPRILL_APP} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded border border-[#c8a96b]/50 px-6 text-sm font-semibold text-[#f3f0e8]">Open App <ArrowRight size={16} /></a><a href={ZAPRILL_SITE} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded border border-white/15 px-6 text-sm text-[#f3f0e8]">Visit Website</a></div></div></div></div></section>
}

function Founder({ settings }: { settings: SiteSettings | null }) {
  const lenses = [['Technology', 'AI · Software · Data · Automation'], ['Business', 'Operations · Products · Growth'], ['Finance', 'Analysis · Valuation · Markets'], ['Strategy', 'Research · Competition · Execution']]
  return <section id="about" className="border-b border-white/[.08] bg-[#0d0d0c] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-2xl border border-white/10"><Image src={PORTRAIT} alt="Vishnuraj Vishwakarma" fill priority sizes="(max-width: 1024px) 90vw, 34vw" className="object-cover object-top" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" /></div><div className="mt-5"><SocialLinks settings={settings} /></div></div><motion.div {...reveal}><SectionHeading eyebrow="04 / The Founder" title="I’m Vishnuraj." /><div className="max-w-3xl space-y-5 text-lg leading-8 text-[#b9b4aa]"><p>My background started in technology and data.</p><p>Over time, my focus expanded from building systems to understanding the businesses behind them.</p><p>Today I work across technology, AI, operations and business—while developing deeper expertise in finance and strategy.</p><p className="text-[#f3f0e8]">I enjoy taking an idea, understanding the problem behind it, and turning it into something people can actually use.</p></div><div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2">{lenses.map(([title, copy]) => <div key={title} className="bg-[#0d0d0c] p-6"><p className="font-medium text-[#f3f0e8]">{title}</p><p className="mt-2 text-sm leading-6 text-[#77746d]">{copy}</p></div>)}</div></motion.div></div></section>
}

function Work({ projects }: { projects: Project[] }) {
  const visible = projects.filter(p => p.visible !== false).sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 5)
  if (!visible.length) return null
  return <section id="work" className="border-b border-white/[.08] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="05 / Selected Work" title="Things I’ve Built" copy="A focused set of products, systems and outcomes—not a project wall." /><div className="grid gap-4 lg:grid-cols-2">{visible.map((item, index) => <motion.article key={item.id} {...reveal} className={`overflow-hidden rounded-xl border border-white/[.09] bg-[#11110f] ${index === 0 ? 'lg:col-span-2' : ''}`}><div className="grid h-full md:grid-cols-[.85fr_1.15fr]">{item.imageUrl ? <div className="relative min-h-64"><Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover opacity-85" /></div> : <div className="flex min-h-52 items-center justify-center border-b border-white/[.08] bg-white/[.02] md:border-b-0 md:border-r"><BarChart3 size={42} className="text-[#c8a96b]" /></div>}<div className="flex flex-col p-7 sm:p-9"><p className="text-xs uppercase tracking-[.2em] text-[#c8a96b]">{item.category || 'Project'}</p><h3 className="mt-5 text-3xl font-medium tracking-[-.03em] text-[#f3f0e8]">{item.title}</h3><p className="mt-5 flex-1 text-sm leading-7 text-[#96928a]">{item.summary || item.description}</p><Link href={`/case-studies/${item.slug || item.id}`} className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-[#f3f0e8] hover:text-[#c8a96b]">Explore case study <ArrowRight size={16} /></Link></div></div></motion.article>)}</div></div></section>
}

function Finance({ items }: { items: FinanceItem[] }) {
  const visible = items.filter(i => i.visible !== false).slice(0, 4), areas = ['Business Analysis', 'Financial Analysis', 'Valuation', 'Strategy', 'Market Research', 'Capital & Operations']
  return <section className="border-b border-white/[.08] bg-[#0d0d0c] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="06 / Finance & Strategy" title="Beyond Technology." copy="Developing deeper expertise in finance, valuation and strategic decision-making." /><div className="grid gap-px bg-white/[.09] sm:grid-cols-2 lg:grid-cols-3">{areas.map(a => <div key={a} className="bg-[#0d0d0c] p-6 text-sm text-[#d7d2c8]">{a}</div>)}</div>{visible.length > 0 && <div className="mt-10 divide-y divide-white/[.09] border-y border-white/[.09]">{visible.map(item => <Link key={item.id} href="/finance" className="group flex min-h-20 items-center justify-between gap-5 py-5"><div><p className="text-xs uppercase tracking-[.18em] text-[#c8a96b]">{item.category}</p><h3 className="mt-2 text-xl text-[#f3f0e8]">{item.title}</h3></div><ArrowRight className="text-[#5d5a54] group-hover:text-[#c8a96b]" /></Link>)}</div>}<Link href="/finance" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-[#f3f0e8] hover:text-[#c8a96b]">Finance & Strategy Research <ArrowRight size={16} /></Link></div></section>
}

function Proof({ metrics }: { metrics: Metric[] }) {
  const defaults = [['9.4', 'B.Sc IT SGPA'], ['₹3L', 'Ideation Competition'], ['35%', 'Engagement Improvement'], ['80%', 'Manual Entry Reduction'], ['60%', 'Workflow Effort Reduction']], visible = metrics.filter(m => m.visible !== false && m.value?.trim())
  const data = visible.length ? visible.map(m => [m.value, m.label, m.description || '']) : defaults
  return <section className="border-b border-white/[.08] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="07 / Proof" title="Evidence > Claims" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{data.slice(0, 5).map(([value, label, evidence], i) => <motion.article key={`${value}-${label}`} {...reveal} transition={{ duration: .35, delay: i * .04 }} className="relative min-h-56 overflow-hidden rounded-xl border border-white/[.09] bg-[#0f0f0e] p-6"><div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#c8a96b]/20 [transform:rotateX(60deg)]" /><p className="text-4xl font-semibold tracking-[-.05em] text-[#f3f0e8]">{value}</p><p className="mt-4 text-sm leading-6 text-[#96928a]">{label}</p>{evidence?.startsWith('http') && <a href={evidence} target="_blank" rel="noreferrer" className="absolute bottom-5 left-6 inline-flex min-h-11 items-center gap-2 text-xs text-[#c8a96b]">View Evidence <ArrowRight size={14} /></a>}</motion.article>)}</div></div></section>
}

function Thinking({ articles, research }: { articles: Article[], research: ResearchPublication[] }) {
  const visibleArticles = articles.filter(i => i.visible !== false).slice(0, 4), visibleResearch = research.filter(i => i.visible !== false).slice(0, 2), topics = ['AI × Business', 'Finance × Technology', 'Indian Businesses', 'Career Intelligence', 'AI-Native Companies', 'Strategy']
  return <section id="thinking" className="border-b border-white/[.08] bg-[#0d0d0c] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="08 / Research & Thinking" title="Thinking in Public" copy="What I’m researching—and what I think." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{topics.map((t, i) => <motion.div key={t} whileHover={{ y: -4 }} className="rounded-lg border border-white/10 bg-[#11110f] p-6"><span className="text-xs text-[#c8a96b]">0{i + 1}</span><p className="mt-8 text-lg text-[#d7d2c8]">{t}</p></motion.div>)}</div>{visibleArticles.length > 0 && <div className="mt-10 grid gap-5 md:grid-cols-2">{visibleArticles.map(item => <Link key={item.id} href={`/insights/${item.slug}`} className="group border-t border-white/[.09] py-7"><p className="text-xs uppercase tracking-[.18em] text-[#c8a96b]">{item.category}</p><h3 className="mt-3 text-2xl text-[#f3f0e8] group-hover:text-[#c8a96b]">{item.title}</h3><p className="mt-4 text-sm leading-7 text-[#77746d]">{item.excerpt}</p></Link>)}</div>}{visibleResearch.length > 0 && <Link href="/research" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-[#f3f0e8]"><BookOpen size={16} /> View research & publications</Link>}</div></section>
}

function Experience() {
  const roles = [['Austrange Solutions', 'Founder & COO', 'Business operations · Systems · Technology · Execution', AUSTRANGE], ['CIEL', 'Institutional / Professional Work', 'Official Joint Steering Committee reference', CIEL], ['Vishnushakti Foundation', 'Web Development / Analytics', 'Web systems · Automation · Data', '']]
  return <section className="border-b border-white/[.08] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="09 / Experience" title="Where I’ve Been Building" /><div className="divide-y divide-white/[.09] border-y border-white/[.09]">{roles.map(([company, role, copy, href], i) => <article key={company} className="grid gap-4 py-8 sm:grid-cols-[70px_1fr_1fr_auto] sm:items-center"><span className="text-xs text-[#5d5a54]">0{i + 1}</span><div><p className="text-xl text-[#f3f0e8]">{company}</p><p className="mt-2 text-sm text-[#c8a96b]">{role}</p></div><p className="text-sm leading-7 text-[#77746d]">{copy}</p>{href && <a href={href} target="_blank" rel="noreferrer" aria-label={`View ${company}`} className="inline-flex h-11 w-11 items-center justify-center rounded border border-white/10 text-[#d7d2c8] hover:text-[#c8a96b]"><ArrowRight size={16} /></a>}</article>)}</div></div></section>
}

function Recognition() {
  const items = [['₹3,00,000', 'MSSU Ideation Competition 2.0'], ['1st Place', 'TECH-MANIA 2k25'], ['1st Place', 'NAVINNYA 2023'], ['9.4 SGPA', 'Merit Scholarship']]
  return <section className="border-b border-white/[.08] bg-[#0d0d0c] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><SectionHeading eyebrow="10 / Awards" title="Recognition" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(([value, label], i) => <motion.article key={label} whileHover={{ y: -5, rotateY: i % 2 ? -2 : 2 }} className="relative min-h-64 overflow-hidden rounded-xl border border-white/[.09] bg-[#10100f] p-7 [perspective:900px]"><Award className="text-[#c8a96b]" size={30} /><div className="absolute right-5 top-5 h-20 w-20 rounded-full border border-[#c8a96b]/15 shadow-[inset_0_0_30px_rgba(200,169,107,.06)]" /><p className="mt-20 text-3xl font-semibold text-[#f3f0e8]">{value}</p><p className="mt-3 text-sm leading-6 text-[#96928a]">{label}</p></motion.article>)}</div></div></section>
}

function Now({ settings }: { settings: SiteSettings | null }) { return <section className="border-b border-white/[.08] px-5 py-20 md:px-10 md:py-24"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-end"><div><Eyebrow>11 / Now</Eyebrow><h2 className="text-4xl font-medium tracking-[-.04em] text-[#f3f0e8] sm:text-6xl">What I’m working on now.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-[#96928a] sm:text-lg">{settings?.nowText || 'Building products, operating businesses, contributing to CIEL, and developing deeper expertise in finance, strategy and AI.'}</p></div><Link href="/now" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded border border-[#c8a96b]/50 px-6 text-sm text-[#f3f0e8] hover:bg-[#c8a96b]/10">Open Now <ArrowRight size={16} /></Link></div></section> }

function Contact({ settings, cv }: { settings: SiteSettings | null, cv: CVFile | null }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm(), email = settings?.email || 'vishnurajvishwakarma@gmail.com'
  const submit = async (data: any) => { try { await messagesService.create(data); toast.success('Message received.'); reset() } catch { toast.error('Could not send your message. Please try again.') } }
  return <section id="contact" className="px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-[1440px]"><Eyebrow>12 / Contact</Eyebrow><h2 className="max-w-5xl text-5xl font-medium leading-[1.02] tracking-[-.05em] text-[#f3f0e8] sm:text-7xl lg:text-8xl">What’s worth building next?</h2><p className="mt-7 text-lg text-[#96928a] sm:text-xl">Products · Businesses · AI · Finance · Strategic collaborations</p><div className="mt-14 grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><h3 className="text-3xl text-[#f3f0e8]">Let’s build.</h3><div className="mt-6"><SocialLinks settings={settings} /></div><div className="mt-4 flex flex-col gap-1"><a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-3 text-sm text-[#d7d2c8] hover:text-[#c8a96b]"><Mail size={16} />{email}</a>{cv?.url && <a href={cv.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-3 text-sm text-[#c8a96b]">Résumé <ArrowRight size={15} /></a>}</div><p className="mt-7 text-sm text-[#716e67]">{settings?.location || 'Mumbai, India'}</p></div><form onSubmit={handleSubmit(submit)} className="grid gap-5 border-t border-white/[.09] pt-8 sm:grid-cols-2"><Input label="Name / Organization" autoComplete="name" {...register('name', { required: true })} /><Input label="Email" type="email" autoComplete="email" {...register('email', { required: true })} /><div className="sm:col-span-2"><Input label="Subject" {...register('subject')} /></div><div className="sm:col-span-2"><Textarea label="What should we build?" {...register('message', { required: true })} /></div><Button type="submit" loading={isSubmitting} className="min-h-12 bg-[#c8a96b] text-[#0a0a09] hover:bg-[#dec28a] sm:col-span-2">Start a Conversation</Button></form></div></div></section>
}

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null), [projects, setProjects] = useState<Project[]>([]), [metrics, setMetrics] = useState<Metric[]>([]), [finance, setFinance] = useState<FinanceItem[]>([]), [research, setResearch] = useState<ResearchPublication[]>([]), [articles, setArticles] = useState<Article[]>([]), [cv, setCV] = useState<CVFile | null>(null)
  useEffect(() => { const unsubs = [settingsService.subscribe(setSettings), projectsService.subscribe(setProjects, true), metricsService.subscribe(setMetrics), financeService.subscribe(setFinance), researchService.subscribe(setResearch), articlesService.subscribe(setArticles)]; cvService.getActive().then(setCV).catch(() => setCV(null)); return () => unsubs.forEach(unsub => unsub()) }, [])
  return <main className="min-h-screen overflow-x-hidden bg-[#0a0a09] text-[#f3f0e8]"><Toaster position="bottom-right" /><Header settings={settings} /><Hero settings={settings} /><Building /><Zaprill /><Founder settings={settings} /><Work projects={projects} /><Finance items={finance} /><Proof metrics={metrics} /><Thinking articles={articles} research={research} /><Experience /><Recognition /><Now settings={settings} /><Contact settings={settings} cv={cv} /><footer className="border-t border-white/[.08] px-5 py-8 md:px-10"><div className="mx-auto flex max-w-[1440px] flex-col gap-5 text-xs uppercase tracking-[.14em] text-[#5d5a54] sm:flex-row sm:items-center sm:justify-between"><span>Vishnuraj Vishwakarma · Founder · Operator · Builder</span><div className="flex flex-wrap gap-5"><a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a><a href={ZAPRILL_SITE} target="_blank" rel="noreferrer">Zaprill</a><a href={AUSTRANGE} target="_blank" rel="noreferrer">Austrange</a></div></div></footer></main>
}
