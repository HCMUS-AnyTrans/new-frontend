import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function GlossaryPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            Từ điển thuật ngữ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Quản lý từ điển thuật ngữ chuyên ngành. Đang được phát triển...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
