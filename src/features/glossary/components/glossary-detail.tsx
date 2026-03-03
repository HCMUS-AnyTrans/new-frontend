'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, ArrowRight, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { glossary, isLoading: isLoadingDetail } =
    useGlossaryDetail(glossaryId);

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
    []
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
          className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="size-4" />
          {t('backToList')}
        </Button>
      </div>

      {/* Glossary header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted border flex items-center justify-center text-muted-foreground shrink-0">
            {DomainIcon && <DomainIcon className="size-5" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight">
              {glossary.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
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
          onClick={() => setBulkImportOpen(true)}
        >
          <Upload className="size-4" />
          {tTerms('bulkImport')}
        </Button>
      </div>

      {/* Inline add term form */}
      <AddTermForm glossaryId={glossaryId} />

      {/* Search + Table card */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* Search header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={tTerms('searchPlaceholder')}
              value={termSearch}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table body */}
        {isLoadingTerms ? (
          <TermTableSkeleton />
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
          <div className="p-4 border-t bg-muted/30">
            <Pagination
              page={termPagination.page}
              totalPages={termPagination.totalPages}
              hasNext={termPagination.hasNext}
              hasPrev={termPagination.hasPrev}
              onPageChange={setTermPage}
              isFetching={isFetchingTerms}
            />
          </div>
        )}
      </div>

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
