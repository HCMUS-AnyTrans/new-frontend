"use client"

import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("glossary")}</CardTitle>
        <CardDescription>{t("glossaryDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium text-foreground">{t("savedGlossaryLabel")}</p>
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
            <p className="text-xs text-muted-foreground">
              {isLoadingGlossaryTerms
                ? t("savedGlossaryTermsLoading")
                : t("savedGlossaryTermsCount", { count: selectedGlossaryTermCount })}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {manualTerms.map((term) => (
            <div key={term.id} className="flex gap-3">
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
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          {manualTerms.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t("noTerms")}
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onAddManualTerm}
            disabled={manualTerms.length >= 20}
          >
            <Plus className="size-4" />
            {t("addTerm")} {manualTerms.length > 0 && `(${manualTerms.length}/20)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
