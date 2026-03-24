import { domains } from '@/shared/constants/domains';
import type { Language, Tone, TranslationConfig } from '../types';

export { domains };

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
