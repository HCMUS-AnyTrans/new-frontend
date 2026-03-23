"use client"

import { AppCard, AppCardContent } from "@/components/ui/app-card"
import { ConfigureActions } from "./configure-actions"

interface ConfigureActionsPanelProps {
  onBack: () => void
  onStart: () => void
  isLoading?: boolean
  isStartDisabled: boolean
  isInsufficientCredits: boolean
}

export function ConfigureActionsPanel({
  onBack,
  onStart,
  isLoading,
  isStartDisabled,
  isInsufficientCredits,
}: ConfigureActionsPanelProps) {
  return (
    <AppCard>
      <AppCardContent padding="all" className="space-y-3 p-4">
        <ConfigureActions
          onBack={onBack}
          onStart={onStart}
          isLoading={isLoading}
          isStartDisabled={isStartDisabled}
          isInsufficientCredits={isInsufficientCredits}
          containerClassName="space-y-3"
          backButtonClassName="w-full"
          startButtonClassName="w-full"
        />
      </AppCardContent>
    </AppCard>
  )
}
