'use client';

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('createGlossary')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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

            {/* Domain */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('domain')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
                    defaultValue={field.value}
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
                disabled={isCreating}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="size-4 animate-spin" />}
                {isCreating ? t('form.creating') : t('createGlossary')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
