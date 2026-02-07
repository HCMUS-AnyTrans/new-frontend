"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CreditCard,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { mockActivities } from "../data";
import type { ActivityType } from "@/features/dashboard/types";

const activityIcons: Record<
  ActivityType,
  {
    icon: typeof CheckCircle;
    iconColor: string;
    iconBg: string;
  }
> = {
  job_complete: {
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  job_failed: {
    icon: XCircle,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
  },
  payment: {
    icon: CreditCard,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
};

export function ActivityFeed() {
  const t = useTranslations("dashboard.activity");

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          {t("title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/notifications">
            {t("viewAll")}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {mockActivities.map((activity) => {
            const config = activityIcons[activity.type];
            const Icon = config.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
                >
                  <Icon className={`size-4 ${config.iconColor}`} />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {activity.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {activity.createdAt}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
