import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CreditPackageCardLayout = "compact" | "marketing";
type CreditPackageCardBadgeTone = "warning" | "secondary" | "primary";
type CreditPackageCardBadgePlacement = "top-right" | "top-center";

export interface CreditPackageCardBadge {
  label: string;
  icon?: React.ReactNode;
  tone?: CreditPackageCardBadgeTone;
  placement?: CreditPackageCardBadgePlacement;
}

export interface CreditPackageCardProps {
  title: string;
  creditsText: string;
  creditsLabel: string;
  priceText: string;
  perCreditText: string;
  originalPriceText?: string;
  bonusText?: string;
  topBadge?: CreditPackageCardBadge;
  metaBadges?: React.ReactNode;
  details?: React.ReactNode;
  action?: React.ReactNode;
  selected?: boolean;
  highlighted?: boolean;
  layout?: CreditPackageCardLayout;
  onClick?: () => void;
  className?: string;
}

const badgeToneClassNames: Record<CreditPackageCardBadgeTone, string> = {
  warning: "bg-warning text-warning-foreground",
  secondary: "",
  primary: "bg-primary text-primary-foreground",
};

export function CreditPackageCard({
  title,
  creditsText,
  creditsLabel,
  priceText,
  perCreditText,
  originalPriceText,
  bonusText,
  topBadge,
  metaBadges,
  details,
  action,
  selected = false,
  highlighted = false,
  layout = "compact",
  onClick,
  className,
}: CreditPackageCardProps) {
  const isInteractive = typeof onClick === "function";

  const cardContent = (
    <>
      {topBadge ? (
        <Badge
          variant={topBadge.tone === "secondary" ? "secondary" : undefined}
          className={cn(
            "absolute z-10 gap-1",
            topBadge.placement === "top-center"
              ? "-top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-sm font-semibold shadow-lg"
              : "-top-2 right-3",
            topBadge.tone !== "secondary" && badgeToneClassNames[topBadge.tone ?? "primary"],
          )}
        >
          {topBadge.icon}
          {topBadge.label}
        </Badge>
      ) : null}

      <div className={cn(layout === "marketing" ? "mb-6" : undefined)}>
        <p
          className={cn(
            "text-sm text-muted-foreground",
            layout === "marketing" && "text-xl font-bold text-foreground",
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-foreground",
            layout === "marketing"
              ? "mt-2 text-2xl font-extrabold text-primary"
              : "mt-1 text-xl font-bold",
          )}
        >
          {creditsText}{" "}
          <span
            className={cn(
              layout === "marketing"
                ? "text-base font-medium text-muted-foreground"
                : "text-inherit",
            )}
          >
            {creditsLabel}
          </span>
        </p>
        {bonusText ? (
          <p className="mt-1 text-xs font-medium text-primary">{bonusText}</p>
        ) : null}
      </div>

      <div className={cn(layout === "marketing" ? "mb-6" : "mt-2 space-y-1")}>
        {originalPriceText ? (
          <div className={cn(layout === "marketing" ? "space-y-1.5" : "space-y-1")}>
            <p
              className={cn(
                "text-muted-foreground line-through decoration-2",
                layout === "marketing" ? "text-lg font-semibold" : "text-sm",
              )}
            >
              {originalPriceText}
            </p>
            <p
              className={cn(
                "font-semibold text-foreground",
                layout === "marketing" ? "text-4xl font-extrabold" : "text-base",
              )}
            >
              {priceText}
            </p>
          </div>
        ) : (
          <p
            className={cn(
              "font-semibold text-foreground",
              layout === "marketing" ? "text-4xl font-extrabold" : "text-base",
            )}
          >
            {priceText}
          </p>
        )}

        <p className={cn("text-primary", layout === "marketing" ? "mt-2 text-sm font-medium" : "text-xs")}>
          {perCreditText}
        </p>

        {metaBadges ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">{metaBadges}</div>
        ) : null}
      </div>

      {details ? (
        <div className={cn(layout === "marketing" ? "mb-8" : "mt-4")}>{details}</div>
      ) : null}

      {action ? <div className={cn(layout === "marketing" ? "mt-auto" : "mt-4")}>{action}</div> : null}
    </>
  );

  const cardClassName = cn(
        "relative",
    layout === "marketing"
      ? cn(
          "flex h-full flex-col rounded-2xl border bg-card p-8 transition-colors duration-300",
          highlighted
            ? "border-primary pt-12 shadow-xl shadow-primary/10"
            : "border-border shadow-lg hover:shadow-xl",
        )
      : cn(
          "flex flex-col rounded-xl border-2 p-4 text-left transition-all",
          selected
            ? "border-primary bg-primary/5"
            : "border-border bg-card",
          isInteractive && "hover:border-primary/40",
        ),
    isInteractive && "cursor-pointer",
    className,
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cardClassName}
        aria-pressed={selected}
      >
        {cardContent}
      </button>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}
