'use client';

import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Search, Type } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { FontCheckItem } from '../types';

function getFontPreviewStyle(fontName: string) {
  const normalized = fontName.toLowerCase();
  const serifHints = ['times', 'georgia', 'garamond', 'serif', 'cambria', 'baskerville', 'roman'];
  const fallback = serifHints.some((hint) => normalized.includes(hint))
    ? 'ui-serif, Georgia, Cambria, "Times New Roman", serif'
    : 'ui-sans-serif, system-ui, sans-serif';

  return {
    fontFamily: `"${fontName}", ${fallback}`,
  };
}

interface FontMappingRowProps {
  item: FontCheckItem;
  value: string;
  enabled: boolean;
  replacementLabel: string;
  enabledLabel: string;
  supportedLabel: string;
  unsupportedLabel: string;
  supportedLockedLabel: string;
  suggestedLabel: string;
  toggleOnLabel: string;
  toggleOffLabel: string;
  searchPlaceholder: string;
  noSearchResultsLabel: string;
  noCandidatesLabel: string;
  onToggle: (checked: boolean) => void;
  onChange: (value: string) => void;
}

export function FontMappingRow({
  item,
  value,
  enabled,
  replacementLabel,
  enabledLabel,
  supportedLabel,
  unsupportedLabel,
  supportedLockedLabel,
  suggestedLabel,
  toggleOnLabel,
  toggleOffLabel,
  searchPlaceholder,
  noSearchResultsLabel,
  noCandidatesLabel,
  onToggle,
  onChange,
}: FontMappingRowProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const options = Array.from(
    new Set(
      [
        ...(item.supported ? [item.from_font] : []),
        item.to_font,
        ...(item.replacement_candidates ?? []),
      ].filter(Boolean),
    ),
  );
  const currentValue = value || item.to_font || item.from_font;
  const hasCandidates = options.length > 0;
  const isReplacementLocked = item.supported;
  const isToggleDisabled = item.supported;
  const isComboboxDisabled = isReplacementLocked || !enabled || !hasCandidates;
  const listboxId = `${item.from_font.replace(/\s+/g, '-').toLowerCase()}-font-combobox-list`;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
    setQuery('');
  };

  const statusLabel = item.supported ? supportedLabel : unsupportedLabel;
  const toggleStateLabel = item.supported
    ? supportedLabel
    : enabled
      ? toggleOnLabel
      : toggleOffLabel;
  const helperText = item.supported
    ? supportedLockedLabel
    : item.replacement_candidates.length === 0
      ? noCandidatesLabel
      : null;

  return (
    <div
      className={cn(
        'rounded-xl bg-card px-4 py-3.5 transition-colors sm:px-5 sm:py-4',
        item.supported
          ? 'border border-emerald-200/70 bg-emerald-50/30'
          : enabled
            ? 'border border-border/80 bg-card'
            : 'border border-border/70 bg-muted/10',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-3 lg:items-center',
          item.supported
            ? 'lg:block'
            : 'lg:grid lg:grid-cols-[minmax(0,1.45fr)_240px_112px] lg:gap-0'
        )}
      >
        <div
          className={cn('min-w-0 space-y-2 pr-0 lg:pr-4',
            enabled || item.supported ? '' : 'opacity-60'
          )}
        >
          <div className={cn("flex gap-3", item.supported ? "items-center" : "items-start")}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Type className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="break-words text-base font-semibold leading-5 text-foreground"
                  style={getFontPreviewStyle(item.from_font)}
                >
                  {item.from_font}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium shadow-none',
                    item.supported
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700',
                  )}
                >
                  {item.supported ? (
                    <CheckCircle2 className="mr-1 size-3.5 fill-emerald-700 text-emerald-100" />
                  ) : (
                    <AlertTriangle className="mr-1 size-3 text-amber-600" />
                  )}
                  {statusLabel}
                </Badge>
              </div>
              {!item.supported ? (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {suggestedLabel}:{' '}
                  <span className="font-medium text-foreground" style={getFontPreviewStyle(item.to_font || item.from_font)}>
                    {item.to_font || item.from_font}
                  </span>
                </p>
              ) : null}
              {helperText && !item.supported ? (
                <p className={cn(
                  'mt-1 text-[11px]',
                  item.supported ? 'text-muted-foreground' : 'text-amber-700'
                )}>
                  {helperText}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {!item.supported ? (
          <div className="flex items-center border-t border-border/50 pt-3 lg:min-h-[64px] lg:border-t-0 lg:border-l lg:px-4 lg:pt-0">
          <div className="w-full">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {replacementLabel}
            </p>
            <Popover
              open={open}
              onOpenChange={(nextOpen) =>
                !isComboboxDisabled && setOpen(nextOpen)
              }
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  role="combobox"
                  aria-controls={listboxId}
                  aria-expanded={open}
                  disabled={isComboboxDisabled}
                  className={cn(
                    'flex h-10 w-full items-center justify-between rounded-xl border bg-background px-3 py-2 text-xs outline-none transition-colors',
                    isComboboxDisabled
                      ? 'cursor-not-allowed border-input opacity-60'
                      : 'border-input hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                  )}
                >
                  <span className="truncate text-left font-medium text-foreground">
                    {currentValue}
                  </span>
                  <ChevronDown
                    className={cn(
                      'ml-2 size-4 shrink-0 text-muted-foreground transition-transform',
                      open && 'rotate-180',
                    )}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] min-w-[18rem] rounded-xl border p-0 shadow-lg"
                align="start"
                sideOffset={6}
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  searchInputRef.current?.focus();
                }}
                onCloseAutoFocus={() => setQuery('')}
              >
                <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <div id={listboxId} className="max-h-64 overflow-y-auto p-1.5">
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                      {noSearchResultsLabel}
                    </div>
                  ) : (
                    filteredOptions.map((option) => {
                      const isSelected = option === currentValue;

                      return (
                        <button
                          key={`${item.from_font}-${option}`}
                          type="button"
                          onClick={() => handleSelect(option)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors',
                            isSelected
                              ? 'bg-muted text-foreground'
                              : 'text-foreground hover:bg-muted/60',
                          )}
                        >
                          <span className="truncate pr-3" style={getFontPreviewStyle(option)}>
                            {option}
                          </span>
                          {isSelected ? (
                            <CheckCircle2 className="size-4 shrink-0 text-primary" />
                          ) : null}
                        </button>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          </div>
        ) : null}

        {!item.supported ? (
          <div className="flex items-center border-t border-border/50 pt-3 lg:min-h-[64px] lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
          <div className="w-full">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {enabledLabel}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Switch
                checked={item.supported ? true : enabled}
                onCheckedChange={onToggle}
                disabled={isToggleDisabled}
              />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-none text-foreground">{toggleStateLabel}</p>
              </div>
            </div>
          </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
