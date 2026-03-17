'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateGlossary } from '../hooks/use-create-glossary';
import {
  createGlossarySchema,
  glossaryDomains,
  glossaryLanguages,
  type CreateGlossaryFormValues,
} from '../data';
import { cn } from '@/lib/utils';

interface CreateGlossaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGlossaryDialog({
  open,
  onOpenChange,
}: CreateGlossaryDialogProps) {
  const t = useTranslations('glossary');
  const tCommon = useTranslations('common');

  const form = useForm<CreateGlossaryFormValues>({
    resolver: zodResolver(createGlossarySchema),
    defaultValues: {
      name: '',
      domain: '',
      srcLang: '',
      tgtLang: '',
    },
  });

  const { createGlossary, isCreating } = useCreateGlossary({
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
    },
  });

  function handleSubmit(values: CreateGlossaryFormValues) {
    createGlossary(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl">{t('createGlossary')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Body */}
            <div className="px-8 pb-8 space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.namePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Domain - Grid buttons */}
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('domain')}</FormLabel>
                    <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {glossaryDomains.map((domain) => {
                        const Icon = domain.icon;
                        const isSelected = field.value === domain.id;
                        return (
                          <button
                            key={domain.id}
                            type="button"
                            onClick={() => field.onChange(domain.id)}
                            className={cn(
                              'flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all',
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                : 'border-border bg-card hover:border-primary/30 hover:bg-muted/50 text-foreground'
                            )}
                          >
                            <Icon className={cn('size-5', isSelected ? 'text-primary-foreground' : 'text-muted-foreground')} />
                            <span className="text-xs font-medium">{t(`domains.${domain.id}`)}</span>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language Pair - horizontal layout */}
              <div>
                <FormLabel className="mb-3 block">{t('form.languagePair')}</FormLabel>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Source Language */}
                  <FormField
                    control={form.control}
                    name="srcLang"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-0">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t('form.srcLangPlaceholder')} />
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

                  {/* Arrow icon */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground self-center rotate-90 sm:rotate-0">
                    <ArrowRightLeft className="size-4" />
                  </div>

                  {/* Target Language */}
                  <FormField
                    control={form.control}
                    name="tgtLang"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-0">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t('form.tgtLangPlaceholder')} />
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
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-muted/50 border-t flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="size-4 animate-spin" />}
                {isCreating ? t('form.creating') : t('createGlossary')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
