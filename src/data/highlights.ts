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
    description:
      'KCP·PayPal·EximBay 통합 연동과 멱등성 키 기반 트랜잭션 설계로 미정산 사고 90% 감소, Webhook 배송 추적으로 CS 60% 자동화.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: HiDatabase,
    title: '대용량 배치 최적화',
    description:
      '기준 데이터 메모리 캐싱 + JdbcTemplate batchUpdate 재설계로 야간 판정 배치 3h → 1.5h (50% 단축). Oracle SQL 튜닝 경험.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: HiCode,
    title: '레거시 현대화 · 팀 생산성',
    description:
      '델파이 → 웹 MSA 전환, 공통 외부 API 연동 모듈(재시도·타임아웃·로깅 표준)로 팀 개발 리소스 약 20% 절감.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];
