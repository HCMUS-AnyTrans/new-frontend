"use client";

import { HistoryContent } from "@/features/history";

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <HistoryContent />
    </div>
  );
}
