import Image from 'next/image';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTypeIconProps {
  fileName: string;
  className?: string;
}

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export function FileTypeIcon({ fileName, className }: FileTypeIconProps) {
  const extension = getFileExtension(fileName);

  if (extension === 'pdf') {
    return (
      <span className={cn('relative inline-block shrink-0', className)}>
        <Image
          src="/pdf-svg.svg"
          alt="PDF file"
          fill
          unoptimized
          className="object-contain"
          sizes="64px"
        />
      </span>
    );
  }

  if (extension === 'docx' || extension === 'doc') {
    return (
      <span className={cn('relative inline-block shrink-0', className)}>
        <Image
          src="/doc-svg.svg"
          alt="DOC file"
          fill
          unoptimized
          className="object-contain"
          sizes="64px"
        />
      </span>
    );
  }

  if (extension === 'pptx' || extension === 'ppt') {
    return (
      <span className={cn('relative inline-block shrink-0', className)}>
        <Image
          src="/pptx-svg.svg"
          alt="PPT file"
          fill
          unoptimized
          className="object-contain"
          sizes="64px"
        />
      </span>
    );
  }

  return <File className={cn(className, 'shrink-0 text-primary')} />;
}
