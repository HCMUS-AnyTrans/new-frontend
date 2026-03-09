type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  properties?: AnalyticsProperties,
) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties ?? {});
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...(properties ?? {}),
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', eventName, properties ?? {});
  }
}
