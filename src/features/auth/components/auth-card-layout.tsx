'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AuthHero } from './auth-hero';
import { cn } from '@/lib/utils';

export interface AuthCardLayoutProps {
  /** Hero image path */
  imageSrc: string;
  /** Alt text for hero image */
  imageAlt?: string;
  /** i18n namespace for backToWebsite and heroTagline (e.g. "auth.login") */
  i18nNamespace: string;
  /** Enable overflow-y-auto on form panel (for long forms like register) */
  formPanelScroll?: boolean;
  /** Put form on left, hero on right (e.g. for register page) */
  formOnLeft?: boolean;
  /** Form panel content */
  children: React.ReactNode;
}

export function AuthCardLayout({
  imageSrc,
  imageAlt = 'Authentication illustration',
  i18nNamespace,
  formPanelScroll = false,
  formOnLeft = false,
  children,
}: AuthCardLayoutProps) {
  const t = useTranslations(i18nNamespace);

  const heroPanel = (
    <AuthHero
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      overlay
      className="lg:w-[45%] min-h-[260px] lg:min-h-[680px]"
    >
      <div
        className={cn(
          'flex items-center',
          formOnLeft ? 'justify-end' : 'justify-start',
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          {formOnLeft ? (
            <>
              {t('backToWebsite')}
              <ArrowRight className="size-3.5" />
            </>
          ) : (
            <>
              <ArrowLeft className="size-3.5" />
              {t('backToWebsite')}
            </>
          )}
        </Link>
      </div>
      <div className="flex-1" />
      <div className="space-y-1">
        <p className="text-xl font-semibold leading-snug text-white drop-shadow whitespace-pre-line">
          {t('heroTagline')}
        </p>
      </div>
    </AuthHero>
  );

  const formPanel = (
    <div
      className={cn(
        'flex flex-1 flex-col justify-center bg-card px-8 py-10 sm:px-12 lg:px-14',
        formPanelScroll && 'overflow-y-auto',
      )}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1100px] rounded-[30px] overflow-hidden shadow-2xl border border-border flex flex-col lg:flex-row min-h-[600px]">
        {formOnLeft ? (
          <>
            {formPanel}
            {heroPanel}
          </>
        ) : (
          <>
            {heroPanel}
            {formPanel}
          </>
        )}
      </div>
    </div>
  );
}
