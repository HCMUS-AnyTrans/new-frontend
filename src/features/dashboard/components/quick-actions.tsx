'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { FileUp, Coins } from 'lucide-react';
import { BuyCreditsDialog } from './buy-credits-dialog';
import { trackEvent } from '@/lib/analytics';

export function QuickActions() {
  const t = useTranslations('dashboard.quickActions');

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      <Button
        asChild
        className="w-full gap-2 bg-primary hover:bg-primary/90 sm:w-auto"
      >
        <Link href="/documents">
          <FileUp className="size-4" />
          {t('uploadDocument')}
        </Link>
      </Button>
      <BuyCreditsDialog>
        <Button
          variant="outline"
          className="w-full gap-2 bg-secondary-500 text-white hover:bg-secondary-400 hover:text-white cursor-pointer sm:w-auto"
          onClick={() => {
            trackEvent('buy_credit_click', {
              source: 'dashboard_quick_actions',
            });
          }}
        >
          <Coins className="size-4" />
          {t('buyCredits')}
        </Button>
      </BuyCreditsDialog>
    </div>
  );
}
