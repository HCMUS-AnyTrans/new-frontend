'use client';

import { useState, useCallback, useRef } from 'react';
import { useRecentJobs } from '@/features/dashboard/hooks';
import type { RecentJobsQuery } from '@/features/dashboard/api/dashboard.api';
import { ITEMS_PER_PAGE } from '../data';

/**
 * Encapsulates all history page state: search (debounced), status filter,
 * pagination, and the underlying data-fetching via useRecentJobs.
 */
export function useHistoryJobs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  // Build query params
  const queryParams: RecentJobsQuery = {
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  };

  const { jobsData, isLoading, isError } = useRecentJobs(queryParams);

  const jobs = jobsData?.data ?? [];
  const meta = jobsData?.meta;
  const hasFilters = !!debouncedSearch || statusFilter !== 'all';

  return {
    // Data
    jobs,
    meta,
    isLoading,
    isError,
    // Filter state
    search,
    statusFilter,
    hasFilters,
    // Actions
    handleSearchChange,
    handleStatusChange,
    setPage,
  };
}
