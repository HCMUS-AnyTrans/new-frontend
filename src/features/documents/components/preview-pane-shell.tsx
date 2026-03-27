'use client';

import type { ReactNode } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

interface PreviewPaneShellProps {
  isLoading: boolean;
  loadingLabel: string;
  error: string | null;
  errorLabel: string;
  children: ReactNode;
}

export function PreviewPaneShell({
  isLoading,
  loadingLabel,
  error,
  errorLabel,
  children,
}: PreviewPaneShellProps) {
  const errorMessage = error || errorLabel;

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden border-border/60 bg-background py-0 shadow-sm">
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="relative flex h-full min-h-[280px] flex-col" aria-busy={isLoading}>
          <div className={isLoading || error ? 'invisible h-full' : 'h-full'}>{children}</div>

          {isLoading ? (
            <div
              className="absolute inset-0 flex items-center justify-center gap-3 bg-background/80 px-6 text-sm text-muted-foreground backdrop-blur-[1px]"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="size-4 animate-spin" />
              {loadingLabel}
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center p-4" role="alert" aria-live="assertive">
              <Alert variant="destructive" className="shadow-none">
                <AlertCircle className="size-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
