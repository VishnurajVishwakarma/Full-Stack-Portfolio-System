export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  proofUrl?: string;
  order?: number;
  slug?: string;
  category?: string;
  summary?: string;
  problem?: string;
  objective?: string;
  role?: string;
  approach?: string;
  businessImpact?: string;
  results?: string;
  featured?: boolean;
  visible?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  credentialId?: string;
  verifyUrl: string;
  imageUrl?: string;
  order?: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  order?: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  tag?: string;
}

export interface CVFile {
  id?: string;
  url: string;
  version: string;
  active?: boolean;
}

export interface SiteSettings {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  availability: boolean;
  profileImage?: string;
  nowText?: string;
  academicProofUrl?: string;
  companyUrl?: string;
}

export interface Metric {
  id: string;
  value: string;
  label: string;
  description?: string;
  order?: number;
  visible?: boolean;
}

export interface FinanceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  content?: string;
  externalUrl?: string;
  documentUrl?: string;
  featured?: boolean;
  publishedAt?: string;
  visible?: boolean;
  order?: number;
}

export interface ResearchPublication {
  id: string;
  title: string;
  slug: string;
  authors?: string;
  publication?: string;
  year?: string;
  summary?: string;
  researchArea?: string;
  publicationUrl?: string;
  documentUrl?: string;
  featured?: boolean;
  visible?: boolean;
  order?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  coverImage?: string;
  publishedAt?: string;
  featured?: boolean;
  visible?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  order?: number;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read?: boolean;
  createdAt?: any;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalCertificates: number;
  totalSkills: number;
  totalImages: number;
  unreadMessages: number;
}
