'use client';

import type { CreditEstimateResponse, LanguageCode, ParsedFontsByGroup } from '../types';

interface UseStepConfigureStateOptions {
  srcLang: LanguageCode;
  tgtLang: LanguageCode;
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
  estimate,
  isEstimating,
  currentBalance,
  fontsUsedByGroup,
  fontParseSupported,
  isCheckingFonts,
  isLoading,
}: UseStepConfigureStateOptions) {
  const isSameLang = srcLang === tgtLang;
  const hasEstimate = !isEstimating && !!estimate;
  const isEstimatePending = isEstimating || !estimate;
  const hasParsedFonts = Object.keys(fontsUsedByGroup).length > 0;
  const isInsufficientCredits =
    hasEstimate && typeof currentBalance === 'number' && currentBalance < estimate.totalCredits;
  const missingCredits =
    isInsufficientCredits && typeof currentBalance === 'number'
      ? estimate.totalCredits - currentBalance
      : 0;
  const isFontCheckPending = hasParsedFonts && fontParseSupported === true && isCheckingFonts;
  const isStartDisabled =
    isSameLang || isLoading || isEstimatePending || isInsufficientCredits || isFontCheckPending;

  return {
    isSameLang,
    hasEstimate,
    isEstimatePending,
    hasParsedFonts,
    isInsufficientCredits,
    missingCredits,
    isFontCheckPending,
    isStartDisabled,
  };
}
