'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { useGlossaries } from '../hooks/use-glossaries';
import { GlossaryFilters } from './glossary-filters';
import { GlossaryList } from './glossary-list';
import { GlossaryEmptyState } from './glossary-empty-state';
import { GlossarySkeleton } from './glossary-skeleton';
import { GlossaryDetail } from './glossary-detail';
import { CreateGlossaryDialog } from './create-glossary-dialog';
import { EditGlossaryDialog } from './edit-glossary-dialog';
import { DeleteGlossaryDialog } from './delete-glossary-dialog';
import type { Glossary, GlossaryQueryParams } from '../types';

/**
 * Top-level orchestrator for the glossary list page.
 * Manages filter/pagination state and wires hooks to presentational components.
 */
export function GlossaryContent() {
  const t = useTranslations('glossary');

  // ─── View State ──────────────────────────────────────────────────────
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string | null>(
    null
  );

  // ─── Filter & Pagination State ──────────────────────────────────────
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [srcLangFilter, setSrcLangFilter] = useState('all');
  const [page, setPage] = useState(1);

  // ─── Dialog State ───────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedGlossary, setSelectedGlossary] = useState<Glossary | null>(
    null
  );

  // ─── Build query params ─────────────────────────────────────────────
  const queryParams: GlossaryQueryParams = {
    page,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...(search && { search }),
    ...(domainFilter !== 'all' && { domain: domainFilter }),
    ...(srcLangFilter !== 'all' && { srcLang: srcLangFilter }),
  };

  const {
    glossaries,
    pagination,
    isLoading,
    isError,
    isFetching,
  } = useGlossaries(queryParams);

  const hasFilters =
    search !== '' || domainFilter !== 'all' || srcLangFilter !== 'all';

  // ─── Handlers ───────────────────────────────────────────────────────
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDomainChange = useCallback((value: string) => {
    setDomainFilter(value);
    setPage(1);
  }, []);

  const handleSrcLangChange = useCallback((value: string) => {
    setSrcLangFilter(value);
    setPage(1);
  }, []);

  const handleGlossaryClick = useCallback((glossary: Glossary) => {
    setSelectedGlossaryId(glossary.id);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedGlossaryId(null);
  }, []);

  const handleEdit = useCallback((glossary: Glossary) => {
    setSelectedGlossary(glossary);
    setEditOpen(true);
  }, []);

  const handleDelete = useCallback((glossary: Glossary) => {
    setSelectedGlossary(glossary);
    setDeleteOpen(true);
  }, []);

  // ─── Detail View ─────────────────────────────────────────────────────
  if (selectedGlossaryId) {
    return (
      <GlossaryDetail
        glossaryId={selectedGlossaryId}
        onBack={handleBackToList}
      />
    );
  }

  // ─── Loading State ──────────────────────────────────────────────────
  if (isLoading || isError) {
    return <GlossarySkeleton />;
  }

  // ─── List View ──────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <GlossaryFilters
          search={search}
          onSearchChange={handleSearchChange}
          domainFilter={domainFilter}
          onDomainChange={handleDomainChange}
          srcLangFilter={srcLangFilter}
          onSrcLangChange={handleSrcLangChange}
        />
        <Button size="sm" className="shrink-0" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          {t('createGlossary')}
        </Button>
      </div>

      {!glossaries || glossaries.length === 0 ? (
        <GlossaryEmptyState
          hasFilters={hasFilters}
          onCreateClick={() => setCreateOpen(true)}
        />
      ) : (
        <>
          <GlossaryList
            glossaries={glossaries}
            onGlossaryClick={handleGlossaryClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={setPage}
              isFetching={isFetching}
            />
          )}
        </>
      )}

      {/* Dialogs */}
      <CreateGlossaryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <EditGlossaryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        glossary={selectedGlossary}
      />
      <DeleteGlossaryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        glossary={selectedGlossary}
      />
    </>
  );
}
