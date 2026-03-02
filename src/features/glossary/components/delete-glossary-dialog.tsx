'use client';

import { useTranslations } from 'next-intl';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteGlossary } from '../hooks/use-delete-glossary';
import type { Glossary } from '../types';

interface DeleteGlossaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossary: Glossary | null;
}

export function DeleteGlossaryDialog({
  open,
  onOpenChange,
  glossary,
}: DeleteGlossaryDialogProps) {
  const t = useTranslations('glossary');
  const tCommon = useTranslations('common');

  const { deleteGlossary, isDeleting } = useDeleteGlossary({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  function handleDelete() {
    if (!glossary) return;
    deleteGlossary(glossary.id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            {t('deleteGlossary')}
          </DialogTitle>
          <DialogDescription>
            {t('deleteGlossaryConfirm')}
          </DialogDescription>
        </DialogHeader>

        {glossary && (
          <div className="rounded-md border bg-muted/50 p-3 text-sm">
            <p className="font-medium">{t(`domains.${glossary.domain}`)}</p>
            <p className="text-muted-foreground">
              {t(`languages.${glossary.srcLang}`)} → {t(`languages.${glossary.tgtLang}`)}
              {' · '}
              {t('termCount', { count: glossary.termCount })}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            {isDeleting ? t('form.deleting') : tCommon('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
