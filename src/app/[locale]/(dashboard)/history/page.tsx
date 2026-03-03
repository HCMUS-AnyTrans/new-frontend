"use client";

import { HistoryContent } from "@/features/history";

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 mx-auto w-full max-w-5xl">
      <HistoryContent />
    </div>
  );
}
