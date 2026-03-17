'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AuthHeroProps {
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
}

export function AuthHero({
  imageSrc,
  imageAlt = 'Authentication illustration',
  className,
  children,
  overlay = false,
}: AuthHeroProps) {
  return (
    <div
      className={cn(
        'hidden lg:flex lg:flex-1',
        'items-center justify-center',
        'bg-muted/30',
        'relative overflow-hidden',
        'min-h-[600px]',
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Optional dark overlay for text readability */}
      {overlay && <div className="absolute inset-0 z-10 bg-black/20" />}

      {/* Children rendered above image */}
      {children && (
        <div className="relative z-20 flex h-full w-full flex-col p-8">
          {children}
        </div>
      )}
    </div>
  );
}
