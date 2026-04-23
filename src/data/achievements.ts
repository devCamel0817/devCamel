export interface Achievement {
  label: string;
  value: number;
  suffix: string;
  sub: string;
  color: string;
}

export const achievements: Achievement[] = [
  { label: '배치 성능 향상', value: 50, suffix: '%', sub: '3h → 1.5h', color: 'text-accent' },
  { label: '생산성 향상', value: 20, suffix: '%', sub: '공통 모듈 구축', color: 'text-primary' },
  { label: '실무 프로젝트', value: 4, suffix: '개', sub: '결제·물류·의료·교육', color: 'text-secondary' },
  { label: '실무 경력', value: 3, suffix: '년', sub: 'Full-Stack Developer', color: 'text-accent-light' },
];
