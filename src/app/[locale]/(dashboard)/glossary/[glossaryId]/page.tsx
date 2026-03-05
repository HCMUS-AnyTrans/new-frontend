"use client";

import { use } from "react";
import { GlossaryDetail } from "@/features/glossary/components/glossary-detail";

interface GlossaryDetailPageProps {
  params: Promise<{ glossaryId: string }>;
}

export default function GlossaryDetailPage({
  params,
}: GlossaryDetailPageProps) {
  const { glossaryId } = use(params);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <GlossaryDetail glossaryId={glossaryId} />
    </div>
  );
}
