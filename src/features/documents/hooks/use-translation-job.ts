"use client"

import { useQuery } from "@tanstack/react-query"
import { translationKeys } from "@/lib/query-client"
import { getTranslationJob } from "../api/documents.api"
import type { TranslationJobResponse } from "../types"

interface UseTranslationJobOptions {
  pollInterval?: number | false
  enabled?: boolean
}

export function useTranslationJob(
  jobId: string | null,
  options: UseTranslationJobOptions = {},
) {
  const { pollInterval = 3000, enabled = true } = options

  return useQuery<TranslationJobResponse>({
    queryKey: translationKeys.detail(jobId ?? ""),
    queryFn: () => getTranslationJob(jobId!),
    enabled: enabled && jobId !== null,
    refetchInterval: (query) => {
      if (pollInterval === false) {
        return false
      }

      const data = query.state.data
      if (data?.status === "succeeded" || data?.status === "failed") {
        return false
      }

      return pollInterval
    },
    staleTime: 0,
  })
}
