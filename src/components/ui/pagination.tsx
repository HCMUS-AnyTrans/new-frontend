"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface PaginationProps {
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  isFetching?: boolean
}

export function Pagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  isFetching,
}: PaginationProps) {
  const tCommon = useTranslations("common")

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        {tCommon("pageOf", { page, totalPages })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev || isFetching}
        >
          <ChevronLeft className="size-4" />
          {tCommon("previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || isFetching}
        >
          {tCommon("next")}
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
