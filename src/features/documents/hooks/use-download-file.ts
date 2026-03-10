"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { getFileDownloadUrl } from "../api/documents.api"
import { extractErrorMessage } from "./utils"

interface UseDownloadFileReturn {
  download: (fileId: string, fileName?: string) => Promise<void>
  isDownloading: boolean
  error: string | null
}

export function useDownloadFile(): UseDownloadFileReturn {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const download = useCallback(async (fileId: string, fileName?: string) => {
    setIsDownloading(true)
    setError(null)

    try {
      const { download_url } = await getFileDownloadUrl(fileId)

      const anchor = document.createElement("a")
      anchor.href = download_url
      anchor.download = fileName || ""
      anchor.target = "_blank"
      anchor.rel = "noopener noreferrer"
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    } catch (err: unknown) {
      if (!mountedRef.current) return
      setError(extractErrorMessage(err, "Download failed"))
    } finally {
      if (mountedRef.current) {
        setIsDownloading(false)
      }
    }
  }, [])

  return { download, isDownloading, error }
}
