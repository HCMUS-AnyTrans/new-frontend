"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth";

export function DashboardGreeting() {
  const t = useTranslations("dashboard.welcome");
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {t("greeting", { name: user?.fullName || "" })}
      </h2>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
    </div>
  );
}
