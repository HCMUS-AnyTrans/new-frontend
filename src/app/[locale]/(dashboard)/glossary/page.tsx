"use client";

import { GlossaryContent } from "@/features/glossary";

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 mx-auto w-full max-w-5xl">
      <GlossaryContent />
    </div>
  );
}
