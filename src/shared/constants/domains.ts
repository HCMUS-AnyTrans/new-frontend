import type { LucideIcon } from 'lucide-react';
import {
  Film,
  FileText,
  FlaskConical,
  FolderOpen,
  Globe,
  Landmark,
  Laptop,
  Megaphone,
  Plane,
  Scale,
  ShoppingCart,
  Stethoscope,
  Wrench,
} from 'lucide-react';

type DomainDefinition = {
  id: string;
  value: string;
  icon: LucideIcon;
};

const DOMAIN_DEFINITIONS = [
  { id: 'auto', value: 'Auto', icon: FolderOpen },
  { id: 'general', value: 'General', icon: Globe },
  { id: 'it_software', value: 'IT & Software', icon: Laptop },
  { id: 'medical', value: 'Medical', icon: Stethoscope },
  { id: 'legal', value: 'Legal', icon: Scale },
  { id: 'finance', value: 'Finance', icon: Landmark },
  { id: 'engineering', value: 'Engineering', icon: Wrench },
  { id: 'science_academic', value: 'Science & Academic', icon: FlaskConical },
  { id: 'commerce', value: 'Commerce & Retail', icon: ShoppingCart },
  { id: 'tourism', value: 'Tourism & Hospitality', icon: Plane },
  { id: 'media_entertainment', value: 'Media & Entertainment', icon: Film },
  {
    id: 'marketing_advertising',
    value: 'Marketing & Advertising',
    icon: Megaphone,
  },
  { id: 'administrative', value: 'Administrative', icon: FileText },
  { id: 'other', value: 'Other', icon: Wrench },
] as const satisfies readonly DomainDefinition[];

export type SharedDomainId = (typeof DOMAIN_DEFINITIONS)[number]['id'];
export type DomainFilterId = Exclude<SharedDomainId, 'auto'>;
export type DomainFilterValue = 'all' | DomainFilterId;
export type HistoryDomainFilterValue = 'all' | SharedDomainId;

export interface DomainOption {
  id: SharedDomainId;
  icon: LucideIcon;
}

export const domains: DomainDefinition[] = [...DOMAIN_DEFINITIONS];

export const nonAutoDomains: DomainDefinition[] = DOMAIN_DEFINITIONS.filter(
  (
    domain,
  ): domain is (typeof DOMAIN_DEFINITIONS)[number] & { id: DomainFilterId } =>
    domain.id !== 'auto',
);

export const DOMAIN_FILTER_IDS: DomainFilterId[] = nonAutoDomains.map(
  (domain) => domain.id,
) as DomainFilterId[];

export const DOMAIN_FILTER_OPTIONS: DomainFilterValue[] = [
  'all',
  ...DOMAIN_FILTER_IDS,
];

export const HISTORY_DOMAIN_FILTER_OPTIONS: HistoryDomainFilterValue[] = [
  'all',
  ...DOMAIN_DEFINITIONS.map((domain) => domain.id),
];

export const DOMAIN_OPTIONS_WITH_ICONS: DomainOption[] = DOMAIN_DEFINITIONS.map(
  ({ id, icon }) => ({ id, icon }),
) as DomainOption[];

export const NON_AUTO_DOMAIN_OPTIONS_WITH_ICONS: DomainOption[] =
  nonAutoDomains.map(({ id, icon }) => ({ id, icon })) as DomainOption[];

export const domainById: Record<SharedDomainId, DomainDefinition> =
  DOMAIN_DEFINITIONS.reduce(
    (acc, domain) => {
      acc[domain.id] = domain;
      return acc;
    },
    {} as Record<SharedDomainId, DomainDefinition>,
  );
