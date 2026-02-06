"use client"

import { useState } from "react"
import {
  ZoomIn,
  ZoomOut,
  Download,
  RefreshCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { TranslationJob, TranslationConfig, UploadedFile } from "../types"
import { languages } from "../data"

// =============== TYPES ===============

interface StepReviewProps {
  file: UploadedFile
  config: TranslationConfig
  job: TranslationJob
  originalText: string
  translatedText: string
  onDownload: () => void
  onReset: () => void
}

// =============== ZOOM CONTROLS ===============

const ZOOM_LEVELS = [75, 100, 125, 150, 175, 200] as const
type ZoomLevel = (typeof ZOOM_LEVELS)[number]

interface ZoomControlsProps {
  zoom: ZoomLevel
  onZoomIn: () => void
  onZoomOut: () => void
}

function ZoomControls({ zoom, onZoomIn, onZoomOut }: ZoomControlsProps) {
  const canZoomIn = zoom < ZOOM_LEVELS[ZOOM_LEVELS.length - 1]
  const canZoomOut = zoom > ZOOM_LEVELS[0]

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="size-7"
      >
        <ZoomOut className="size-4" />
      </Button>
      <span className="min-w-[3rem] text-center text-xs text-muted-foreground">{zoom}%</span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="size-7"
      >
        <ZoomIn className="size-4" />
      </Button>
    </div>
  )
}

// =============== DOCUMENT PANE ===============

interface DocumentPaneProps {
  title: string
  langCode: string
  content: string
  zoom: ZoomLevel
  onZoomIn: () => void
  onZoomOut: () => void
  isLoading?: boolean
  className?: string
}

function DocumentPane({
  title,
  langCode,
  content,
  zoom,
  onZoomIn,
  onZoomOut,
  isLoading,
  className,
}: DocumentPaneProps) {
  const lang = languages.find((l) => l.code === langCode)
  const langName = lang?.name || langCode.toUpperCase()

  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {langName}
          </Badge>
        </div>
        <ZoomControls zoom={zoom} onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center p-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div
            className="whitespace-pre-wrap p-4 leading-relaxed text-foreground transition-all"
            style={{ fontSize: `${zoom}%` }}
          >
            {content || (
              <span className="italic text-muted-foreground">Chưa có nội dung</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// =============== PROGRESS OVERLAY ===============

interface ProgressOverlayProps {
  job: TranslationJob
}

function ProgressOverlay({ job }: ProgressOverlayProps) {
  if (job.status === "idle" || job.status === "success") return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md border shadow-lg">
        <CardContent className="p-6">
          {job.status === "processing" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Đang dịch tài liệu...</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vui lòng chờ trong giây lát
                </p>
              </div>
              <div className="space-y-2">
                <Progress value={job.progress} className="h-2" />
                <p className="text-sm font-medium text-primary">{job.progress}%</p>
              </div>
            </div>
          )}

          {job.status === "failed" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="size-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Dịch thất bại</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.error || "Đã xảy ra lỗi không xác định"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// =============== BOTTOM BAR ===============

interface BottomBarProps {
  job: TranslationJob
  onDownload: () => void
  onReset: () => void
}

function BottomBar({ job, onDownload, onReset }: BottomBarProps) {
  const isSuccess = job.status === "success"

  return (
    <div className="sticky bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side info */}
        <div className="flex items-center gap-4 text-sm">
          {isSuccess && (
            <>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="size-4" />
                <span className="font-medium">Dịch thành công</span>
              </div>
              <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
                <Save className="size-4" />
                <span>Tự động lưu</span>
              </div>
            </>
          )}
          {job.status === "processing" && (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="size-4 animate-spin" />
              <span className="font-medium">Đang xử lý...</span>
            </div>
          )}
          {job.status === "failed" && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="size-4" />
              <span className="font-medium">Thất bại</span>
            </div>
          )}
        </div>

        {/* Right side - Cost + Actions */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Chi phí: </span>
            <span className="font-semibold text-foreground">{job.costCredits} Credits</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onReset}>
              <RefreshCcw className="size-4" />
              Dịch tài liệu mới
            </Button>
            <Button onClick={onDownload} disabled={!isSuccess}>
              <Download className="size-4" />
              Tải xuống
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============== MAIN COMPONENT ===============

export function StepReview({
  file,
  config,
  job,
  originalText,
  translatedText,
  onDownload,
  onReset,
}: StepReviewProps) {
  // Zoom states for each pane
  const [srcZoom, setSrcZoom] = useState<ZoomLevel>(100)
  const [tgtZoom, setTgtZoom] = useState<ZoomLevel>(100)

  const handleZoomIn = (current: ZoomLevel): ZoomLevel => {
    const idx = ZOOM_LEVELS.indexOf(current)
    return idx < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[idx + 1] : current
  }

  const handleZoomOut = (current: ZoomLevel): ZoomLevel => {
    const idx = ZOOM_LEVELS.indexOf(current)
    return idx > 0 ? ZOOM_LEVELS[idx - 1] : current
  }

  const srcLangCode = config.srcLang === "auto" ? "en" : config.srcLang
  const isProcessing = job.status === "processing"

  return (
    <div className="relative flex h-full flex-col">
      {/* Progress Overlay */}
      <ProgressOverlay job={job} />

      {/* Document Title */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Xem trước bản dịch</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tài liệu: {file.name}</p>
        </div>
      </div>

      {/* Desktop: Side-by-side */}
      <div className="hidden flex-1 gap-4 lg:flex">
        <DocumentPane
          title="Bản gốc"
          langCode={srcLangCode}
          content={originalText}
          zoom={srcZoom}
          onZoomIn={() => setSrcZoom(handleZoomIn(srcZoom))}
          onZoomOut={() => setSrcZoom(handleZoomOut(srcZoom))}
          className="flex-1"
        />
        <DocumentPane
          title="Bản dịch"
          langCode={config.tgtLang}
          content={translatedText}
          zoom={tgtZoom}
          onZoomIn={() => setTgtZoom(handleZoomIn(tgtZoom))}
          onZoomOut={() => setTgtZoom(handleZoomOut(tgtZoom))}
          isLoading={isProcessing}
          className="flex-1"
        />
      </div>

      {/* Mobile: Tabs */}
      <div className="flex-1 lg:hidden">
        <Tabs defaultValue="original" className="flex h-full flex-col">
          <TabsList variant="line" className="mb-4 w-full">
            <TabsTrigger value="original" className="flex-1">
              Bản gốc
            </TabsTrigger>
            <TabsTrigger value="translated" className="flex-1">
              Bản dịch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="original" className="mt-0 flex-1">
            <DocumentPane
              title="Bản gốc"
              langCode={srcLangCode}
              content={originalText}
              zoom={srcZoom}
              onZoomIn={() => setSrcZoom(handleZoomIn(srcZoom))}
              onZoomOut={() => setSrcZoom(handleZoomOut(srcZoom))}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="translated" className="mt-0 flex-1">
            <DocumentPane
              title="Bản dịch"
              langCode={config.tgtLang}
              content={translatedText}
              zoom={tgtZoom}
              onZoomIn={() => setTgtZoom(handleZoomIn(tgtZoom))}
              onZoomOut={() => setTgtZoom(handleZoomOut(tgtZoom))}
              isLoading={isProcessing}
              className="h-full"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Bar */}
      <BottomBar job={job} onDownload={onDownload} onReset={onReset} />
    </div>
  )
}
