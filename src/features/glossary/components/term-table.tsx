'use client';

import { useTranslations } from 'next-intl';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Term } from '../types';

interface TermTableProps {
  terms: Term[];
  onEdit: (term: Term) => void;
  onDelete: (term: Term) => void;
}

/**
 * Presentational table of glossary terms.
 * Each row shows source → target and inline edit/delete buttons.
 */
export function TermTable({ terms, onEdit, onDelete }: TermTableProps) {
  const t = useTranslations('glossary.terms');
  const tCommon = useTranslations('common');

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {t('srcTerm')}
            </TableHead>
            <TableHead className="h-11 px-4 text-sm font-medium text-muted-foreground lg:px-6">
              {t('tgtTerm')}
            </TableHead>
            <TableHead className="h-11 w-[180px] px-4 text-right text-sm font-medium text-muted-foreground lg:px-6">
              {tCommon('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terms.map((term) => (
            <TableRow
              key={term.id}
              className="group hover:bg-muted/30"
            >
              <TableCell className="px-4 py-3.5 text-sm font-medium text-foreground lg:px-6">
                {term.srcTerm}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-sm text-foreground/80 lg:px-6">
                {term.tgtTerm}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right lg:px-6">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(term)}
                  >
                    <Pencil className="size-3.5 text-muted-foreground" />
                    <span className="sr-only">{tCommon('edit')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(term)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                    <span className="sr-only">{tCommon('delete')}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
