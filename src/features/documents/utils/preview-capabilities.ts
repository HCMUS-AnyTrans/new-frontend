import type { FileResponse } from '../types';

type PreviewFileShape = Pick<FileResponse, 'id' | 'is_expired'>;

export function canPreviewTranslationJob(files: {
  inputFile?: PreviewFileShape | null;
  outputFile?: PreviewFileShape | null;
}) {
  return Boolean(
    files.inputFile?.id &&
      files.outputFile?.id &&
      !files.inputFile.is_expired &&
      !files.outputFile.is_expired,
  );
}
