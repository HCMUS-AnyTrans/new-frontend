import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Dịch tài liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Trang upload và quản lý dịch tài liệu. Đang được phát triển...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
