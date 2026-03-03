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
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">
              {t('srcTerm')}
            </TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">
              {t('tgtTerm')}
            </TableHead>
            <TableHead className="w-[80px] text-right text-xs font-medium text-muted-foreground">
              {tCommon('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terms.map((term) => (
            <TableRow key={term.id}>
              <TableCell>
                <span className="text-sm font-medium text-foreground">
                  {term.srcTerm}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-foreground">
                  {term.tgtTerm}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => onEdit(term)}
                  >
                    <Pencil className="size-3.5" />
                    <span className="sr-only">{tCommon('edit')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(term)}
                  >
                    <Trash2 className="size-3.5" />
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
