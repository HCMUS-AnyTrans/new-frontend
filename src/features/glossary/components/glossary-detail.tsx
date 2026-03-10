'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, ArrowRight, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppCard, AppCardContent } from '@/components/ui/app-card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { glossaryDomains } from '../data';
import { useGlossaryDetail } from '../hooks/use-glossary-detail';
import { useTerms } from '../hooks/use-terms';
import { AddTermForm } from './add-term-form';
import { TermTable } from './term-table';
import { TermEmptyState } from './term-empty-state';
import { TermTableSkeleton } from './term-table-skeleton';
import { EditTermDialog } from './edit-term-dialog';
import { DeleteTermDialog } from './delete-term-dialog';
import { BulkImportDialog } from './bulk-import-dialog';
import type { Term, TermQueryParams } from '../types';

interface GlossaryDetailProps {
  glossaryId: string;
}

/**
 * Detail view for a single glossary.
 * Shows glossary metadata header, inline add-term form,
 * searchable/paginated term table, and edit/delete term dialogs.
 */
export function GlossaryDetail({ glossaryId }: GlossaryDetailProps) {
  const t = useTranslations('glossary');
  const tTerms = useTranslations('glossary.terms');
  const router = useRouter();
  const locale = useLocale();

  // ─── Term search & pagination state ─────────────────────────────────
  const [termSearch, setTermSearch] = useState('');
  const [termPage, setTermPage] = useState(1);

  // ─── Dialog state ───────────────────────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  // ─── Data fetching ──────────────────────────────────────────────────
  const { glossary, isLoading: isLoadingDetail } = useGlossaryDetail(glossaryId);

  const termQueryParams: TermQueryParams = {
    page: termPage,
    limit: 20,
    sortBy: 'srcTerm',
    sortOrder: 'asc',
    ...(termSearch && { search: termSearch }),
  };

  const {
    terms,
    pagination: termPagination,
    isLoading: isLoadingTerms,
    isFetching: isFetchingTerms,
  } = useTerms(glossaryId, termQueryParams);

  // ─── Handlers ───────────────────────────────────────────────────────
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTermSearch(e.target.value);
      setTermPage(1);
    },
    [],
  );

  const handleEditTerm = useCallback((term: Term) => {
    setSelectedTerm(term);
    setEditOpen(true);
  }, []);

  const handleDeleteTerm = useCallback((term: Term) => {
    setSelectedTerm(term);
    setDeleteOpen(true);
  }, []);

  // ─── Loading state ──────────────────────────────────────────────────
  if (isLoadingDetail) {
    return <TermTableSkeleton />;
  }

  if (!glossary) {
    return null;
  }

  const domainInfo = glossaryDomains.find((d) => d.id === glossary.domain);
  const DomainIcon = domainInfo?.icon;

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Back button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${locale}/glossary`)}
          className="-ml-2 gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t('backToList')}
        </Button>
      </div>

      {/* Glossary header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
            {DomainIcon && <DomainIcon className="size-5" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold leading-tight sm:text-2xl">
              {glossary.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-muted-foreground">
              <span>{t(`domains.${glossary.domain}`)}</span>
              <span>·</span>
              <span>{t(`languages.${glossary.srcLang}`)}</span>
              <ArrowRight className="size-3 shrink-0" />
              <span>{t(`languages.${glossary.tgtLang}`)}</span>
              <span>·</span>
              <span>{t('termCount', { count: glossary.termCount })}</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full shrink-0 sm:w-auto"
          onClick={() => setBulkImportOpen(true)}
        >
          <Upload className="size-4" />
          {tTerms('bulkImport')}
        </Button>
      </div>

      {/* Inline add-term form */}
      <AddTermForm glossaryId={glossaryId} />

      {/* Search + Term table card */}
      <AppCard className="overflow-hidden">
        {/* Search header */}
        <div className="border-b bg-muted/40 px-4 py-3 lg:px-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={tTerms('searchPlaceholder')}
              value={termSearch}
              onChange={handleSearchChange}
              className="h-9 bg-background pl-9 text-sm"
            />
          </div>
        </div>

        {/* Table / empty state */}
        {isLoadingTerms ? (
          <TermTableSkeleton showControls={false} />
        ) : !terms || terms.length === 0 ? (
          <TermEmptyState hasSearch={termSearch !== ''} />
        ) : (
          <TermTable
            terms={terms}
            onEdit={handleEditTerm}
            onDelete={handleDeleteTerm}
          />
        )}

        {/* Pagination footer */}
        {termPagination && termPagination.totalPages > 1 && (
          <AppCardContent
            padding="none"
            className="border-t bg-muted/40 px-4 py-3 lg:px-6"
          >
            <Pagination
              page={termPagination.page}
              totalPages={termPagination.totalPages}
              hasNext={termPagination.hasNext}
              hasPrev={termPagination.hasPrev}
              onPageChange={setTermPage}
              isFetching={isFetchingTerms}
            />
          </AppCardContent>
        )}
      </AppCard>

      {/* Term dialogs */}
      <EditTermDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        glossaryId={glossaryId}
        term={selectedTerm}
      />
      <DeleteTermDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        glossaryId={glossaryId}
        term={selectedTerm}
      />
      <BulkImportDialog
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        glossaryId={glossaryId}
      />
    </>
  );
}
