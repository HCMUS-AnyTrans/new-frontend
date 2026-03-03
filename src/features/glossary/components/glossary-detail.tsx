'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, ArrowRight, BookOpen, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
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

      {/* Glossary header info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="size-5 text-primary" />
            {glossary.name}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {t(`domains.${glossary.domain}`)}
            </Badge>
            <span className="text-muted-foreground mx-1">·</span>
            <Badge variant="outline" className="text-xs font-normal">
              {t(`languages.${glossary.srcLang}`)}
            </Badge>
            <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
            <Badge variant="outline" className="text-xs font-normal">
              {t(`languages.${glossary.tgtLang}`)}
            </Badge>
            <span className="text-muted-foreground mx-1">·</span>
            <span>{t('termCount', { count: glossary.termCount })}</span>
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

      {/* Term search */}
      <div className="mb-4">
        <Input
          placeholder={tTerms('searchPlaceholder')}
          value={termSearch}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      {/* Term table or empty/loading state */}
      {isLoadingTerms ? (
        <TermTableSkeleton />
      ) : !terms || terms.length === 0 ? (
        <TermEmptyState hasSearch={termSearch !== ''} />
      ) : (
        <>
          <TermTable
            terms={terms}
            onEdit={handleEditTerm}
            onDelete={handleDeleteTerm}
          />

          {termPagination && termPagination.totalPages > 1 && (
            <Pagination
              page={termPagination.page}
              totalPages={termPagination.totalPages}
              hasNext={termPagination.hasNext}
              hasPrev={termPagination.hasPrev}
              onPageChange={setTermPage}
              isFetching={isFetchingTerms}
            />
          )}
        </>
      )}

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
