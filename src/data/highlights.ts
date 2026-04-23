import { HiServer, HiDatabase, HiCode } from 'react-icons/hi';

export interface Highlight {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bg: string;
}

export const highlights: Highlight[] = [
  {
    icon: HiServer,
    title: '결제 · 물류 도메인',
    description: 'KCP/PayPal/EximBay 결제 연동, EasyPost/CJ 물류 자동화 등 실서비스 도메인 경험.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: HiDatabase,
    title: '대용량 데이터 처리',
    description: '판정 배치 성능 50% 향상 (3h → 1.5h), Oracle SQL 튜닝 및 쿼리 최적화.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: HiCode,
    title: '레거시 현대화',
    description: '델파이 → 웹 전환, MSA 도메인 분산 설계, 공통 모듈 구축으로 생산성 20% 향상.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];
