"use client";

import { Suspense } from "react";
import {
  SettingsLayout,
  SettingsTabContent,
  ProfileTab,
  PreferencesTab,
  SecurityTab,
  NotificationsTab,
  BillingTab,
  FilesTab,
  ActivityTab,
} from "@/features/settings";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsContent() {
  return (
    <SettingsLayout>
      <SettingsTabContent value="profile">
        <ProfileTab />
      </SettingsTabContent>

      <SettingsTabContent value="preferences">
        <PreferencesTab />
      </SettingsTabContent>

      <SettingsTabContent value="security">
        <SecurityTab />
      </SettingsTabContent>

      <SettingsTabContent value="notifications">
        <NotificationsTab />
      </SettingsTabContent>

      <SettingsTabContent value="billing">
        <BillingTab />
      </SettingsTabContent>

      <SettingsTabContent value="files">
        <FilesTab />
      </SettingsTabContent>

      <SettingsTabContent value="activity">
        <ActivityTab />
      </SettingsTabContent>
    </SettingsLayout>
  );
}

function SettingsFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <Suspense fallback={<SettingsFallback />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
