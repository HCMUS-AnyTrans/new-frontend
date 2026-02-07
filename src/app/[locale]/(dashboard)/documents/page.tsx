import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { DocumentTranslationWizard } from "@/features/documents";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function DocumentsPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col p-4 lg:p-6">
      <DocumentTranslationWizard />
    </div>
  );
}
