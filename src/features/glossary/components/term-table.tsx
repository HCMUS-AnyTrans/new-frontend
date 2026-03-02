'use client';

import { useTranslations } from 'next-intl';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Term } from '../types';

interface TermTableProps {
  terms: Term[];
  onEdit: (term: Term) => void;
  onDelete: (term: Term) => void;
}

/**
 * Presentational table of glossary terms.
 * Each row shows source → target and an actions dropdown.
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
            <TableHead className="w-[60px] text-right text-xs font-medium text-muted-foreground">
              {tCommon('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terms.map((term) => (
            <TableRow key={term.id} className="group">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">{tCommon('actions')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(term)}>
                      <Pencil className="size-4" />
                      {tCommon('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(term)}
                    >
                      <Trash2 className="size-4" />
                      {tCommon('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
