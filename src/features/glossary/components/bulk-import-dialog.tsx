"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  FileUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  ClipboardList,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useBulkImport } from "../hooks/use-bulk-import";
import { MAX_BULK_IMPORT_SIZE } from "../data";
import type { CreateTermDto, BulkImportResult } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossaryId: string;
}

// ─── CSV Parser ──────────────────────────────────────────────────────────────

/**
 * Parse raw CSV text into term pairs.
 * Supports "srcTerm, tgtTerm" per line with optional quoting.
 * Skips blank lines and header-looking rows.
 */
function parseCsv(raw: string): CreateTermDto[] {
  const lines = raw.split(/\r?\n/);
  const terms: CreateTermDto[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^(source|src|srcTerm)/i.test(trimmed)) continue;

    const commaIdx = trimmed.indexOf(",");
    if (commaIdx === -1) continue;

    const srcTerm = trimmed.slice(0, commaIdx).trim().replace(/^"|"$/g, "");
    const tgtTerm = trimmed.slice(commaIdx + 1).trim().replace(/^"|"$/g, "");

    if (srcTerm && tgtTerm) {
      terms.push({ srcTerm, tgtTerm });
    }
  }

  return terms;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SuccessViewProps {
  result: BulkImportResult;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, values?: Record<string, any>) => string;
  tCommon: (key: string) => string;
  onClose: () => void;
}

function SuccessView({ result, t, tCommon, onClose }: SuccessViewProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-8 text-success" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">
          {t("bulkImportSuccess", {
            created: result.created,
            skipped: result.skipped,
          })}
        </h3>
      </div>

      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="rounded-xl border bg-muted/40 p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{result.created}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("bulkImportCreated")}</p>
        </div>
        <div className="rounded-xl border bg-muted/40 p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{result.skipped}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("bulkImportSkipped")}</p>
        </div>
      </div>

      <Button onClick={onClose} className="w-full max-w-xs">
        {tCommon("close")}
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BulkImportDialog({
  open,
  onOpenChange,
  glossaryId,
}: BulkImportDialogProps) {
  const t = useTranslations("glossary.terms");
  const tCommon = useTranslations("common");

  // ─── Local state ──────────────────────────────────────────────────────
  const [csvText, setCsvText] = useState("");
  const [parsedTerms, setParsedTerms] = useState<CreateTermDto[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Hook ─────────────────────────────────────────────────────────────
  const { bulkImport, isImporting, reset: resetMutation } = useBulkImport({
    onSuccess: (data) => {
      setImportResult(data);
      setImportError(null);
    },
    onError: (message) => {
      setImportError(message);
      setImportResult(null);
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleParse = useCallback(
    (text: string) => {
      setCsvText(text);
      setParseError(null);
      setImportResult(null);
      setImportError(null);
      resetMutation();

      if (!text.trim()) {
        setParsedTerms([]);
        return;
      }

      const terms = parseCsv(text);

      if (terms.length === 0) {
        setParseError(t("bulkImportParseError"));
        setParsedTerms([]);
        return;
      }

      if (terms.length > MAX_BULK_IMPORT_SIZE) {
        setParseError(
          t("bulkImportMaxExceeded", { max: MAX_BULK_IMPORT_SIZE, count: terms.length }),
        );
        setParsedTerms([]);
        return;
      }

      setParsedTerms(terms);
    },
    [t, resetMutation],
  );

  const handleFileRead = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === "string") {
          handleParse(text);
        }
      };
      reader.readAsText(file);
    },
    [handleParse],
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileRead(file);
      e.target.value = "";
    },
    [handleFileRead],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.name.endsWith(".csv") || file.name.endsWith(".txt"))) {
        handleFileRead(file);
      }
    },
    [handleFileRead],
  );

  const handleImport = useCallback(() => {
    if (parsedTerms.length === 0) return;
    bulkImport({ glossaryId, dto: { terms: parsedTerms } });
  }, [bulkImport, glossaryId, parsedTerms]);

  const handleClear = useCallback(() => {
    setCsvText("");
    setParsedTerms([]);
    setParseError(null);
    setImportResult(null);
    setImportError(null);
    resetMutation();
  }, [resetMutation]);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) handleClear();
      onOpenChange(isOpen);
    },
    [onOpenChange, handleClear],
  );

  const hasError = !!(parseError || importError);

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileUp className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base">{t("bulkImport")}</DialogTitle>
              <DialogDescription className="mt-0.5 text-xs">
                {t("bulkImportDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {importResult ? (
            <SuccessView
              result={importResult}
              t={t}
              tCommon={tCommon}
              onClose={() => handleClose(false)}
            />
          ) : (
            <div className="space-y-5">
              {/* Error banner */}
              {hasError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 p-3.5 text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p className="text-sm">{parseError || importError}</p>
                </div>
              )}

              {/* Upload drop zone */}
              <div
                className={cn(
                  "group relative flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-7 text-center transition-all duration-150",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/2",
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                onDrop={handleDrop}
              >
                <div className={cn(
                  "flex size-12 items-center justify-center rounded-xl border transition-colors",
                  isDragOver
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground group-hover:border-primary/30 group-hover:text-primary",
                )}>
                  <FileText className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("bulkImportUploadHint")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    .csv, .txt
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="gap-2"
                >
                  <FileUp className="size-3.5" />
                  {t("bulkImportUpload")}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ClipboardList className="size-3.5" />
                  {t("bulkImportPaste")}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    placeholder={t("bulkImportPlaceholder")}
                    value={csvText}
                    onChange={(e) => handleParse(e.target.value)}
                    rows={5}
                    className="resize-none text-sm"
                    disabled={isImporting}
                  />
                </div>

                {/* Helpers row */}
                {csvText && (
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      disabled={isImporting}
                      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3.5" />
                      {t("bulkImportClear")}
                    </Button>
                    {parsedTerms.length > 0 && (
                      <Badge variant="secondary" className="gap-1.5 text-xs">
                        <ArrowRightLeft className="size-3" />
                        {t("bulkImportParsed", { count: parsedTerms.length })}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Preview table */}
              {parsedTerms.length > 0 && (
                <div className="overflow-hidden rounded-xl border">
                  <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                    <span className="text-xs font-medium text-foreground">
                      {t("bulkImportPreview")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {parsedTerms.length} rows
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-muted/20">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="h-9 w-10 px-4 text-xs font-medium text-muted-foreground">
                            #
                          </TableHead>
                          <TableHead className="h-9 px-4 text-xs font-medium text-muted-foreground">
                            {t("srcTerm")}
                          </TableHead>
                          <TableHead className="h-9 px-4 text-xs font-medium text-muted-foreground">
                            {t("tgtTerm")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedTerms.map((term, i) => (
                          <TableRow key={i} className="hover:bg-muted/20">
                            <TableCell className="px-4 py-2.5 text-xs tabular-nums text-muted-foreground">
                              {i + 1}
                            </TableCell>
                            <TableCell className="px-4 py-2.5 text-sm font-medium text-foreground">
                              {term.srcTerm}
                            </TableCell>
                            <TableCell className="px-4 py-2.5 text-sm text-foreground/80">
                              {term.tgtTerm}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — hidden when success view handles its own close button */}
        {!importResult && (
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isImporting}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting || parsedTerms.length === 0}
              className="min-w-[140px]"
            >
              {isImporting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("bulkImportImporting")}
                </>
              ) : (
                <>
                  <FileUp className="size-4" />
                  {parsedTerms.length > 0
                    ? t("bulkImportParsed", { count: parsedTerms.length })
                    : t("bulkImport")}
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
