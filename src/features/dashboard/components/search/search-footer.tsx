"use client";

import { useTranslations } from "next-intl";

function KbdHint({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
      {children}
      {label}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">
      {children}
    </kbd>
  );
}

export function SearchFooter() {
  const t = useTranslations("dashboard.commandPalette");

  return (
    <div className="flex items-center justify-end gap-4 border-t border-border px-4 py-2">
      <KbdHint label={t("navigate")}>
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
      </KbdHint>
      <KbdHint label={t("select")}>
        <Kbd>↵</Kbd>
      </KbdHint>
      <KbdHint label={t("close")}>
        <Kbd>ESC</Kbd>
      </KbdHint>
    </div>
  );
}
