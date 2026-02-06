import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Lịch sử
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Xem lịch sử tất cả jobs đã thực hiện. Đang được phát triển...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
