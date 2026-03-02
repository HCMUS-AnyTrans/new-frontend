import { apiClient } from '@/lib/api-client';
import type {
  Glossary,
  GlossaryDetail,
  GlossaryListResponse,
  GlossaryQueryParams,
  CreateGlossaryDto,
  UpdateGlossaryDto,
  Term,
  TermListResponse,
  TermQueryParams,
  CreateTermDto,
  UpdateTermDto,
  BulkCreateTermsDto,
  BulkImportResult,
} from '../types';
import type { MessageResponse } from '@/types/api.types';

// ============================================================================
// Glossary CRUD
// ============================================================================

/**
 * Create a new glossary
 * POST /glossaries
 */
export async function createGlossaryApi(
  dto: CreateGlossaryDto
): Promise<Glossary> {
  const response = await apiClient.post<Glossary>('/glossaries', dto);
  return response.data;
}

/**
 * List glossaries for the current user (paginated, filterable)
 * GET /glossaries
 */
export async function listGlossariesApi(
  params?: GlossaryQueryParams
): Promise<GlossaryListResponse> {
  const response = await apiClient.get<GlossaryListResponse>('/glossaries', {
    params,
  });
  return response.data;
}

/**
 * Get a single glossary with its first 50 terms
 * GET /glossaries/:glossaryId
 */
export async function getGlossaryApi(
  glossaryId: string
): Promise<GlossaryDetail> {
  const response = await apiClient.get<GlossaryDetail>(
    `/glossaries/${glossaryId}`
  );
  return response.data;
}

/**
 * Update glossary metadata (domain, srcLang, tgtLang)
 * PATCH /glossaries/:glossaryId
 */
export async function updateGlossaryApi(
  glossaryId: string,
  dto: UpdateGlossaryDto
): Promise<Glossary> {
  const response = await apiClient.patch<Glossary>(
    `/glossaries/${glossaryId}`,
    dto
  );
  return response.data;
}

/**
 * Delete a glossary and all its terms (cascade)
 * DELETE /glossaries/:glossaryId
 */
export async function deleteGlossaryApi(
  glossaryId: string
): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(
    `/glossaries/${glossaryId}`
  );
  return response.data;
}

// ============================================================================
// Term CRUD
// ============================================================================

/**
 * Add a single term to a glossary
 * POST /glossaries/:glossaryId/terms
 */
export async function addTermApi(
  glossaryId: string,
  dto: CreateTermDto
): Promise<Term> {
  const response = await apiClient.post<Term>(
    `/glossaries/${glossaryId}/terms`,
    dto
  );
  return response.data;
}

/**
 * List terms within a glossary (paginated, searchable)
 * GET /glossaries/:glossaryId/terms
 */
export async function listTermsApi(
  glossaryId: string,
  params?: TermQueryParams
): Promise<TermListResponse> {
  const response = await apiClient.get<TermListResponse>(
    `/glossaries/${glossaryId}/terms`,
    { params }
  );
  return response.data;
}

/**
 * Bulk import terms into a glossary (max 500 per request)
 * POST /glossaries/:glossaryId/terms/bulk
 */
export async function bulkImportTermsApi(
  glossaryId: string,
  dto: BulkCreateTermsDto
): Promise<BulkImportResult> {
  const response = await apiClient.post<BulkImportResult>(
    `/glossaries/${glossaryId}/terms/bulk`,
    dto
  );
  return response.data;
}

/**
 * Update a single term
 * PATCH /glossaries/:glossaryId/terms/:termId
 */
export async function updateTermApi(
  glossaryId: string,
  termId: string,
  dto: UpdateTermDto
): Promise<Term> {
  const response = await apiClient.patch<Term>(
    `/glossaries/${glossaryId}/terms/${termId}`,
    dto
  );
  return response.data;
}

/**
 * Delete a single term
 * DELETE /glossaries/:glossaryId/terms/:termId
 */
export async function deleteTermApi(
  glossaryId: string,
  termId: string
): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(
    `/glossaries/${glossaryId}/terms/${termId}`
  );
  return response.data;
}
