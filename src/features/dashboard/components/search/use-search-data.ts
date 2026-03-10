"use client";

import { useState, useEffect, useDeferredValue } from "react";
import { useTranslations } from "next-intl";
import { getRecentJobsApi } from "../../api/dashboard.api";
import { listGlossariesApi } from "@/features/glossary/api/glossary.api";
import type { TranslationJobResponse } from "../../api/dashboard.api";
import type { Glossary } from "@/features/glossary/types";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  History,
  Settings,
  HelpCircle,
} from "lucide-react";

export interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ElementType;
  descriptionKey: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard, descriptionKey: "dashboardDesc" },
  { titleKey: "documents", href: "/documents", icon: FileText, descriptionKey: "documentsDesc" },
  { titleKey: "glossary", href: "/glossary", icon: BookOpen, descriptionKey: "glossaryDesc" },
  { titleKey: "history", href: "/history", icon: History, descriptionKey: "historyDesc" },
  { titleKey: "settings", href: "/settings", icon: Settings, descriptionKey: "settingsDesc" },
  { titleKey: "help", href: "/help", icon: HelpCircle, descriptionKey: "helpDesc" },
];

export interface SearchData {
  filteredNavItems: NavItem[];
  jobs: TranslationJobResponse[];
  glossaries: Glossary[];
  isLoadingJobs: boolean;
  isLoadingGlossaries: boolean;
  showDynamicResults: boolean;
  hasNoResults: boolean;
}

export function useSearchData(query: string): SearchData {
  const tSidebar = useTranslations("dashboard.sidebar");

  const deferredQuery = useDeferredValue(query);

  const [jobs, setJobs] = useState<TranslationJobResponse[]>([]);
  const [glossaries, setGlossaries] = useState<Glossary[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingGlossaries, setIsLoadingGlossaries] = useState(false);

  useEffect(() => {
    if (deferredQuery.length < 2) {
      setJobs([]);
      setGlossaries([]);
      return;
    }

    let cancelled = false;

    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const res = await getRecentJobsApi({ search: deferredQuery, limit: 5 });
        if (!cancelled) setJobs(res.data);
      } catch {
        if (!cancelled) setJobs([]);
      } finally {
        if (!cancelled) setIsLoadingJobs(false);
      }
    };

    const fetchGlossaries = async () => {
      setIsLoadingGlossaries(true);
      try {
        const res = await listGlossariesApi({ search: deferredQuery, limit: 5 });
        if (!cancelled) setGlossaries(res.items);
      } catch {
        if (!cancelled) setGlossaries([]);
      } finally {
        if (!cancelled) setIsLoadingGlossaries(false);
      }
    };

    fetchJobs();
    fetchGlossaries();

    return () => { cancelled = true; };
  }, [deferredQuery]);

  const filteredNavItems = deferredQuery
    ? ALL_NAV_ITEMS.filter((item) =>
        tSidebar(item.titleKey).toLowerCase().includes(deferredQuery.toLowerCase()),
      )
    : ALL_NAV_ITEMS;

  const showDynamicResults = deferredQuery.length >= 2;
  const isLoading = isLoadingJobs || isLoadingGlossaries;
  const hasNoResults =
    showDynamicResults &&
    !isLoading &&
    filteredNavItems.length === 0 &&
    jobs.length === 0 &&
    glossaries.length === 0;

  return {
    filteredNavItems,
    jobs,
    glossaries,
    isLoadingJobs,
    isLoadingGlossaries,
    showDynamicResults,
    hasNoResults,
  };
}
