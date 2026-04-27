import type { CareerProject } from '../types';


export const projects: CareerProject[] = [
  {
    id: 1,
    title: 'CTK CLIP 사이트 리뉴얼',
    description:
      '코스메카코리아 그룹 B2B 이커머스 플랫폼 리뉴얼. KCP/PayPal/EximBay 결제 연동 및 EasyPost/CJ 물류 자동화.',
    imageUrl: '',
    tags: ['Java', 'Spring Boot', 'MyBatis', 'MySQL', 'Vue3', 'Quasar'],
    liveUrl: 'https://www.ctkclip.com/',
    period: { start: '202508', end: '202601' },
    company: '프리랜서',
    role: 'Fullstack Developer',
    achievements: [
      'KCP·PayPal·EximBay 통합 연동, 멱등성 키·상태머신 기반 트랜잭션 예외 처리로 미정산 사고 90% 감소',
      'EasyPost·CJ 대한통운 Webhook 기반 실시간 배송 추적 엔진 구축, 배송 문의 CS 60% 자동화',
      '공통 외부 API 연동 모듈 설계로 신규 연동 공수 절반 단축',
    ],
    createdAt: '2025-08-01',
  },
  {
    id: 2,
    title: '강북삼성병원 건강검진 차세대 OCS',
    description:
      '삼성SDS 협업 프로젝트. 델파이 레거시 건강검진 시스템을 웹 기반 MSA 아키텍처로 전환·재설계하고, 야간 판정 배치 구조를 재설계해 처리 시간을 3시간에서 1.5시간으로 50% 단축.',
    imageUrl: '',
    tags: [
      'Java',
      'Spring Boot',
      'JPA',
      'QueryDSL',
      'PostgreSQL',
      'Vue3',
      'Chart.js',
      'Docker',
      'Argo CD',
    ],
    period: { start: '202405', end: '202505' },
    company: '삼성SDS 협업',
    role: 'Backend Developer',
    achievements: [
      '야간 판정 배치 재설계 — 기준 데이터 메모리 캐싱 + JdbcTemplate batchUpdate 적용으로 3h → 1.5h (50% 단축)',
      '델파이 레거시 → MSA 도메인 분산 설계 (수진자·검사·판정·통계)',
      'Chart.js 기반 검진 통계 대시보드 개발',
      '공통 컴포넌트/에러 핸들러 표준화로 팀 유지보수성 개선',
    ],
    createdAt: '2024-05-01',
  },
  {
    id: 3,
    title: '경기도청 GSEEK 고도화',
    description:
      '경기도 평생학습 플랫폼 고도화. ZOOM API 연동 실시간 화상강의, BizMailer 대량메일 발송 시스템 개발.',
    imageUrl: '',
    tags: ['Java', 'Spring Boot', 'MyBatis', 'MariaDB', 'JSP', 'Docker', 'Jenkins'],
    liveUrl: 'https://www.gseek.kr/',
    period: { start: '202306', end: '202404' },
    company: '경기도청',
    role: 'Fullstack Developer',
    achievements: [
      'ZOOM API 연동 실시간 화상 강의 시스템',
      'BizMailer API로 대량 메일 발송 자동화',
    ],
    createdAt: '2023-06-01',
  },
  {
    id: 4,
    title: '롯데유통 SCM EPC 이관',
    description:
      '기존 SCM EPC 시스템을 신규 인프라로 이관. 대용량 Oracle 쿼리 튜닝과 공통 외부 API 연동 모듈 표준화로 팀 개발 리소스 약 20% 절감.',
    imageUrl: '',
    tags: ['Java', 'Spring Framework', 'MyBatis', 'Oracle', 'SVN'],
    period: { start: '202212', end: '202305' },
    company: '롯데유통',
    role: 'Backend Developer',
    achievements: [
      '공통 RestTemplate 래퍼 + 재시도·타임아웃·로깅 표준 모듈 설계 → 팀 개발 리소스 약 20% 절감',
      'Oracle SQL 튜닝 및 프로시저 최적화',
      '기존 시스템 → 신규 인프라 안정적 이관',
      '대용량 데이터 마이그레이션 스크립트 작성',
    ],
    createdAt: '2022-12-01',
  },
];
