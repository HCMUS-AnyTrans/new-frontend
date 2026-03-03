'use client';

import { useTranslations } from 'next-intl';
import { ArrowRightLeft, MoreHorizontal, Pencil, Trash2, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { glossaryDomains } from '../data';
import type { Glossary } from '../types';

interface GlossaryCardProps {
  glossary: Glossary;
  onClick: (glossary: Glossary) => void;
  onEdit: (glossary: Glossary) => void;
  onDelete: (glossary: Glossary) => void;
}

export function GlossaryCard({
  glossary,
  onClick,
  onEdit,
  onDelete,
}: GlossaryCardProps) {
  const t = useTranslations('glossary');
  const tCommon = useTranslations('common');

  const domainInfo = glossaryDomains.find((d) => d.id === glossary.domain);
  const DomainIcon = domainInfo?.icon;

  const formattedDate = new Date(glossary.createdAt).toLocaleDateString();

  return (
    <div
      className="group relative rounded-2xl border bg-card p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-muted/50 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => onClick(glossary)}
      role="button"
      tabIndex={0}
      aria-label={`${glossary.name} — ${t(`languages.${glossary.srcLang}`)} → ${t(`languages.${glossary.tgtLang}`)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(glossary);
        }
      }}
    >
      {/* Header: icon + name + menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            {DomainIcon && <DomainIcon className="size-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight line-clamp-1 pr-2">
              {glossary.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {t(`domains.${glossary.domain}`)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 -mr-2 -mt-2 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-5" />
              <span className="sr-only">{tCommon('actions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(glossary);
              }}
            >
              <Pencil className="size-4" />
              {tCommon('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(glossary);
              }}
            >
              <Trash2 className="size-4" />
              {tCommon('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Language pair box */}
      <div className="flex items-center gap-3 mb-6 bg-muted/50 p-3 rounded-xl border">
        <div className="flex-1 font-medium text-sm text-foreground text-center">
          {t(`languages.${glossary.srcLang}`)}
        </div>
        <div className="w-6 h-6 rounded-full bg-card shadow-sm border flex items-center justify-center text-muted-foreground shrink-0">
          <ArrowRightLeft className="size-3" />
        </div>
        <div className="flex-1 font-medium text-sm text-foreground text-center">
          {t(`languages.${glossary.tgtLang}`)}
        </div>
      </div>

      {/* Footer: term count + date */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Book className="size-3.5" />
          <span>{t('termCount', { count: glossary.termCount })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70">
          <Calendar className="size-3.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
