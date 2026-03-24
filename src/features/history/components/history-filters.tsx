import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import {
  HISTORY_DOMAIN_FILTER_OPTIONS,
  domainById,
} from '@/shared/constants/domains';
import { STATUS_OPTIONS } from '../data';
import type { HistoryFiltersProps } from '../types';

export function HistoryFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  domainFilter,
  onDomainChange,
}: HistoryFiltersProps) {
  const t = useTranslations('dashboard.history');
  const tStatus = useTranslations('dashboard.status');
  const tDomain = useTranslations('documents.domains');

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background pl-9"
        />
      </div>
      <Select value={domainFilter} onValueChange={onDomainChange}>
        <SelectTrigger className="w-full bg-background hover:bg-background sm:w-[160px]">
          <SelectValue placeholder={t('filterDomain')} />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {HISTORY_DOMAIN_FILTER_OPTIONS.map((domainId) => {
            const Icon = domainId === 'all' ? undefined : domainById[domainId]?.icon;
            return (
              <SelectItem key={domainId} value={domainId}>
                {Icon && <Icon className="size-4" />}
                {domainId === 'all'
                  ? t('allDomains')
                  : tDomain(domainId)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full bg-background hover:bg-background sm:w-[160px]">
          <SelectValue placeholder={t('filterStatus')} />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status}>
              {status === 'all' ? t('allStatuses') : tStatus(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
