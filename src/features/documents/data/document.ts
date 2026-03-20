import type { Language, Domain, Tone, TranslationConfig } from '../types';
import {
  Globe,
  Laptop,
  Stethoscope,
  Scale,
  Landmark,
  Megaphone,
  GraduationCap,
  Cog,
  FlaskConical,
  FolderOpen,
} from 'lucide-react';
// =============== LANGUAGES ===============

export const languages: Language[] = [
  { code: 'en', name: 'English', apiName: 'English' },
  { code: 'vi', name: 'Tiếng Việt', apiName: 'Vietnamese' },
  { code: 'ja', name: '日本語', apiName: 'Japanese' },
  { code: 'ko', name: '한국어', apiName: 'Korean' },
  { code: 'zh', name: '中文', apiName: 'Chinese' },
  { code: 'fr', name: 'Français', apiName: 'French' },
  { code: 'de', name: 'Deutsch', apiName: 'German' },
  { code: 'es', name: 'Español', apiName: 'Spanish' },
];

export const sourceLanguages = languages;
export const targetLanguages = languages;

// =============== DOMAINS ===============

export const domains: Domain[] = [
  { id: 'auto', name: 'Auto Detect', icon: FolderOpen },
  { id: 'general', name: 'Tổng quát', icon: Globe },
  { id: 'technology', name: 'Công nghệ', icon: Laptop },
  { id: 'medical', name: 'Y tế', icon: Stethoscope },
  { id: 'legal', name: 'Pháp lý', icon: Scale },
  { id: 'finance', name: 'Tài chính', icon: Landmark },
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'education', name: 'Giáo dục', icon: GraduationCap },
  { id: 'engineering', name: 'Kỹ thuật', icon: Cog },
  { id: 'science', name: 'Khoa học', icon: FlaskConical },
];

// =============== TONES ===============

export const tones: Tone[] = [
  {
    id: 'formal',
    name: 'Trang trọng',
    description: 'Phù hợp văn bản chính thức',
  },
  {
    id: 'casual',
    name: 'Thân mật',
    description: 'Phù hợp giao tiếp hàng ngày',
  },
  {
    id: 'professional',
    name: 'Chuyên nghiệp',
    description: 'Phù hợp môi trường công việc',
  },
  { id: 'friendly', name: 'Thân thiện', description: 'Gần gũi, dễ hiểu' },
];

// =============== DEFAULT CONFIG ===============

export const defaultConfig: TranslationConfig = {
  srcLang: 'en',
  tgtLang: 'vi',
  domain: 'auto',
  tone: 'professional',
  selectedGlossaryId: null,
  manualTerms: [],
  fontSelections: {},
};
