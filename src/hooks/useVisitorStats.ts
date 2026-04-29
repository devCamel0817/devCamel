import { useEffect, useState } from 'react';
import { ref, onValue, runTransaction } from 'firebase/database';
import { getFirebase } from '../lib/firebase';

/**
 * 일별 / 누적 방문자 수 카운터.
 *
 * RTDB 구조:
 *   /stats/daily/{YYYY-MM-DD} = number
 *   /stats/total              = number
 *
 * 중복 방지:
 *   - localStorage('devcamel:lastVisitDate')에 마지막 카운트한 날짜 저장
 *   - 같은 날 재방문 / 새로고침은 카운트 X
 *
 * 환경변수 미설정 시 status='disabled'.
 */
export type StatsStatus = 'loading' | 'live' | 'disabled' | 'error';

export interface VisitorStats {
  today: number;
  total: number;
  status: StatsStatus;
}

const STORAGE_KEY = 'devcamel:lastVisitDate';

function todayKey(): string {
  // KST 기준 YYYY-MM-DD
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function readLastVisit(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLastVisit(date: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, date);
  } catch {
    /* private mode 등 — silent */
  }
}

export function useVisitorStats(): VisitorStats {
  const [state, setState] = useState<VisitorStats>(() => {
    const fb = getFirebase();
    return fb
      ? { today: 0, total: 0, status: 'loading' }
      : { today: 0, total: 0, status: 'disabled' };
  });

  useEffect(() => {
    const fb = getFirebase();
    if (!fb) return;

    const today = todayKey();
    const dailyRef = ref(fb.db, `stats/daily/${today}`);
    const totalRef = ref(fb.db, 'stats/total');

    // 1) 오늘 처음 방문이면 increment (트랜잭션으로 race 회피)
    const last = readLastVisit();
    if (last !== today) {
      runTransaction(dailyRef, (cur) => (typeof cur === 'number' ? cur + 1 : 1))
        .then(() => writeLastVisit(today))
        .catch((err) => console.warn('[stats] daily increment failed', err));
      runTransaction(totalRef, (cur) => (typeof cur === 'number' ? cur + 1 : 1)).catch(
        (err) => console.warn('[stats] total increment failed', err)
      );
    }

    // 2) 두 카운터 실시간 구독
    const unsubDaily = onValue(
      dailyRef,
      (snap) => {
        const v = snap.val();
        setState((s) => ({ ...s, today: typeof v === 'number' ? v : 0, status: 'live' }));
      },
      (err) => {
        console.warn('[stats] daily onValue', err);
        queueMicrotask(() =>
          setState((s) => ({ ...s, status: 'error' }))
        );
      }
    );
    const unsubTotal = onValue(
      totalRef,
      (snap) => {
        const v = snap.val();
        setState((s) => ({ ...s, total: typeof v === 'number' ? v : 0 }));
      },
      (err) => console.warn('[stats] total onValue', err)
    );

    return () => {
      unsubDaily();
      unsubTotal();
    };
  }, []);

  return state;
}
