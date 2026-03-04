"use client"

import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ManualTerm } from "../types"
import type { Glossary } from "@/features/glossary"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GlossarySectionProps {
  glossaries: Glossary[]
  selectedGlossaryId: string | null
  selectedGlossaryTermCount: number
  isLoadingGlossaries: boolean
  isLoadingGlossaryTerms: boolean
  onSelectGlossary: (id: string | null) => void
  manualTerms: ManualTerm[]
  onAddManualTerm: () => void
  onUpdateManualTerm: (id: string, field: "src" | "tgt", value: string) => void
  onRemoveManualTerm: (id: string) => void
}

export function GlossarySection({
  glossaries,
  selectedGlossaryId,
  selectedGlossaryTermCount,
  isLoadingGlossaries,
  isLoadingGlossaryTerms,
  onSelectGlossary,
  manualTerms,
  onAddManualTerm,
  onUpdateManualTerm,
  onRemoveManualTerm,
}: GlossarySectionProps) {
  const t = useTranslations("documents.configure")
  const validManualTerms = manualTerms.filter(
    (term) => term.src.trim().length > 0 && term.tgt.trim().length > 0
  ).length
  const totalAppliedTerms = selectedGlossaryTermCount + validManualTerms
  const isNearLimit = manualTerms.length >= 18

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("glossary")}</CardTitle>
        <CardDescription>{t("glossaryDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">{t("savedGlossaryLabel")}</Label>
            <Select
              value={selectedGlossaryId ?? "none"}
              onValueChange={(value) => onSelectGlossary(value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("savedGlossaryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("savedGlossaryNone")}</SelectItem>
                {glossaries.map((glossary) => (
                  <SelectItem key={glossary.id} value={glossary.id}>
                    {glossary.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isLoadingGlossaries ? (
              <p className="text-xs text-muted-foreground">{t("savedGlossaryLoading")}</p>
            ) : null}

            {!isLoadingGlossaries && glossaries.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("savedGlossaryEmpty")}</p>
            ) : null}

            {selectedGlossaryId ? (
              <p className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                {isLoadingGlossaryTerms
                  ? t("savedGlossaryTermsLoading")
                  : t("savedGlossaryTermsCount", { count: selectedGlossaryTermCount })}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("manualTermsTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("manualTermsHelper")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddManualTerm}
              disabled={manualTerms.length >= 20}
            >
              <Plus className="size-4" />
              {t("addTerm")} ({manualTerms.length}/20)
            </Button>
          </div>

          {manualTerms.length > 0 ? (
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
              <span>{t("sourceTerm")}</span>
              <span>{t("translatedTerm")}</span>
              <span className="text-right">{t("actions")}</span>
            </div>
          ) : null}

          {manualTerms.map((term) => (
            <div key={term.id} className="rounded-lg border bg-background p-2.5">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-3">
                <Input
                  placeholder={t("sourceTerm")}
                  value={term.src}
                  onChange={(e) => onUpdateManualTerm(term.id, "src", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder={t("translatedTerm")}
                  value={term.tgt}
                  onChange={(e) => onUpdateManualTerm(term.id, "tgt", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveManualTerm(term.id)}
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={t("removeTerm")}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {(term.src.trim().length > 0 && term.tgt.trim().length === 0) ||
              (term.src.trim().length === 0 && term.tgt.trim().length > 0) ? (
                <p className="mt-2 text-xs text-warning">{t("termPairWarning")}</p>
              ) : null}
            </div>
          ))}

          {manualTerms.length === 0 && (
            <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center">
              <p className="text-sm font-medium text-foreground">{t("emptyManualTitle")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("emptyManualHint")}</p>
            </div>
          )}

          {isNearLimit ? <p className="text-xs text-warning">{t("nearLimitWarning")}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/20 px-3 py-2">
          <span className="text-xs text-muted-foreground">{t("termsAppliedLabel")}</span>
          <span className="text-sm font-semibold text-foreground">
            {t("termsAppliedCount", { count: totalAppliedTerms })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
