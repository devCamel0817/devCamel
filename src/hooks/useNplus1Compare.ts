import { useEffect, useState } from 'react';
import { compareNplus1 } from '../api/nplus1';
import { ApiError } from '../api/client';
import type { Nplus1CompareResponse } from '../types/nplus1';

export type Nplus1CompareState =
  | { status: 'loading' }
  | { status: 'error'; message: string; kind: ApiError['kind'] | 'unknown' }
  | { status: 'ready'; data: Nplus1CompareResponse };

export function useNplus1Compare(authorCount: number, reloadKey = 0): Nplus1CompareState {
  const [state, setState] = useState<Nplus1CompareState>({ status: 'loading' });

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: 'loading' });
    compareNplus1(authorCount, ctrl.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        if (err instanceof ApiError) {
          setState({ status: 'error', message: err.message, kind: err.kind });
          return;
        }
        const message = err instanceof Error ? err.message : '알 수 없는 오류';
        setState({ status: 'error', message, kind: 'unknown' });
      });
    return () => ctrl.abort();
  }, [authorCount, reloadKey]);

  return state;
}
