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
import { useDeleteTerm } from '../hooks/use-delete-term';
import type { Term } from '../types';

interface DeleteTermDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossaryId: string;
  term: Term | null;
}

export function DeleteTermDialog({
  open,
  onOpenChange,
  glossaryId,
  term,
}: DeleteTermDialogProps) {
  const t = useTranslations('glossary.terms');
  const tCommon = useTranslations('common');

  const { deleteTerm, isDeleting } = useDeleteTerm({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  function handleDelete() {
    if (!term) return;
    deleteTerm({ glossaryId, termId: term.id });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            {t('deleteTerm')}
          </DialogTitle>
          <DialogDescription>{t('deleteTermConfirm')}</DialogDescription>
        </DialogHeader>

        {term && (
          <div className="rounded-md border bg-muted/50 p-3 text-sm">
            <p>
              <span className="font-medium">{term.srcTerm}</span>
              {' → '}
              <span className="text-muted-foreground">{term.tgtTerm}</span>
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
            {isDeleting ? tCommon('loading') : tCommon('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
