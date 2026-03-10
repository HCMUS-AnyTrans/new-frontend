import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';

interface TermEmptyStateProps {
  hasSearch: boolean;
}

export function TermEmptyState({ hasSearch }: TermEmptyStateProps) {
  const t = useTranslations('glossary.terms');

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="size-10 text-muted-foreground/50 mb-3" />
      <h3 className="text-sm font-medium text-foreground mb-1">
        {hasSearch ? t('noSearchResults') : t('noTerms')}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        {hasSearch ? t('noSearchResultsDescription') : t('noTermsDescription')}
      </p>
    </div>
  );
}
