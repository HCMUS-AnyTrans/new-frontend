import { DocumentTranslationWizard } from "@/features/documents"

export default function DocumentsPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col p-4 lg:p-6">
      <DocumentTranslationWizard />
    </div>
  )
}
