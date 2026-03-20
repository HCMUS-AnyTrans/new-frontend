'use client';

import { useQuery } from '@tanstack/react-query';
import { checkFonts } from '../api/documents.api';
import type { FontCheckItem, ParsedFontsByGroup } from '../types';

interface FontCheckState {
  items: FontCheckItem[];
  language: string | null;
  fontCheckUnavailable: boolean;
}

function extractUniqueFonts(fontsUsedByGroup: ParsedFontsByGroup): string[] {
  return [...new Set(Object.values(fontsUsedByGroup).flatMap((fonts) => fonts))];
}

export function useFontCheck(
  fileId: string | null,
  targetLanguage: string | null,
  fontsUsedByGroup: ParsedFontsByGroup,
  fontParseSupported: boolean | null,
) {
  const fonts = extractUniqueFonts(fontsUsedByGroup);

  return useQuery<FontCheckState>({
    queryKey: ['documents', 'font-check', fileId, targetLanguage, fonts],
    enabled:
      fileId !== null &&
      !!targetLanguage &&
      fontParseSupported === true &&
      fonts.length > 0,
    queryFn: async () => {
      if (!targetLanguage || fileId === null || fontParseSupported !== true) {
        return {
          items: [],
          language: null,
          fontCheckUnavailable: false,
        };
      }

      try {
        const response = await checkFonts({
          fonts,
          language: targetLanguage,
        });

        return {
          items: response.items,
          language: response.language,
          fontCheckUnavailable: false,
        };
      } catch {
        return {
          items: [],
          language: null,
          fontCheckUnavailable: true,
        };
      }
    },
  });
}
