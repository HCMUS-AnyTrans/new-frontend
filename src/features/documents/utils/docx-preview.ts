import type { FileResponse } from "../types"

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export function isDocxFile(file?: Pick<FileResponse, "name" | "mime"> | null) {
  if (!file) return false

  const fileName = file.name.toLowerCase()
  return file.mime === DOCX_MIME_TYPE || fileName.endsWith(".docx")
}

export function canPreviewTranslationJob(files: {
  inputFile?: Pick<FileResponse, "name" | "mime"> | null
  outputFile?: Pick<FileResponse, "name" | "mime"> | null
}) {
  return isDocxFile(files.inputFile) && isDocxFile(files.outputFile)
}
