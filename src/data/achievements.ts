export interface Achievement {
  label: string;
  value: number;
  suffix: string;
  sub: string;
  color: string;
}

export const achievements: Achievement[] = [
  { label: '미정산 사고 감소', value: 90, suffix: '%', sub: '멱등성 키·상태머신 설계', color: 'text-primary' },
  { label: '야간 배치 단축', value: 50, suffix: '%', sub: '3h → 1.5h', color: 'text-accent' },
  { label: '배송 CS 자동화', value: 60, suffix: '%', sub: 'Webhook 실시간 추적', color: 'text-secondary' },
  { label: '팀 리소스 절감', value: 20, suffix: '%', sub: '공통 API 모듈 표준화', color: 'text-accent-light' },
  { label: '도메인 횡단', value: 4, suffix: '개', sub: '결제·물류·헬스케어·커머스', color: 'text-primary' },
];
