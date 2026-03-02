'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { glossaryDomains, glossaryLanguages } from '../data';

interface GlossaryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  domainFilter: string;
  onDomainChange: (value: string) => void;
  srcLangFilter: string;
  onSrcLangChange: (value: string) => void;
}

export function GlossaryFilters({
  search,
  onSearchChange,
  domainFilter,
  onDomainChange,
  srcLangFilter,
  onSrcLangChange,
}: GlossaryFiltersProps) {
  const t = useTranslations('glossary');

  return (
    <div className="flex flex-1 flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={domainFilter} onValueChange={onDomainChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={t('filterDomain')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allDomains')}</SelectItem>
          {glossaryDomains.map((domain) => (
            <SelectItem key={domain.id} value={domain.id}>
              {domain.icon} {t(`domains.${domain.id}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={srcLangFilter} onValueChange={onSrcLangChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={t('filterSrcLang')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allLanguages')}</SelectItem>
          {glossaryLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {t(`languages.${lang.code}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
