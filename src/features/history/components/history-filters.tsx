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
import { STATUS_OPTIONS } from '../data';
import type { HistoryFiltersProps } from '../types';

export function HistoryFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: HistoryFiltersProps) {
  const t = useTranslations('dashboard.history');
  const tStatus = useTranslations('dashboard.status');

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('filterStatus')} />
        </SelectTrigger>
        <SelectContent>
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
