import { apiGet } from './client';
import type {
  Nplus1CompareResponse,
  Nplus1Result,
  Nplus1VariantOption,
  Nplus1VariantValue,
} from '../types/nplus1';

export const AUTHOR_COUNT_MIN = 1;
export const AUTHOR_COUNT_MAX = 200;
export const AUTHOR_COUNT_PRESETS = [10, 30, 50, 100, 200] as const;

function clampAuthorCount(n: number): number {
  if (!Number.isFinite(n)) return 30;
  return Math.min(AUTHOR_COUNT_MAX, Math.max(AUTHOR_COUNT_MIN, Math.floor(n)));
}

/** GET /api/nplus1/variants — 시나리오 메타데이터 */
export function getNplus1Variants(signal?: AbortSignal): Promise<Nplus1VariantOption[]> {
  return apiGet<Nplus1VariantOption[]>('/api/nplus1/variants', signal);
}

/** GET /api/nplus1?variant=...&authorCount=N — 단일 시나리오 측정 */
export function runNplus1Scenario(
  variant: Nplus1VariantValue,
  authorCount: number,
  signal?: AbortSignal,
): Promise<Nplus1Result> {
  const n = clampAuthorCount(authorCount);
  const params = new URLSearchParams({ variant, authorCount: String(n) });
  return apiGet<Nplus1Result>(`/api/nplus1?${params.toString()}`, signal);
}

/** GET /api/nplus1/compare?authorCount=N — 3개 시나리오 비교 */
export function compareNplus1(
  authorCount: number,
  signal?: AbortSignal,
): Promise<Nplus1CompareResponse> {
  const n = clampAuthorCount(authorCount);
  return apiGet<Nplus1CompareResponse>(`/api/nplus1/compare?authorCount=${n}`, signal);
}
