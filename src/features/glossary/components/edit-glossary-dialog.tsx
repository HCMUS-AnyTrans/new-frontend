'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateGlossary } from '../hooks/use-update-glossary';
import {
  createGlossarySchema,
  glossaryDomains,
  glossaryLanguages,
  type CreateGlossaryFormValues,
} from '../data';
import type { Glossary } from '../types';

interface EditGlossaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossary: Glossary | null;
}

export function EditGlossaryDialog({
  open,
  onOpenChange,
  glossary,
}: EditGlossaryDialogProps) {
  const t = useTranslations('glossary');
  const tCommon = useTranslations('common');

  const form = useForm<CreateGlossaryFormValues>({
    resolver: zodResolver(createGlossarySchema),
    defaultValues: {
      domain: '',
      srcLang: '',
      tgtLang: '',
    },
  });

  // Sync form values when glossary changes
  useEffect(() => {
    if (glossary) {
      form.reset({
        domain: glossary.domain,
        srcLang: glossary.srcLang,
        tgtLang: glossary.tgtLang,
      });
    }
  }, [glossary, form]);

  const { updateGlossary, isUpdating } = useUpdateGlossary({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  function handleSubmit(values: CreateGlossaryFormValues) {
    if (!glossary) return;
    updateGlossary({
      glossaryId: glossary.id,
      dto: values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editGlossary')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Domain */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('domain')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('form.domainPlaceholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {glossaryDomains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.icon} {t(`domains.${domain.id}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source Language */}
            <FormField
              control={form.control}
              name="srcLang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('srcLang')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('form.srcLangPlaceholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {glossaryLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {t(`languages.${lang.code}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Language */}
            <FormField
              control={form.control}
              name="tgtLang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tgtLang')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('form.tgtLangPlaceholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {glossaryLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {t(`languages.${lang.code}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {isUpdating ? t('form.saving') : tCommon('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
