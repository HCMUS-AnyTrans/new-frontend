"use client"

import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ManualTerm } from "../types"

interface GlossarySectionProps {
  manualTerms: ManualTerm[]
  onAddManualTerm: () => void
  onUpdateManualTerm: (id: string, field: "src" | "tgt", value: string) => void
  onRemoveManualTerm: (id: string) => void
}

export function GlossarySection({
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
