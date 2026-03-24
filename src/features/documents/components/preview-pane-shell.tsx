'use client';

import type { ReactNode } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewPaneShellProps {
  title: string;
  fileName: string;
  icon?: ReactNode;
  isLoading: boolean;
  loadingLabel: string;
  error: string | null;
  errorLabel: string;
  children: ReactNode;
}

export function PreviewPaneShell({
  title,
  fileName,
  icon,
  isLoading,
  loadingLabel,
  error,
  errorLabel,
  children,
}: PreviewPaneShellProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden border-border/70 bg-background/80 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            <p className="mt-1 truncate text-sm text-muted-foreground">{fileName}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        {isLoading ? (
          <div className="flex h-full min-h-[320px] items-center justify-center gap-3 bg-muted/10 px-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {loadingLabel}
          </div>
        ) : null}

        {error ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{errorLabel}</AlertDescription>
            </Alert>
          </div>
        ) : null}

        {children}
      </CardContent>
    </Card>
  );
}
