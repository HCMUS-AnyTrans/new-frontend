"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileUp, Subtitles, Coins } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
        <Link href="/documents">
          <FileUp className="size-4" />
          Upload tài liệu
        </Link>
      </Button>
      <Button asChild className="gap-2 bg-accent hover:bg-accent/90">
        <Link href="/subtitles">
          <Subtitles className="size-4" />
          Upload phụ đề
        </Link>
      </Button>
      <Button
        variant="outline"
        className="gap-2 border-secondary text-secondary hover:bg-secondary/10"
      >
        <Coins className="size-4" />
        Mua thêm credits
      </Button>
    </div>
  )
}
