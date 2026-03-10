"use client";

import { useTranslations } from "next-intl";
import { CommandGroup, CommandItem, CommandSeparator } from "cmdk";
import { ArrowRight, Clock, BookOpen, Loader2 } from "lucide-react";
import type { NavItem } from "./use-search-data";
import type { TranslationJobResponse } from "../../api/dashboard.api";
import type { Glossary } from "@/features/glossary/types";

const ITEM_CLASS =
  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/80 aria-selected:bg-muted/80";

const ICON_WRAP_CLASS =
  "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted";

function GroupHeading({
  label,
  isLoading,
}: {
  label: string;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 px-1 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
      {isLoading && <Loader2 className="size-3 animate-spin" />}
    </div>
  );
}

// ── Feature navigation group ──────────────────────────────────────────────────

interface NavGroupProps {
  items: NavItem[];
  onSelect: (href: string) => void;
}

export function SearchNavGroup({ items, onSelect }: NavGroupProps) {
  const t = useTranslations("dashboard.commandPalette");
  const tSidebar = useTranslations("dashboard.sidebar");

  if (items.length === 0) return null;

  return (
    <CommandGroup
      heading={<GroupHeading label={t("features")} />}
    >
      {items.map((item) => (
        <CommandItem
          key={item.href}
          value={`nav-${item.href}`}
          onSelect={() => onSelect(item.href)}
          className={ITEM_CLASS}
        >
          <div className={ICON_WRAP_CLASS}>
            <item.icon className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">
              {tSidebar(item.titleKey)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t(item.descriptionKey)}
            </p>
          </div>
          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-40" />
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

// ── Translation jobs group ────────────────────────────────────────────────────

interface JobsGroupProps {
  jobs: TranslationJobResponse[];
  isLoading: boolean;
  onSelect: (href: string) => void;
  showSeparator: boolean;
}

export function SearchJobsGroup({
  jobs,
  isLoading,
  onSelect,
  showSeparator,
}: JobsGroupProps) {
  const t = useTranslations("dashboard.commandPalette");

  return (
    <>
      {showSeparator && <CommandSeparator className="my-1.5 h-px bg-border" />}
      <CommandGroup heading={<GroupHeading label={t("jobs")} isLoading={isLoading} />}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <CommandItem
              key={job.job_id}
              value={`job-${job.job_id}`}
              onSelect={() =>
                onSelect(
                  `/history?search=${encodeURIComponent(job.input_file?.name ?? "")}`,
                )
              }
              className={ITEM_CLASS}
            >
              <div className={ICON_WRAP_CLASS}>
                <Clock className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {job.input_file?.name ?? t("unknownFile")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {job.src_lang} → {job.tgt_lang}
                  {" · "}
                  <span
                    className={
                      job.status === "succeeded"
                        ? "text-green-600 dark:text-green-400"
                        : job.status === "failed"
                          ? "text-destructive"
                          : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {job.status}
                  </span>
                </p>
              </div>
            </CommandItem>
          ))
        ) : (
          !isLoading && (
            <p className="px-3 py-3 text-center text-xs text-muted-foreground">
              {t("noJobResults")}
            </p>
          )
        )}
      </CommandGroup>
    </>
  );
}

// ── Glossaries group ──────────────────────────────────────────────────────────

interface GlossariesGroupProps {
  glossaries: Glossary[];
  isLoading: boolean;
  onSelect: (href: string) => void;
}

export function SearchGlossariesGroup({
  glossaries,
  isLoading,
  onSelect,
}: GlossariesGroupProps) {
  const t = useTranslations("dashboard.commandPalette");

  return (
    <>
      <CommandSeparator className="my-1.5 h-px bg-border" />
      <CommandGroup heading={<GroupHeading label={t("glossaries")} isLoading={isLoading} />}>
        {glossaries.length > 0 ? (
          glossaries.map((glossary) => (
            <CommandItem
              key={glossary.id}
              value={`glossary-${glossary.id}`}
              onSelect={() => onSelect(`/glossary/${glossary.id}`)}
              className={ITEM_CLASS}
            >
              <div className={ICON_WRAP_CLASS}>
                <BookOpen className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {glossary.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {glossary.srcLang} → {glossary.tgtLang}
                  {glossary.domain ? ` · ${glossary.domain}` : ""}
                </p>
              </div>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-40" />
            </CommandItem>
          ))
        ) : (
          !isLoading && (
            <p className="px-3 py-3 text-center text-xs text-muted-foreground">
              {t("noGlossaryResults")}
            </p>
          )
        )}
      </CommandGroup>
    </>
  );
}
