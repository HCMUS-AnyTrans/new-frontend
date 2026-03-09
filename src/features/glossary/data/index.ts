import { z } from 'zod';
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
  type LucideIcon,
} from 'lucide-react';

// ============================================================================
// DOMAIN OPTIONS
// ============================================================================

export interface DomainOption {
  id: string;
  name: string;
  icon: LucideIcon;
}

/**
 * Available domain/subject area options for glossaries.
 * Aligned with backend domain values and document translation domains.
 */
export const glossaryDomains: DomainOption[] = [
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

// ============================================================================
// LANGUAGE OPTIONS
// ============================================================================

export interface LanguageOption {
  code: string;
  name: string;
}

/**
 * Supported language options for glossary source/target language.
 * Uses BCP-47 codes to match backend validation.
 */
export const glossaryLanguages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
];

// ============================================================================
// VALIDATION SCHEMAS — Glossary
// ============================================================================

export const createGlossarySchema = z
  .object({
    name: z
      .string()
      .min(1, 'Vui lòng nhập tên bảng thuật ngữ')
      .max(200, 'Tên không được vượt quá 200 ký tự'),
    domain: z
      .string()
      .min(1, 'Vui lòng chọn lĩnh vực')
      .max(100, 'Lĩnh vực không được vượt quá 100 ký tự'),
    srcLang: z
      .string()
      .min(1, 'Vui lòng chọn ngôn ngữ nguồn')
      .max(10, 'Mã ngôn ngữ không hợp lệ'),
    tgtLang: z
      .string()
      .min(1, 'Vui lòng chọn ngôn ngữ đích')
      .max(10, 'Mã ngôn ngữ không hợp lệ'),
  })
  .refine((data) => data.srcLang !== data.tgtLang, {
    message: 'Ngôn ngữ nguồn và ngôn ngữ đích phải khác nhau',
    path: ['tgtLang'],
  });

export type CreateGlossaryFormValues = z.infer<typeof createGlossarySchema>;

export const updateGlossarySchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập tên bảng thuật ngữ')
    .max(200, 'Tên không được vượt quá 200 ký tự')
    .optional(),
  domain: z
    .string()
    .min(1, 'Vui lòng chọn lĩnh vực')
    .max(100, 'Lĩnh vực không được vượt quá 100 ký tự')
    .optional(),
  srcLang: z
    .string()
    .min(1, 'Vui lòng chọn ngôn ngữ nguồn')
    .max(10, 'Mã ngôn ngữ không hợp lệ')
    .optional(),
  tgtLang: z
    .string()
    .min(1, 'Vui lòng chọn ngôn ngữ đích')
    .max(10, 'Mã ngôn ngữ không hợp lệ')
    .optional(),
});

export type UpdateGlossaryFormValues = z.infer<typeof updateGlossarySchema>;

// ============================================================================
// VALIDATION SCHEMAS — Terms
// ============================================================================

export const createTermSchema = z.object({
  srcTerm: z
    .string()
    .min(1, 'Vui lòng nhập thuật ngữ nguồn')
    .max(500, 'Thuật ngữ không được vượt quá 500 ký tự'),
  tgtTerm: z
    .string()
    .min(1, 'Vui lòng nhập thuật ngữ đích')
    .max(500, 'Thuật ngữ không được vượt quá 500 ký tự'),
});

export type CreateTermFormValues = z.infer<typeof createTermSchema>;

export const updateTermSchema = z.object({
  srcTerm: z
    .string()
    .min(1, 'Vui lòng nhập thuật ngữ nguồn')
    .max(500, 'Thuật ngữ không được vượt quá 500 ký tự')
    .optional(),
  tgtTerm: z
    .string()
    .min(1, 'Vui lòng nhập thuật ngữ đích')
    .max(500, 'Thuật ngữ không được vượt quá 500 ký tự')
    .optional(),
});

export type UpdateTermFormValues = z.infer<typeof updateTermSchema>;

/**
 * Schema for a single row in bulk import (used for client-side CSV validation).
 */
export const bulkTermRowSchema = z.object({
  srcTerm: z
    .string()
    .min(1, 'Thuật ngữ nguồn không được để trống')
    .max(500, 'Thuật ngữ không được vượt quá 500 ký tự'),
  tgtTerm: z
    .string()
    .min(1, 'Thuật ngữ đích không được để trống')
    .max(500, 'Thuật ngữ không được vượt quá 500 ký tự'),
});

export const bulkImportSchema = z.object({
  terms: z
    .array(bulkTermRowSchema)
    .min(1, 'Vui lòng thêm ít nhất 1 thuật ngữ')
    .max(500, 'Tối đa 500 thuật ngữ mỗi lần nhập'),
});

export type BulkImportFormValues = z.infer<typeof bulkImportSchema>;

// ============================================================================
// DEFAULTS
// ============================================================================

export const DEFAULT_GLOSSARY_QUERY = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
};

export const DEFAULT_TERM_QUERY = {
  page: 1,
  limit: 20,
  sortBy: 'srcTerm',
  sortOrder: 'asc' as const,
};

/** Maximum terms allowed per bulk import request */
export const MAX_BULK_IMPORT_SIZE = 500;

/** Maximum manual terms in inline glossary (document wizard) */
export const MAX_INLINE_TERMS = 20;
