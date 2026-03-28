'use client';

import { ArrowLeft, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentPreviewStateProps {
  title: string;
  description: string;
  backLabel: string;
  onBack: () => void;
}

export function DocumentPreviewState({
  title,
  description,
  backLabel,
  onBack,
}: DocumentPreviewStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-var(--dashboard-header-height)-4rem)] items-center justify-center">
      <Alert className="max-w-xl border-border/70 bg-background/90 shadow-sm">
        <FileWarning className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>{description}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
