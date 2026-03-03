'use client';

import { useTranslations } from 'next-intl';
import { Pencil, Trash2 } from 'lucide-react';
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
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-muted-foreground">
            <th className="px-6 py-3 font-medium">{t('srcTerm')}</th>
            <th className="px-6 py-3 font-medium">{t('tgtTerm')}</th>
            <th className="px-6 py-3 font-medium text-right w-[100px]">
              {tCommon('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {terms.map((term) => (
            <tr
              key={term.id}
              className="hover:bg-muted/50 transition-colors group"
            >
              <td className="px-6 py-4 font-medium text-foreground">
                {term.srcTerm}
              </td>
              <td className="px-6 py-4 text-foreground/80">
                {term.tgtTerm}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => onEdit(term)}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only">{tCommon('edit')}</span>
                  </button>
                  <button
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    onClick={() => onDelete(term)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">{tCommon('delete')}</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
