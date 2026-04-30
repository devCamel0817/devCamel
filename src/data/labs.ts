import {
  FaSortAmountDown,
  FaRoute,
  FaCircleNotch,
  FaFeatherAlt,
  FaDatabase,
  FaLock,
  FaLayerGroup,
  FaBolt,
  FaForward,
} from 'react-icons/fa';

export type LabGroup = 'visual-algorithms' | 'backend-lab';
export type LabStatus = 'live' | 'soon';
export type BackendTag =
  | 'JPA'
  | 'Concurrency'
  | 'Bulk'
  | 'Cache'
  | 'Async';

export interface LabItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
  group: LabGroup;
  status: LabStatus;
  tags?: BackendTag[];
}

export const labGroups: Array<{
  key: LabGroup;
  label: string;
  hand: string;
  desc: string;
}> = [
  {
    key: 'visual-algorithms',
    label: 'Visual Algorithms',
    hand: 'visualize',
    desc: '알고리즘과 시뮬레이션을 눈으로 보고 이해하기',
  },
  {
    key: 'backend-lab',
    label: 'Backend Lab',
    hand: 'measure',
    desc: 'Spring 내부 동작을 직접 측정해본 실험들 · Spring Boot + PostgreSQL',
  },
];

export const labs: LabItem[] = [
  /* ───────── Visual Algorithms ───────── */
  {
    to: '/labs/sorting',
    icon: FaSortAmountDown,
    title: 'Sorting Algorithms',
    desc: 'Bubble · Selection · Insertion · Quick · Merge Sort 시각화',
    color: 'text-accent',
    group: 'visual-algorithms',
    status: 'live',
  },
  {
    to: '/labs/pathfinding',
    icon: FaRoute,
    title: 'Pathfinding Algorithms',
    desc: 'BFS · DFS · Dijkstra · A* 경로 탐색 시각화',
    color: 'text-secondary',
    group: 'visual-algorithms',
    status: 'live',
  },
  {
    to: '/labs/boids',
    icon: FaFeatherAlt,
    title: 'Boids Simulation',
    desc: '3가지 규칙으로 만들어지는 군집 행동 시뮬레이션',
    color: 'text-yellow-400',
    group: 'visual-algorithms',
    status: 'live',
  },
  {
    to: '/labs/fourier',
    icon: FaCircleNotch,
    title: 'Fourier Transform',
    desc: '회전하는 원들이 그림을 그대로 따라 그립니다',
    color: 'text-primary',
    group: 'visual-algorithms',
    status: 'live',
  },

  /* ───────── Backend Lab ───────── */
  {
    to: '/labs/jpa-nplus1',
    icon: FaDatabase,
    title: 'N+1 vs Fetch Join',
    desc: '같은 데이터를 3가지 방법으로 조회하고 쿼리 수·시간을 비교',
    color: 'text-accent',
    group: 'backend-lab',
    status: 'live',
    tags: ['JPA'],
  },
  {
    to: '/labs/locking',
    icon: FaLock,
    title: 'Pessimistic vs Optimistic Lock',
    desc: '100명이 재고 1개를 동시에 살 때 · 비관락 / 낙관락 / Redis 락 비교',
    color: 'text-secondary',
    group: 'backend-lab',
    status: 'soon',
    tags: ['Concurrency'],
  },
  {
    to: '/labs/bulk-insert',
    icon: FaLayerGroup,
    title: 'Bulk Insert Strategies',
    desc: '1만 건 INSERT를 단건 / JDBC Batch / Spring Batch 로 처리해 처리량 비교',
    color: 'text-primary',
    group: 'backend-lab',
    status: 'soon',
    tags: ['Bulk'],
  },
  {
    to: '/labs/caching',
    icon: FaBolt,
    title: 'Cache Layers',
    desc: '동일 조회 1000번 · 캐시 없음 / Caffeine / Redis 의 P50·P95·P99',
    color: 'text-yellow-400',
    group: 'backend-lab',
    status: 'soon',
    tags: ['Cache'],
  },
  {
    to: '/labs/async-vthread',
    icon: FaForward,
    title: 'Sync vs CompletableFuture vs Virtual Thread',
    desc: '외부 API 100개 동시 호출 · 처리량과 메모리 비교',
    color: 'text-accent',
    group: 'backend-lab',
    status: 'soon',
    tags: ['Async'],
  },
];
