"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileUp, Subtitles, Coins } from "lucide-react";

export function QuickActions() {
  const t = useTranslations("dashboard.quickActions");

  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
        <Link href="/documents">
          <FileUp className="size-4" />
          {t("uploadDocument")}
        </Link>
      </Button>
      <Button asChild className="gap-2 bg-accent hover:bg-accent/90">
        <Link href="/subtitles">
          <Subtitles className="size-4" />
          {t("uploadSubtitle")}
        </Link>
      </Button>
      <Button
        variant="outline"
        className="gap-2 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary cursor-pointer"
      >
        <Coins className="size-4" />
        {t("buyCredits")}
      </Button>
    </div>
  );
}
