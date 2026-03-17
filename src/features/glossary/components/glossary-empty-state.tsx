import { useTranslations } from 'next-intl';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlossaryEmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
}

export function GlossaryEmptyState({
  hasFilters,
  onCreateClick,
}: GlossaryEmptyStateProps) {
  const t = useTranslations('glossary');

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-base font-medium text-foreground mb-1">
        {hasFilters ? t('noResults') : t('noGlossaries')}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {hasFilters
          ? t('noResultsDescription')
          : t('noGlossariesDescription')}
      </p>
      {!hasFilters && (
        <Button size="sm" onClick={onCreateClick}>
          <Plus className="size-4" />
          {t('createGlossary')}
        </Button>
      )}
    </div>
  );
}
