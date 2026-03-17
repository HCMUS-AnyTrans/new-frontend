'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/settings/hooks/use-notifications';
import type { Notification, NotificationType } from '@/features/settings/types';
import { getNotifText } from '@/features/settings/types';
import { cn } from '@/lib/utils';

// ─── icon map ────────────────────────────────────────────────────────────────
const TYPE_EMOJI: Record<NotificationType, string> = {
  translation_status: '📄',
  credit_purchase: '💳',
  file_expiring: '⚠️',
  security_alert: '🔒',
  promotion: '🎁',
  system: 'ℹ️',
};

function getRelativeTime(createdAt: string, locale: string): string {
  const diff = new Date().valueOf() - new Date(createdAt).valueOf();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return locale === 'vi' ? 'Vừa xong' : 'Just now';
  if (mins < 60) return locale === 'vi' ? `${mins} phút trước` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return locale === 'vi' ? `${hrs} giờ trước` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return locale === 'vi' ? `${days} ngày trước` : `${days}d ago`;
}

// ─── single notification row ─────────────────────────────────────────────────
function NotificationRow({
  notif,
  onMarkRead,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
}) {
  const locale = useLocale();

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors',
        notif.isRead ? 'opacity-70 hover:opacity-100' : 'bg-primary/5 hover:bg-primary/10',
      )}
    >
      <span className="mt-0.5 shrink-0 text-base leading-none">
        {TYPE_EMOJI[notif.type as NotificationType] ?? 'ℹ️'}
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm', !notif.isRead && 'font-medium')}>
          {getNotifText(notif.title, locale)}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {getNotifText(notif.message, locale)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">
          {getRelativeTime(notif.createdAt, locale)}
        </p>
      </div>

      {!notif.isRead && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notif.id);
          }}
          className="shrink-0 rounded p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
          title="Mark as read"
        >
          <Check className="size-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── skeleton ────────────────────────────────────────────────────────────────
function NotificationSkeleton() {
  return (
    <div className="space-y-1 px-3 py-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 py-2">
          <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-52" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('dashboard.notifications');

  const { notifications, unreadCount, isLoading } = useNotifications({
    limit: 8,
  });
  const { markRead } = useMarkNotificationRead();
  const { markAllRead, isMarking } = useMarkAllNotificationsRead();

  const handleViewAll = () => {
    setOpen(false);
    router.push('/settings?tab=notifications');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-full"
          aria-label={t('title')}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px] leading-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{t('title')}</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 rounded-full px-1.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
              onClick={() => markAllRead()}
              disabled={isMarking}
            >
              <CheckCheck className="size-3.5" />
              {t('markAllRead')}
            </Button>
          )}
        </div>

        <Separator />

        {/* Body */}
        <div className="max-h-90 overflow-y-auto py-1">
          {isLoading ? (
            <NotificationSkeleton />
          ) : !notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <Bell className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{t('empty')}</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {notifications.map((notif) => (
                <NotificationRow
                  key={notif.id}
                  notif={notif}
                  onMarkRead={(id) => markRead(id)}
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Footer */}
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1.5 text-xs text-muted-foreground"
            onClick={handleViewAll}
          >
            <ExternalLink className="size-3.5" />
            {t('viewAll')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
