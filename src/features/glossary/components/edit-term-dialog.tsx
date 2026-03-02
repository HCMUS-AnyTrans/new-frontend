'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateTerm } from '../hooks/use-update-term';
import { createTermSchema, type CreateTermFormValues } from '../data';
import type { Term } from '../types';

interface EditTermDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossaryId: string;
  term: Term | null;
}

export function EditTermDialog({
  open,
  onOpenChange,
  glossaryId,
  term,
}: EditTermDialogProps) {
  const t = useTranslations('glossary.terms');
  const tCommon = useTranslations('common');

  const form = useForm<CreateTermFormValues>({
    resolver: zodResolver(createTermSchema),
    defaultValues: {
      srcTerm: '',
      tgtTerm: '',
    },
  });

  useEffect(() => {
    if (term) {
      form.reset({
        srcTerm: term.srcTerm,
        tgtTerm: term.tgtTerm,
      });
    }
  }, [term, form]);

  const { updateTerm, isUpdating } = useUpdateTerm({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  function handleSubmit(values: CreateTermFormValues) {
    if (!term) return;
    updateTerm({
      glossaryId,
      termId: term.id,
      dto: values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editTerm')}</DialogTitle>
          <DialogDescription>
            {t('srcTermPlaceholder')} / {t('tgtTermPlaceholder')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="srcTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('srcTerm')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('srcTermPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tgtTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tgtTerm')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('tgtTermPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="size-4 animate-spin" />}
                {isUpdating ? tCommon('loading') : tCommon('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
