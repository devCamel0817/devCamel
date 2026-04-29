import { useEffect, useState } from 'react';
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
  push,
} from 'firebase/database';
import { getFirebase } from '../lib/firebase';

/**
 * Firebase Realtime DB의 onDisconnect 패턴으로 동시 접속자 수 추적.
 *
 * 구조:
 *   /presence/{sessionId} = { ts: serverTimestamp }
 *
 * - 마운트 시 push()로 고유 세션 노드 생성
 * - onDisconnect().remove() 등록 → 탭 닫히거나 연결 끊기면 자동 정리
 * - /presence 전체를 onValue 구독 → child 수가 동시 접속자
 *
 * 환경변수 미설정 시 status='disabled'로 silent 종료.
 */
export type PresenceStatus = 'connecting' | 'live' | 'disabled' | 'error';

export interface PresenceState {
  count: number;
  status: PresenceStatus;
}

export function useVisitorPresence(): PresenceState {
  // lazy init: Firebase 미설정 케이스를 effect 밖에서 결정 (React Compiler 친화)
  const [state, setState] = useState<PresenceState>(() => {
    const fb = getFirebase();
    return fb
      ? { count: 0, status: 'connecting' }
      : { count: 0, status: 'disabled' };
  });

  useEffect(() => {
    const fb = getFirebase();
    if (!fb) return;

    let cleanup: (() => void) | null = null;
    try {
      const presenceRef = ref(fb.db, 'presence');
      const myRef = push(presenceRef);

      // 등록 + 자동 정리
      set(myRef, { ts: serverTimestamp() });
      onDisconnect(myRef).remove();

      // 동시 접속자 수 구독
      const unsub = onValue(
        presenceRef,
        (snap) => {
          const n = snap.size; // child count
          setState({ count: n, status: 'live' });
        },
        (err) => {
          console.warn('[presence] onValue error', err);
          setState({ count: 0, status: 'error' });
        }
      );

      cleanup = () => {
        unsub();
        // 명시적 cleanup (StrictMode 더블 마운트 대비)
        set(myRef, null).catch(() => {});
      };
    } catch (err) {
      console.warn('[presence] init failed', err);
      // queueMicrotask로 effect 동기 cascade 회피 (React Compiler 친화)
      queueMicrotask(() => setState({ count: 0, status: 'error' }));
    }

    return () => {
      cleanup?.();
    };
  }, []);

  return state;
}
