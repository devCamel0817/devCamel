export type AlgoKey = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export interface PathfindingAlgorithm {
  key: AlgoKey;
  label: string;
  desc: string;
  complexity: string;
}

export const pathfindingAlgos: PathfindingAlgorithm[] = [
  { key: 'bfs', label: 'BFS', desc: '너비 우선 탐색 — 최단 경로 보장', complexity: 'O(V+E)' },
  { key: 'dfs', label: 'DFS', desc: '깊이 우선 탐색 — 경로 탐색', complexity: 'O(V+E)' },
  { key: 'dijkstra', label: 'Dijkstra', desc: '가중치 그래프 최단 경로', complexity: 'O(V²)' },
  { key: 'astar', label: 'A*', desc: '휴리스틱 기반 최적 경로', complexity: 'O(E log V)' },
];
