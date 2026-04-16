// 날짜, 기간 등 포맷팅 유틸 함수 모음
import type { Period } from '../types/project';

export function formatPeriod(period: Period): string {
  const fmt = (ym: string) => `${ym.slice(0, 4)}.${ym.slice(4)}`;
  return period.end === 'present'
    ? `${fmt(period.start)} - 현재`
    : `${fmt(period.start)} - ${fmt(period.end)}`;
}
