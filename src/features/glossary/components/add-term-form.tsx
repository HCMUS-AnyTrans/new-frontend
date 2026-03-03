'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddTerm } from '../hooks/use-add-term';

interface AddTermFormProps {
  glossaryId: string;
}

export function AddTermForm({ glossaryId }: AddTermFormProps) {
  const t = useTranslations('glossary.terms');

  const [srcTerm, setSrcTerm] = useState('');
  const [tgtTerm, setTgtTerm] = useState('');

  const { addTerm, isAdding } = useAddTerm({
    onSuccess: () => {
      setSrcTerm('');
      setTgtTerm('');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedSrc = srcTerm.trim();
    const trimmedTgt = tgtTerm.trim();
    if (!trimmedSrc || !trimmedTgt) return;

    addTerm({
      glossaryId,
      dto: { srcTerm: trimmedSrc, tgtTerm: trimmedTgt },
    });
  }

  return (
    <div className="rounded-2xl border bg-card p-5 mb-6">
      <h3 className="text-sm font-semibold mb-4">{t('addNewTerm')}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder={t('srcTermPlaceholder')}
          value={srcTerm}
          onChange={(e) => setSrcTerm(e.target.value)}
          className="flex-1"
          disabled={isAdding}
          aria-label={t('srcTerm')}
        />
        <Input
          placeholder={t('tgtTermPlaceholder')}
          value={tgtTerm}
          onChange={(e) => setTgtTerm(e.target.value)}
          className="flex-1"
          disabled={isAdding}
          aria-label={t('tgtTerm')}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isAdding || !srcTerm.trim() || !tgtTerm.trim()}
          className="shrink-0"
        >
          {isAdding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {t('addTerm')}
        </Button>
      </form>
    </div>
  );
}
