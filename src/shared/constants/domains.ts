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
  name: string;
  icon: LucideIcon;
};

const DOMAIN_DEFINITIONS = [
  { id: 'auto', name: 'Tự động phát hiện', icon: FolderOpen },
  { id: 'general', name: 'Tổng quát', icon: Globe },
  { id: 'it_software', name: 'Phần mềm & CNTT', icon: Laptop },
  { id: 'medical', name: 'Y tế & Chăm sóc sức khỏe', icon: Stethoscope },
  { id: 'legal', name: 'Pháp lý', icon: Scale },
  { id: 'finance', name: 'Tài chính & Ngân hàng', icon: Landmark },
  { id: 'engineering', name: 'Kỹ thuật & Công nghiệp', icon: Wrench },
  { id: 'science_academic', name: 'Khoa học & Học thuật', icon: FlaskConical },
  { id: 'commerce', name: 'Thương mại & Bán lẻ', icon: ShoppingCart },
  { id: 'tourism', name: 'Du lịch & Khách sạn', icon: Plane },
  { id: 'media_entertainment', name: 'Truyền thông & Giải trí', icon: Film },
  {
    id: 'marketing_advertising',
    name: 'Marketing & Quảng cáo',
    icon: Megaphone,
  },
  { id: 'administrative', name: 'Hành chính', icon: FileText },
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
