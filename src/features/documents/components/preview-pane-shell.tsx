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
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden border-border/60 bg-background shadow-sm">
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="relative h-full min-h-[320px]">
          <div className={isLoading || error ? 'invisible h-full' : 'h-full'}>{children}</div>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-muted/10 px-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {loadingLabel}
            </div>
          ) : error ? (
            <div className="absolute inset-0 p-4">
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{errorLabel}</AlertDescription>
              </Alert>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
