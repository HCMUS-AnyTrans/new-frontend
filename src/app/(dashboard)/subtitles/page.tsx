import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subtitles } from "lucide-react"

export default function SubtitlesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Subtitles className="size-5 text-accent" />
            Dịch phụ đề
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Trang upload và quản lý dịch phụ đề. Đang được phát triển...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
