"use client"

import { ConfigureActions } from "./configure-actions"

interface ConfigureMobileActionBarProps {
  onBack: () => void
  onStart: () => void
  isLoading?: boolean
  isStartDisabled: boolean
  isInsufficientCredits: boolean
}

export function ConfigureMobileActionBar({
  onBack,
  onStart,
  isLoading,
  isStartDisabled,
  isInsufficientCredits,
}: ConfigureMobileActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm xl:hidden">
      <ConfigureActions
        onBack={onBack}
        onStart={onStart}
        isLoading={isLoading}
        isStartDisabled={isStartDisabled}
        isInsufficientCredits={isInsufficientCredits}
        containerClassName="mx-auto flex max-w-6xl items-center gap-3"
        backButtonClassName="flex-1 sm:flex-none sm:w-28"
        startButtonClassName="flex-1"
        hintClassName="mx-auto mt-1 max-w-6xl text-center"
      />
    </div>
  )
}
