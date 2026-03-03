'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  const formattedDate = new Date(glossary.createdAt).toLocaleDateString();

  return (
    <div
      className="group relative rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
      {/* Header: name + actions */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-medium text-sm truncate pr-2">{glossary.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
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

      {/* Domain badge */}
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs">
          {t(`domains.${glossary.domain}`)}
        </Badge>
      </div>

      {/* Language pair */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs font-normal">
          {t(`languages.${glossary.srcLang}`)}
        </Badge>
        <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
        <Badge variant="outline" className="text-xs font-normal">
          {t(`languages.${glossary.tgtLang}`)}
        </Badge>
      </div>

      {/* Footer: term count + date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
        <span>{t('termCount', { count: glossary.termCount })}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
