'use client';

import { useTranslations } from 'next-intl';
import {
  ArrowRightLeft,
  MoreHorizontal,
  Pencil,
  Trash2,
  Book,
  Calendar,
} from 'lucide-react';
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
      className="group relative cursor-pointer rounded-2xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
      {/* Header: domain icon + name/domain label + context menu */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {DomainIcon && <DomainIcon className="size-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-1 pr-2 text-base font-semibold leading-tight">
              {glossary.name}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {t(`domains.${glossary.domain}`)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-2 size-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
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

      {/* Language pair */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
        <div className="flex-1 text-center text-sm font-medium text-foreground">
          {t(`languages.${glossary.srcLang}`)}
        </div>
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-card shadow-sm text-muted-foreground">
          <ArrowRightLeft className="size-3" />
        </div>
        <div className="flex-1 text-center text-sm font-medium text-foreground">
          {t(`languages.${glossary.tgtLang}`)}
        </div>
      </div>

      {/* Footer: term count + created date */}
      <div className="flex items-center justify-between border-t pt-4">
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
