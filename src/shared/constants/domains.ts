/**
 * Shared domain constants for Glossary, History, and Document translation.
 * Single source of truth - aligned with backend domain values.
 */

import type { LucideIcon } from 'lucide-react';
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

// ============================================================================
// DOMAIN IDs (for filtering)
// ============================================================================

/** Domain IDs used for filtering (glossary list, history). Excludes "auto". */
export const DOMAIN_FILTER_IDS = [
  'general',
  'technology',
  'medical',
  'legal',
  'finance',
  'marketing',
  'education',
  'engineering',
  'science',
] as const;

export type DomainFilterId = (typeof DOMAIN_FILTER_IDS)[number];

/** Filter options: "all" + domain IDs. Used by Glossary. */
export const DOMAIN_FILTER_OPTIONS = ['all', ...DOMAIN_FILTER_IDS] as const;

export type DomainFilterValue = (typeof DOMAIN_FILTER_OPTIONS)[number];

/** Filter options for History: "all" + "auto" + domain IDs. */
export const HISTORY_DOMAIN_FILTER_OPTIONS = [
  'all',
  'auto',
  ...DOMAIN_FILTER_IDS,
] as const;

export type HistoryDomainFilterValue =
  (typeof HISTORY_DOMAIN_FILTER_OPTIONS)[number];

// ============================================================================
// DOMAIN OPTIONS WITH ICONS (for forms: glossary create/edit, document wizard)
// ============================================================================

export interface DomainOption {
  id: string;
  icon: LucideIcon;
}

/** Domain options with icons. Includes "auto" for document translation. */
export const DOMAIN_OPTIONS_WITH_ICONS: DomainOption[] = [
  { id: 'auto', icon: FolderOpen },
  { id: 'general', icon: Globe },
  { id: 'technology', icon: Laptop },
  { id: 'medical', icon: Stethoscope },
  { id: 'legal', icon: Scale },
  { id: 'finance', icon: Landmark },
  { id: 'marketing', icon: Megaphone },
  { id: 'education', icon: GraduationCap },
  { id: 'engineering', icon: Cog },
  { id: 'science', icon: FlaskConical },
];
