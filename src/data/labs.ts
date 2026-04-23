import { FaSortAmountDown, FaRoute, FaCircleNotch, FaFeatherAlt } from 'react-icons/fa';

export interface LabItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
}

export const labs: LabItem[] = [
  {
    to: '/labs/sorting',
    icon: FaSortAmountDown,
    title: 'Sorting Algorithms',
    desc: 'Bubble, Selection, Insertion, Quick, Merge Sort 시각화',
    color: 'text-accent',
  },
  {
    to: '/labs/pathfinding',
    icon: FaRoute,
    title: 'Pathfinding Algorithms',
    desc: 'BFS, DFS, Dijkstra, A* 경로 탐색 시각화',
    color: 'text-secondary',
  },
  {
    to: '/labs/boids',
    icon: FaFeatherAlt,
    title: 'Boids Simulation',
    desc: '3가지 규칙만으로 만들어지는 군집 행동 시뮬레이션',
    color: 'text-yellow-400',
  },
  {
    to: '/labs/fourier',
    icon: FaCircleNotch,
    title: 'Fourier Transform',
    desc: '그림을 그리면 회전하는 원들이 그대로 따라 그립니다',
    color: 'text-primary',
  },
];
