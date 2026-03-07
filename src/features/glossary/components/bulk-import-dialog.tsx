"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { useBulkImport } from "../hooks/use-bulk-import";
import { MAX_BULK_IMPORT_SIZE } from "../data";
import type { CreateTermDto, BulkImportResult } from "../types";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossaryId: string;
}

/**
 * Parse raw CSV text into term pairs.
 * Supports: "srcTerm, tgtTerm" per line (with optional quoting).
 * Skips blank lines and header-looking rows.
 */
function parseCsv(raw: string): CreateTermDto[] {
  const lines = raw.split(/\r?\n/);
  const terms: CreateTermDto[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip header-like lines
    if (/^(source|src|srcTerm)/i.test(trimmed)) continue;

    // Split on first comma (handle simple CSV)
    const commaIdx = trimmed.indexOf(",");
    if (commaIdx === -1) continue;

    const srcTerm = trimmed.slice(0, commaIdx).trim().replace(/^"|"$/g, "");
    const tgtTerm = trimmed
      .slice(commaIdx + 1)
      .trim()
      .replace(/^"|"$/g, "");

    if (srcTerm && tgtTerm) {
      terms.push({ srcTerm, tgtTerm });
    }
  }

  return terms;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  glossaryId,
}: BulkImportDialogProps) {
  const t = useTranslations("glossary.terms");
  const tCommon = useTranslations("common");

  // ─── Local state ────────────────────────────────────────────────────
  const [csvText, setCsvText] = useState("");
  const [parsedTerms, setParsedTerms] = useState<CreateTermDto[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null,
  );
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Hook ───────────────────────────────────────────────────────────
  const {
    bulkImport,
    isImporting,
    reset: resetMutation,
  } = useBulkImport({
    onSuccess: (data) => {
      setImportResult(data);
      setImportError(null);
    },
    onError: (message) => {
      setImportError(message);
      setImportResult(null);
    },
  });

  // ─── Handlers ───────────────────────────────────────────────────────
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
          t("bulkImportMaxExceeded", {
            max: MAX_BULK_IMPORT_SIZE,
            count: terms.length,
          }),
        );
        setParsedTerms([]);
        return;
      }

      setParsedTerms(terms);
    },
    [t, resetMutation],
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === "string") {
          handleParse(text);
        }
      };
      reader.readAsText(file);

      // Reset file input so same file can be re-uploaded
      e.target.value = "";
    },
    [handleParse],
  );

  const handleImport = useCallback(() => {
    if (parsedTerms.length === 0) return;
    bulkImport({
      glossaryId,
      dto: { terms: parsedTerms },
    });
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
      if (!isOpen) {
        handleClear();
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, handleClear],
  );

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            {t("bulkImport")}
          </DialogTitle>
          <DialogDescription>{t("bulkImportDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {/* Success banner */}
          {importResult && (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-3 text-sm text-green-700 dark:text-green-300">
              <CheckCircle2 className="size-4 shrink-0" />
              {t("bulkImportSuccess", {
                created: importResult.created,
                skipped: importResult.skipped,
              })}
            </div>
          )}

          {/* Error banners */}
          {(parseError || importError) && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {parseError || importError}
            </div>
          )}

          {/* CSV textarea */}
          {!importResult && (
            <>
              <div className="space-y-2">
                <Textarea
                  placeholder={t("bulkImportPlaceholder")}
                  value={csvText}
                  onChange={(e) => handleParse(e.target.value)}
                  rows={6}
                  className="font-sans text-sm"
                  disabled={isImporting}
                />
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {csvText && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      disabled={isImporting}
                    >
                      <X className="size-4" />
                      {t("bulkImportClear")}
                    </Button>
                  )}
                  {parsedTerms.length > 0 && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {t("bulkImportParsed", { count: parsedTerms.length })}
                    </span>
                  )}
                </div>
              </div>

              {/* Preview table */}
              {parsedTerms.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    {t("bulkImportPreview")}
                  </h4>
                  <div className="max-h-48 overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs font-medium text-muted-foreground w-12">
                            #
                          </TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">
                            {t("srcTerm")}
                          </TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">
                            {t("tgtTerm")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedTerms.map((term, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs text-muted-foreground tabular-nums">
                              {i + 1}
                            </TableCell>
                            <TableCell className="text-sm">
                              {term.srcTerm}
                            </TableCell>
                            <TableCell className="text-sm">
                              {term.tgtTerm}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-2 pt-4 sm:space-x-0">
          {!importResult ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload className="size-4" />
              {t("bulkImportUpload")}
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isImporting}
            >
              {importResult ? tCommon("close") : tCommon("cancel")}
            </Button>
            {!importResult && (
              <Button
                onClick={handleImport}
                disabled={isImporting || parsedTerms.length === 0}
              >
                {isImporting && <Loader2 className="size-4 animate-spin" />}
                {isImporting ? t("bulkImportImporting") : t("bulkImport")}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
