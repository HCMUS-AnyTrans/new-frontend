import { use } from "react"
import { setRequestLocale } from "next-intl/server"
import { DocumentPreviewScreen } from "@/features/documents/components/document-preview-screen"

type Props = {
  params: Promise<{ locale: string }>
}

export default function DocumentPreviewPage({ params }: Props) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <DocumentPreviewScreen />
}
