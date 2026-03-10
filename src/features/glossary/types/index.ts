// =============== GLOSSARY TYPES ===============

/**
 * A single glossary (terminology set) owned by a user.
 * Maps to backend GlossaryDto response shape.
 */
export interface Glossary {
  id: string;
  userId: string;
  name: string;
  domain: string;
  srcLang: string;
  tgtLang: string;
  termCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Glossary with its first page of terms included.
 * Maps to backend GlossaryDetailDto response shape.
 */
export interface GlossaryDetail extends Glossary {
  terms: Term[];
}

/**
 * A single term pair within a glossary.
 * Maps to backend TermDto response shape.
 */
export interface Term {
  id: string;
  glossaryId: string;
  srcTerm: string;
  tgtTerm: string;
}

// =============== PAGINATION TYPES ===============

/**
 * Pagination metadata returned by all paginated endpoints.
 * Maps to backend PaginationMetaDto.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated list of glossaries.
 * Maps to backend GlossaryListResponseDto.
 */
export interface GlossaryListResponse {
  items: Glossary[];
  pagination: PaginationMeta;
}

/**
 * Paginated list of terms.
 * Maps to backend TermListResponseDto.
 */
export interface TermListResponse {
  items: Term[];
  pagination: PaginationMeta;
}

// =============== REQUEST DTOs ===============

/**
 * Request body for creating a glossary.
 * Maps to backend CreateGlossaryDto.
 */
export interface CreateGlossaryDto {
  name: string;
  domain: string;
  srcLang: string;
  tgtLang: string;
}

/**
 * Request body for updating a glossary.
 * Maps to backend UpdateGlossaryDto. All fields optional.
 */
export interface UpdateGlossaryDto {
  name?: string;
  domain?: string;
  srcLang?: string;
  tgtLang?: string;
}

/**
 * Query parameters for listing glossaries.
 * Extends base pagination params with glossary-specific filters.
 * Maps to backend GlossaryQueryDto.
 */
export interface GlossaryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  domain?: string;
  srcLang?: string;
  tgtLang?: string;
}

/**
 * Query parameters for listing terms within a glossary.
 * Maps to backend TermQueryDto (extends PaginationQueryDto).
 */
export interface TermQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * Request body for creating a single term.
 * Maps to backend CreateTermDto.
 */
export interface CreateTermDto {
  srcTerm: string;
  tgtTerm: string;
}

/**
 * Request body for updating a single term.
 * Maps to backend UpdateTermDto. All fields optional.
 */
export interface UpdateTermDto {
  srcTerm?: string;
  tgtTerm?: string;
}

/**
 * Request body for bulk importing terms.
 * Maps to backend BulkCreateTermsDto.
 */
export interface BulkCreateTermsDto {
  terms: CreateTermDto[];
}

// =============== RESPONSE TYPES ===============

/**
 * Result of a bulk import operation.
 * Maps to backend BulkImportResultDto.
 */
export interface BulkImportResult {
  created: number;
  skipped: number;
}
