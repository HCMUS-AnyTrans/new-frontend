"use client"

import { CheckCircle2, AlertTriangle, Type } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FontCheckItem } from "../types"

interface FontMappingRowProps {
  item: FontCheckItem
  value: string
  groupLabel: string
  replacementLabel: string
  supportedLabel: string
  unsupportedLabel: string
  suggestedLabel: string
  noCandidatesLabel: string
  onChange: (value: string) => void
}

export function FontMappingRow({
  item,
  value,
  groupLabel,
  replacementLabel,
  supportedLabel,
  unsupportedLabel,
  suggestedLabel,
  noCandidatesLabel,
  onChange,
}: FontMappingRowProps) {
  const options = Array.from(
    new Set([item.from_font, item.to_font, ...(item.replacement_candidates ?? [])].filter(Boolean))
  )
  const currentValue = value || item.to_font || item.from_font
  const hasCandidates = options.length > 0

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Type className="size-4 text-muted-foreground" />
              <span className="break-all">{item.from_font}</span>
            </div>
            <Badge variant="outline" className="text-[11px] uppercase tracking-wide">
              {groupLabel}
            </Badge>
            <Badge
              variant="outline"
              className={item.supported ? "border-emerald-500/30 text-emerald-600" : "border-amber-500/30 text-amber-600"}
            >
              {item.supported ? (
                <CheckCircle2 className="mr-1 size-3.5" />
              ) : (
                <AlertTriangle className="mr-1 size-3.5" />
              )}
              {item.supported ? supportedLabel : unsupportedLabel}
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              {suggestedLabel}: <span className="font-medium text-foreground">{item.to_font || item.from_font}</span>
            </p>
            {!item.supported && item.replacement_candidates.length === 0 ? (
              <p className="text-amber-600">{noCandidatesLabel}</p>
            ) : null}
          </div>
        </div>

        <div className="w-full lg:w-64">
          <p className="mb-2 text-xs font-medium text-muted-foreground">{replacementLabel}</p>
          <Select value={currentValue} onValueChange={onChange} disabled={!hasCandidates}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={`${item.from_font}-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
