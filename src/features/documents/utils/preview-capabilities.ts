import type { FileResponse } from '../types';

const DOCX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const PDF_MIME_TYPE = 'application/pdf';

type PreviewFileShape = Pick<FileResponse, 'name' | 'mime'>;

export type PreviewFileKind = 'pdf' | 'docx';

export type PreviewConfig = {
  original: PreviewFileKind;
  translated: 'docx';
};

function getNormalizedFileName(file?: PreviewFileShape | null) {
  return file?.name.toLowerCase() ?? '';
}

export function isDocxFile(file?: PreviewFileShape | null) {
  const fileName = getNormalizedFileName(file);
  return file?.mime === DOCX_MIME_TYPE || fileName.endsWith('.docx');
}

export function isPdfFile(file?: PreviewFileShape | null) {
  const fileName = getNormalizedFileName(file);
  return file?.mime === PDF_MIME_TYPE || fileName.endsWith('.pdf');
}

export function getPreviewConfig(files: {
  inputFile?: PreviewFileShape | null;
  outputFile?: PreviewFileShape | null;
}): PreviewConfig | null {
  if (!isDocxFile(files.outputFile)) {
    return null;
  }

  if (isPdfFile(files.inputFile)) {
    return {
      original: 'pdf',
      translated: 'docx',
    };
  }

  if (isDocxFile(files.inputFile)) {
    return {
      original: 'docx',
      translated: 'docx',
    };
  }

  return null;
}

export function canPreviewTranslationJob(files: {
  inputFile?: PreviewFileShape | null;
  outputFile?: PreviewFileShape | null;
}) {
  return getPreviewConfig(files) !== null;
}
