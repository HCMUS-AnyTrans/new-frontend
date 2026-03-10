"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
} from "@/components/ui/app-card";
import { cn } from "@/lib/utils";

const dashboardCardVariants = cva(
  "rounded-md",
  {
    variants: {
      height: {
        default: "",
        fixed: "h-[220px]",
      },
    },
    defaultVariants: {
      height: "default",
    },
  }
);

const dashboardCardContentVariants = cva("", {
  variants: {
    padding: {
      default: "px-6 pb-6 pt-0",
      all: "p-6",
      none: "p-0",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

type DashboardCardProps = React.ComponentProps<typeof AppCard> &
  VariantProps<typeof dashboardCardVariants>;

type DashboardCardContentProps = React.ComponentProps<typeof AppCardContent> &
  VariantProps<typeof dashboardCardContentVariants>;

export function DashboardCard({
  className,
  interactive,
  height,
  ...props
}: DashboardCardProps) {
  return (
    <AppCard
      interactive={interactive}
      className={cn(dashboardCardVariants({ height }), className)}
      {...props}
    />
  );
}

export function DashboardCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof AppCardHeader>) {
  return <AppCardHeader className={className} {...props} />;
}

export function DashboardCardContent({
  className,
  padding,
  ...props
}: DashboardCardContentProps) {
  return (
    <AppCardContent
      className={cn(dashboardCardContentVariants({ padding }), className)}
      {...props}
    />
  );
}
