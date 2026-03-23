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
  Wrench,
  ShoppingCart,
  Plane,
  Film,
  FileText,
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
  { code: 'ru', name: 'Русский', apiName: 'Russian' },
  { code: 'ar', name: 'العربية', apiName: 'Arabic' },
  { code: 'th', name: 'ภาษาไทย', apiName: 'Thai' },
  { code: 'hi', name: 'हिन्दी', apiName: 'Hindi' },
];

export const sourceLanguages = languages;
export const targetLanguages = languages;

// =============== DOMAINS ===============

export const domains: Domain[] = [
  { id: 'auto', name: 'Tự động phát hiện', icon: FolderOpen },
  { id: 'general', name: 'Tổng quát', icon: Globe },

  // The "Big Four" Specialized Industries
  { id: 'it_software', name: 'Phần mềm & CNTT', icon: Laptop },
  { id: 'medical', name: 'Y tế & Chăm sóc sức khỏe', icon: Stethoscope },
  { id: 'legal', name: 'Pháp lý', icon: Scale },
  { id: 'finance', name: 'Tài chính & Ngân hàng', icon: Landmark },

  // Heavy Industries & STEM
  { id: 'engineering', name: 'Kỹ thuật & Công nghiệp', icon: Wrench },
  { id: 'science_academic', name: 'Khoa học & Học thuật', icon: FlaskConical },

  // Business & Consumer Goods
  { id: 'commerce', name: 'Thương mại & Bán lẻ', icon: ShoppingCart },
  { id: 'tourism', name: 'Du lịch & Khách sạn', icon: Plane },

  // Creative & Communication (Function-based, but treated as distinct industries in translation)
  { id: 'media_entertainment', name: 'Truyền thông & Giải trí', icon: Film },
  { id: 'marketing_advertising', name: 'Marketing & Quảng cáo', icon: Megaphone },

  // Public & Personal Docs
  { id: 'administrative', name: 'Hành chính', icon: FileText },
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
  keepOriginalFontSize: false,
  fontConfigEnabled: true,
  fontEnabledMap: {},
  fontSelections: {},
};
