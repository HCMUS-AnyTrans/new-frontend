'use client';

import type {
  CreditEstimateResponse,
  LanguageCode,
  ParsedFontsByGroup,
} from '../types';

interface UseStepConfigureStateOptions {
  srcLang: LanguageCode;
  tgtLang: LanguageCode;
  domain: string;
  customDomain: string;
  estimate: CreditEstimateResponse | undefined;
  isEstimating: boolean;
  currentBalance?: number;
  fontsUsedByGroup: ParsedFontsByGroup;
  fontParseSupported: boolean | null;
  isCheckingFonts: boolean;
  isLoading?: boolean;
}

export function useStepConfigureState({
  srcLang,
  tgtLang,
  domain,
  customDomain,
  estimate,
  isEstimating,
  currentBalance,
  fontsUsedByGroup,
  fontParseSupported,
  isCheckingFonts,
  isLoading,
}: UseStepConfigureStateOptions) {
  const isSameLang = srcLang === tgtLang;
  const isOtherDomainMissing = domain === 'other' && customDomain.trim().length === 0;
  const hasEstimate = !isEstimating && !!estimate;
  const isEstimatePending = isEstimating || !estimate;
  const hasParsedFonts = Object.keys(fontsUsedByGroup).length > 0;
  const isInsufficientCredits =
    hasEstimate &&
    typeof currentBalance === 'number' &&
    currentBalance < estimate.totalCredits;
  const missingCredits =
    isInsufficientCredits && typeof currentBalance === 'number'
      ? estimate.totalCredits - currentBalance
      : 0;
  const isFontCheckPending =
    hasParsedFonts && fontParseSupported === true && isCheckingFonts;
  const isStartDisabled =
    isSameLang ||
    isOtherDomainMissing ||
    isLoading ||
    isEstimatePending ||
    isInsufficientCredits ||
    isFontCheckPending;

  return {
    isSameLang,
    isOtherDomainMissing,
    hasEstimate,
    isEstimatePending,
    hasParsedFonts,
    isInsufficientCredits,
    missingCredits,
    isFontCheckPending,
    isStartDisabled,
  };
}
