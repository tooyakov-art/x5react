
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ViewState = 'home' | 'courses' | 'profile' | 'photo' | 'design' | 'contract' | 'video' | 'admin' | 'admin_key' | 'all_tech' | 'chat' | 'instagram' | 'video_gen' | 'success' | 'payment_mock' | 'logo' | 'branding' | 'analytics' | 'language' | 'hire' | 'chats_list';
export type Language = 'ru' | 'en' | 'kz' | 'tr' | 'cn' | 'ae' | 'es' | 'fr' | 'de' | 'it' | 'jp';
export type Platform = 'web' | 'ios' | 'android';

export interface ViewProps {
  isVisible?: boolean; 
  onBack?: () => void;
  initialPrompt?: string;
  user?: User | null;
  messages?: ChatMessage[];
  isTyping?: boolean;
  onSendMessage?: (text: string) => void; 
  onNavigate?: (view: ViewState, payload?: any) => void;
  checkUsage?: (tier: 'standard' | 'pro', cost?: number) => boolean;
  onUpdateUser?: (user: User) => void;
  language?: Language;
  setLanguage?: (lang: Language) => void; // Added for HomeView language toggle
  onRestoreHistory?: (item: HistoryItem) => void;
  attachedFiles?: File[]; 
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onRemoveFile?: (index: number) => void; 
  filePreviews?: string[]; 
  initialImage?: string; 
  onBuyCourse?: (course: Course) => void;
  platform?: Platform; // Added platform prop
  onToggleTabBar?: (visible: boolean) => void; // NEW: Control Dock visibility
  specialist?: Specialist; // For ChatView
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isGuest: boolean;
  plan: 'free' | 'pro' | 'black';
  credits: number;
  purchasedCourseIds?: string[]; // Track individual purchases
}

export interface LinkData {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'site';
  originalUrl: string;
  trackingUrl: string;
  clicks: number;
  date: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  homeworkTask?: string; // Задание для ученика
}

export interface Course {
  id: string;
  authorId?: string; // ID создателя курса
  title: string;
  marketingHook?: string; // NEW: Продающий заголовок
  features?: string[]; // NEW: Список преимуществ
  description: string;
  duration: string; // Общая длительность
  price: number;
  lessons: Lesson[]; // Массив уроков
  locked?: boolean; // Client-side computed
  coverUrl?: string; // Обложка курса (опционально)
}

export interface UsageState {
  guestStandardCount: number;
  proCount: number;
}

export type MessageType = 'text' | 'image' | 'plan' | 'loader';
export type MessageRole = 'user' | 'ai' | 'specialist';

export interface TechSuggestion {
  id: string;
  title: string;
  description: string;
  view: ViewState;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content?: string;
  mediaUrls?: string[]; 
  planData?: TechSuggestion[];
  timestamp: number;
}

export type DesignType = 
  | 'instagram_pack' 
  | 'kp' | 'presentation' | 'creative' | 'brand' | 'landing'
  | 'logo' | 'stories' | 'reels_script' | 'post' | 'article' 
  | 'business_card' | 'flyer' | 'banner' | 'email' 
  | 'product_card' | 'sticker' | 'merch' | 'youtube' | 'podcast' | 'checklist';

export type PhotoMode = 'auto' | 'studio' | 'lookbook' | 'product' | 'creative' | 'cyber' | 'logo' | 'branding';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  mode: PhotoMode;
  aspectRatio: '1:1' | '16:9' | '9:16' | '3:4' | '4:3';
  liked: boolean;
  date: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  createdAt?: any;
  type: 'photo' | 'design' | 'contract' | 'video' | 'all';
  prompt?: string;
  content?: string;
  imageUrl?: string;
  mode?: string;
  aspectRatio?: string;
  designType?: string;
}

export interface AppConfig {
  photo: boolean;
  design: boolean;
  contract: boolean;
  video: boolean;
  courses: boolean;
}

export interface ContractFormData {
  type: string;
  date: string;
  partyA?: string;
  partyB?: string;
  subject?: string;
  amount?: string;
  description?: string;
  designType?: DesignType;
  logoBase64?: string;
}

export interface QnAPair {
  question: string;
  answer: string;
}

export interface AIAnalysisResponse {
  status: 'complete' | 'needs_info';
  contract?: string;
  questions?: string[];
  extractedData?: Partial<ContractFormData>; 
}

export interface ImageGenerationResponse {
  imageUrl?: string;
  error?: string;
}

export interface KPPlanItem {
  id: string;
  title: string;
  description: string;
}

export interface KPPage {
  id: string;
  layout: 'cover' | 'timeline' | 'grid' | 'section_text' | 'contacts';
  title: string;
  content?: string;
  items?: { title: string; desc: string }[];
}

export interface KPPresentation {
  meta: { primaryColor: string; secondaryColor: string; font: string };
  pages: KPPage[];
}

export type KPSlide = KPPage;
export type KPData = KPPresentation;

// VIDEO EDITOR TYPES
export type VideoFont = 'Inter' | 'Montserrat' | 'Bebas Neue' | 'Playfair Display' | 'Oswald' | 'Roboto Mono';
export type VideoAnimation = 'none' | 'fade-up' | 'scale-in' | 'slide-right' | 'blur-in' | 'typewriter';

export interface ElementPosition {
    x: number;
    y: number;
}

export interface CreativeHook {
  headline: string;
  badge?: string;
  smallText?: string;
  cta?: string;
  id?: number;
  
  // Visual Styles
  styleId?: string;
  font?: VideoFont;
  animation?: VideoAnimation;
  textScale?: number; // 0.5 to 2.0
  
  // Individual Positions
  positions?: {
      headline?: ElementPosition;
      badge?: ElementPosition;
      smallText?: ElementPosition;
      cta?: ElementPosition;
  };
}

export interface InstagramPost {
  id: string;
  headline: string;
  description: string;
  cta: string;
  visualPrompt: string;
  generatedImageUrl?: string;
  status: 'pending' | 'generating' | 'done' | 'error';
}
export interface Specialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  price: string;
  skills: string[];
  online: boolean;
}
