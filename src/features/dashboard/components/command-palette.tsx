'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Command, CommandEmpty, CommandList, CommandInput } from 'cmdk';
import { Search, X } from 'lucide-react';
import { useSearchData } from './search/use-search-data';
import {
  SearchNavGroup,
  SearchJobsGroup,
  SearchGlossariesGroup,
} from './search/search-groups';
import { SearchFooter } from './search/search-footer';

export interface SearchDropdownHandle {
  focus: () => void;
}

interface SearchDropdownProps {
  autoFocus?: boolean;
  onClose?: () => void;
}

export const SearchDropdown = forwardRef<
  SearchDropdownHandle,
  SearchDropdownProps
>(function SearchDropdown({ autoFocus, onClose }, ref) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('dashboard.commandPalette');

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    filteredNavItems,
    jobs,
    glossaries,
    isLoadingJobs,
    isLoadingGlossaries,
    showDynamicResults,
    hasNoResults,
  } = useSearchData(query);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  // Auto-focus when prop is set (mobile overlay case)
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeAndReset = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    onClose?.();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') closeAndReset();
    },
    [closeAndReset],
  );

  const navigate = useCallback(
    (href: string) => {
      closeAndReset();
      router.push(`/${locale}${href}`);
    },
    [router, locale, closeAndReset],
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <Command shouldFilter={false} onKeyDown={handleKeyDown}>
        {/* ── Input bar ── */}
        <div className="flex h-9 items-center rounded-full border border-input bg-background px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={t('placeholder')}
            className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="ml-1 rounded text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="ml-1 hidden select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:flex">
              <span>Ctrl</span>K
            </kbd>
          )}
        </div>

        {/* ── Dropdown panel ── */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
            <CommandList className="max-h-[380px] overflow-y-auto p-2">
              {hasNoResults && (
                <CommandEmpty>
                  <div className="flex flex-col items-center py-8 text-muted-foreground">
                    <Search className="mb-2 size-7 opacity-30" />
                    <p className="text-sm font-medium">{t('noResults')}</p>
                    <p className="mt-0.5 text-xs opacity-60">
                      {t('noResultsHint')}
                    </p>
                  </div>
                </CommandEmpty>
              )}

              {!query && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <p>{t('typeToSearch')}</p>
                  <p className="mt-1 text-xs opacity-60">{t('hint')}</p>
                </div>
              )}

              <SearchNavGroup items={filteredNavItems} onSelect={navigate} />

              {showDynamicResults && (
                <>
                  <SearchJobsGroup
                    jobs={jobs}
                    isLoading={isLoadingJobs}
                    onSelect={navigate}
                    showSeparator={filteredNavItems.length > 0}
                  />
                  <SearchGlossariesGroup
                    glossaries={glossaries}
                    isLoading={isLoadingGlossaries}
                    onSelect={navigate}
                  />
                </>
              )}
            </CommandList>

            <SearchFooter />
          </div>
        )}
      </Command>
    </div>
  );
});

export { SearchDropdown as CommandPalette };
