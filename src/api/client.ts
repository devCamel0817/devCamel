/**
 * 공통 API 클라이언트.
 *
 * - baseURL은 Vite 환경변수에서 읽음 (운영: Vercel Project Settings에서 주입).
 * - VITE_API_BASE_URL이 우선, 과거 키(VITE_BACKEND_URL)도 호환.
 * - trailing slash는 안전하게 제거하여 path와의 결합 시 `//` 중복을 막는다.
 * - 응답 실패는 ApiError로 정규화하여 호출부에서 분기하기 쉽게 한다.
 */

const RAW_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  'http://localhost:8080';

export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

export type ApiErrorKind = 'network' | 'http' | 'parse' | 'aborted';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

function buildUrl(path: string): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${safePath}`;
}

/**
 * GET 요청. 응답이 2xx가 아니거나 네트워크가 실패하면 ApiError를 throw.
 * 브라우저에서는 CORS 실패도 네트워크 오류와 구분 불가능하므로 'network'로 묶음.
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      mode: 'cors',
      signal,
    });
  } catch (e) {
    if (signal?.aborted) {
      throw new ApiError('요청이 취소되었어요', 'aborted');
    }
    throw new ApiError(
      '백엔드에 연결할 수 없어요 (네트워크 또는 CORS 오류)',
      'network',
    );
  }

  if (!res.ok) {
    throw new ApiError(`백엔드 응답 오류 (${res.status})`, 'http', res.status);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError('응답을 해석할 수 없어요 (JSON 파싱 실패)', 'parse');
  }
}

/* ────────────────── 헬스체크 ────────────────── */

export interface PingResponse {
  status: string;
  service: string;
  timestamp: number;
  message: string;
}

export function pingBackend(signal?: AbortSignal): Promise<PingResponse> {
  return apiGet<PingResponse>('/api/ping', signal);
}
