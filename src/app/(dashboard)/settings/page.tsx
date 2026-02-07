"use client"

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
} from "@/features/settings"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
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
    </div>
  )
}
