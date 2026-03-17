import { use } from "react";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function HelpPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <p className="text-muted-foreground">
        Tài liệu hướng dẫn và FAQ. Đang được phát triển...
      </p>
    </div>
  );
}
