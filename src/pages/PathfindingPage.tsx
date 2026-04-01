import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaDice, FaEraser, FaArrowLeft } from 'react-icons/fa';
import { PageTransition, GlassCard } from '../components/ui';

/* ── Types ── */
type CellType = 'empty' | 'wall' | 'start' | 'end';
type CellVisual = 'none' | 'visited' | 'path';
interface Cell {
  type: CellType;
  visual: CellVisual;
}
type AlgoKey = 'bfs' | 'dfs' | 'dijkstra' | 'astar';
interface PathStep {
  kind: 'visit' | 'path';
  row: number;
  col: number;
}

/* ── Constants ── */
const ROWS = 21;
const COLS = 41;
const START: [number, number] = [10, 3];
const END: [number, number] = [10, 37];
const DIRS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const algos: { key: AlgoKey; label: string; desc: string; complexity: string }[] = [
  { key: 'bfs', label: 'BFS', desc: '너비 우선 탐색 — 최단 경로 보장', complexity: 'O(V+E)' },
  { key: 'dfs', label: 'DFS', desc: '깊이 우선 탐색 — 경로 탐색', complexity: 'O(V+E)' },
  { key: 'dijkstra', label: 'Dijkstra', desc: '가중치 그래프 최단 경로', complexity: 'O(V²)' },
  { key: 'astar', label: 'A*', desc: '휴리스틱 기반 최적 경로', complexity: 'O(E log V)' },
];

const speeds = [
  { label: '0.5x', ms: 40 },
  { label: '1x', ms: 15 },
  { label: '2x', ms: 5 },
  { label: '4x', ms: 1 },
];

/* ── Grid helpers ── */
function createGrid(): Cell[][] {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      type: (r === START[0] && c === START[1]
        ? 'start'
        : r === END[0] && c === END[1]
          ? 'end'
          : 'empty') as CellType,
      visual: 'none' as CellVisual,
    })),
  );
}

function generateMaze(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ type: 'wall' as CellType, visual: 'none' as CellVisual })),
  );

  // Iterative backtracking
  const stack: [number, number][] = [[1, 1]];
  grid[1][1].type = 'empty';

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const nbrs: [number, number, number, number][] = [];
    for (const [dr, dc] of [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0],
    ] as [number, number][]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && grid[nr][nc].type === 'wall') {
        nbrs.push([nr, nc, r + dr / 2, c + dc / 2]);
      }
    }
    if (nbrs.length) {
      const [nr, nc, wr, wc] = nbrs[Math.floor(Math.random() * nbrs.length)];
      grid[wr][wc].type = 'empty';
      grid[nr][nc].type = 'empty';
      stack.push([nr, nc]);
    } else {
      stack.pop();
    }
  }

  grid[START[0]][START[1]].type = 'start';
  grid[END[0]][END[1]].type = 'end';
  // Ensure neighbors of start/end are open
  for (const [dr, dc] of DIRS) {
    const sr = START[0] + dr;
    const sc = START[1] + dc;
    if (sr > 0 && sr < ROWS - 1 && sc > 0 && sc < COLS - 1) grid[sr][sc].type = 'empty';
    const er = END[0] + dr;
    const ec = END[1] + dc;
    if (er > 0 && er < ROWS - 1 && ec > 0 && ec < COLS - 1) grid[er][ec].type = 'empty';
  }
  return grid;
}

/* ── Path reconstruction ── */
function reconstruct(prev: ([number, number] | null)[][]): [number, number][] {
  const path: [number, number][] = [];
  let cur: [number, number] | null = END;
  while (cur) {
    path.push(cur);
    cur = prev[cur[0]][cur[1]];
  }
  return path.reverse();
}

/* ── Algorithm generators ── */
function* bfsSteps(grid: Cell[][]): Generator<PathStep> {
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const prev: ([number, number] | null)[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(null),
  );
  const queue: [number, number][] = [START];
  visited[START[0]][START[1]] = true;
  let found = false;

  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === END[0] && c === END[1]) {
      found = true;
      break;
    }
    yield { kind: 'visit', row: r, col: c };
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visited[nr][nc] && grid[nr][nc].type !== 'wall'
      ) {
        visited[nr][nc] = true;
        prev[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }
  if (found) for (const [r, c] of reconstruct(prev)) yield { kind: 'path', row: r, col: c };
}

function* dfsSteps(grid: Cell[][]): Generator<PathStep> {
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const prev: ([number, number] | null)[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(null),
  );
  const stack: [number, number][] = [START];
  visited[START[0]][START[1]] = true;
  let found = false;

  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r === END[0] && c === END[1]) {
      found = true;
      break;
    }
    yield { kind: 'visit', row: r, col: c };
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visited[nr][nc] && grid[nr][nc].type !== 'wall'
      ) {
        visited[nr][nc] = true;
        prev[nr][nc] = [r, c];
        stack.push([nr, nc]);
      }
    }
  }
  if (found) for (const [r, c] of reconstruct(prev)) yield { kind: 'path', row: r, col: c };
}

function* dijkstraSteps(grid: Cell[][]): Generator<PathStep> {
  const dist: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const prev: ([number, number] | null)[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(null),
  );
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  dist[START[0]][START[1]] = 0;
  const pq: [number, number, number][] = [[0, START[0], START[1]]];
  let found = false;

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, r, c] = pq.shift()!;
    if (visited[r][c]) continue;
    visited[r][c] = true;
    if (r === END[0] && c === END[1]) {
      found = true;
      break;
    }
    yield { kind: 'visit', row: r, col: c };
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visited[nr][nc] && grid[nr][nc].type !== 'wall'
      ) {
        const nd = d + 1;
        if (nd < dist[nr][nc]) {
          dist[nr][nc] = nd;
          prev[nr][nc] = [r, c];
          pq.push([nd, nr, nc]);
        }
      }
    }
  }
  if (found) for (const [r, c] of reconstruct(prev)) yield { kind: 'path', row: r, col: c };
}

function* astarSteps(grid: Cell[][]): Generator<PathStep> {
  const h = (r: number, c: number) => Math.abs(r - END[0]) + Math.abs(c - END[1]);
  const g: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const prev: ([number, number] | null)[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(null),
  );
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  g[START[0]][START[1]] = 0;
  const open: [number, number, number][] = [[h(START[0], START[1]), START[0], START[1]]];
  let found = false;

  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, r, c] = open.shift()!;
    if (visited[r][c]) continue;
    visited[r][c] = true;
    if (r === END[0] && c === END[1]) {
      found = true;
      break;
    }
    yield { kind: 'visit', row: r, col: c };
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS &&
        !visited[nr][nc] && grid[nr][nc].type !== 'wall'
      ) {
        const ng = g[r][c] + 1;
        if (ng < g[nr][nc]) {
          g[nr][nc] = ng;
          prev[nr][nc] = [r, c];
          open.push([ng + h(nr, nc), nr, nc]);
        }
      }
    }
  }
  if (found) for (const [r, c] of reconstruct(prev)) yield { kind: 'path', row: r, col: c };
}

/* ── Selector ── */
function getGenerator(algo: AlgoKey, grid: Cell[][]) {
  switch (algo) {
    case 'bfs': return bfsSteps(grid);
    case 'dfs': return dfsSteps(grid);
    case 'dijkstra': return dijkstraSteps(grid);
    case 'astar': return astarSteps(grid);
  }
}

/* ── Cell color ── */
function cellBg(cell: Cell): string {
  if (cell.type === 'start') return 'bg-accent';
  if (cell.type === 'end') return 'bg-secondary';
  if (cell.type === 'wall') return 'bg-surface-400';
  if (cell.visual === 'path') return 'bg-accent/80';
  if (cell.visual === 'visited') return 'bg-primary/50';
  return 'bg-surface-800';
}

/* ── Component ── */
export default function PathfindingPage() {
  const [grid, setGrid] = useState(createGrid);
  const [algo, setAlgo] = useState<AlgoKey>('bfs');
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const genRef = useRef<Generator<PathStep> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef(grid);
  const runningRef = useRef(running);
  const drawModeRef = useRef<'add' | 'remove' | null>(null);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => {
    const up = () => { drawModeRef.current = null; };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  const selectedAlgo = algos.find((a) => a.key === algo)!;

  const clearViz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (clockRef.current) clearInterval(clockRef.current);
    genRef.current = null;
    setRunning(false);
    setDone(false);
    setVisitedCount(0);
    setPathLength(0);
    setElapsed(0);
    setGrid((prev) => prev.map((row) => row.map((c) => ({ ...c, visual: 'none' as CellVisual }))));
  }, []);

  const reset = useCallback(() => {
    clearViz();
    setGrid(createGrid());
  }, [clearViz]);

  const maze = useCallback(() => {
    clearViz();
    setGrid(generateMaze());
  }, [clearViz]);

  const step = useCallback(() => {
    if (!genRef.current) return;
    const result = genRef.current.next();
    if (result.done) {
      setRunning(false);
      setDone(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
      return;
    }
    const { kind, row, col } = result.value;
    setGrid((prev) => {
      const next = [...prev];
      next[row] = [...prev[row]];
      if (kind === 'path') {
        next[row][col] = { ...prev[row][col], visual: 'path' };
      } else if (prev[row][col].type === 'empty') {
        next[row][col] = { ...prev[row][col], visual: 'visited' };
      }
      return next;
    });
    if (kind === 'visit') setVisitedCount((v) => v + 1);
    if (kind === 'path') setPathLength((p) => p + 1);
  }, []);

  const play = useCallback(() => {
    if (done) return;
    setRunning(true);
    if (!genRef.current) {
      setGrid((prev) => {
        const cleaned = prev.map((row) => row.map((c) => ({ ...c, visual: 'none' as CellVisual })));
        genRef.current = getGenerator(algo, cleaned);
        return cleaned;
      });
      setVisitedCount(0);
      setPathLength(0);
      setElapsed(0);
    }
    if (clockRef.current) clearInterval(clockRef.current);
    clockRef.current = setInterval(() => setElapsed((t) => t + 10), 10);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => step(), speeds[speedIdx].ms);
  }, [done, step, speedIdx, algo]);

  const pause = useCallback(() => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (clockRef.current) clearInterval(clockRef.current);
  }, []);

  // Speed change while running
  useEffect(() => {
    if (!runningRef.current || !timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => step(), speeds[speedIdx].ms);
  }, [speedIdx, step]);

  // Reset viz when algo changes
  useEffect(() => { clearViz(); }, [algo, clearViz]);

  /* ── Wall drawing ── */
  const handleMouseDown = useCallback(
    (r: number, c: number) => {
      if (running || done) return;
      const cell = gridRef.current[r][c];
      if (cell.type === 'start' || cell.type === 'end') return;
      const newType: CellType = cell.type === 'wall' ? 'empty' : 'wall';
      drawModeRef.current = newType === 'wall' ? 'add' : 'remove';
      setGrid((prev) => {
        const next = [...prev];
        next[r] = [...prev[r]];
        next[r][c] = { ...prev[r][c], type: newType };
        return next;
      });
    },
    [running, done],
  );

  const handleMouseEnter = useCallback(
    (r: number, c: number) => {
      if (!drawModeRef.current || running || done) return;
      const cell = gridRef.current[r][c];
      if (cell.type === 'start' || cell.type === 'end') return;
      const target: CellType = drawModeRef.current === 'add' ? 'wall' : 'empty';
      if (cell.type === target) return;
      setGrid((prev) => {
        const next = [...prev];
        next[r] = [...prev[r]];
        next[r][c] = { ...prev[r][c], type: target };
        return next;
      });
    },
    [running, done],
  );

  return (
    <PageTransition>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
        {/* Header */}
        <div>
          <Link
            to="/labs"
            className="inline-flex items-center gap-1 text-sm text-surface-400 hover:text-accent transition-colors mb-4"
          >
            <FaArrowLeft /> Labs
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-gradient"
          >
            Pathfinding Visualizer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-400 mt-2"
          >
            격자 위에 벽을 그리고, 탐색 알고리즘이 경로를 찾는 과정을 관찰하세요
          </motion.p>
        </div>

        {/* Algorithm chips */}
        <div className="flex flex-wrap gap-2">
          {algos.map((a) => (
            <button
              key={a.key}
              onClick={() => { if (!running) setAlgo(a.key); }}
              disabled={running}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                algo === a.key
                  ? 'bg-accent/20 text-accent border border-accent/40'
                  : 'glass text-surface-300 hover:text-white border border-transparent'
              } disabled:opacity-50`}
            >
              {a.label}
              <span className="hidden sm:inline text-xs ml-1 opacity-60">— {a.desc}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div
              className="grid gap-px rounded-lg overflow-hidden border border-glass-border select-none mx-auto"
              style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, minWidth: 500 }}
              onContextMenu={(e) => e.preventDefault()}
              onMouseLeave={() => { drawModeRef.current = null; }}
            >
              {grid.flat().map((cell, i) => {
                const r = Math.floor(i / COLS);
                const c = i % COLS;
                return (
                  <div
                    key={i}
                    className={`aspect-square ${cellBg(cell)} transition-colors duration-100 cursor-pointer`}
                    onMouseDown={(e) => { e.preventDefault(); handleMouseDown(r, c); }}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                  />
                );
              })}
            </div>
          </div>
          <p className="text-xs text-surface-500 mt-2 text-center">
            {running || done ? '' : '클릭 & 드래그로 벽을 그리세요'}
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {!running ? (
            <button
              onClick={play}
              disabled={done}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/20 text-accent hover:bg-accent/30 transition disabled:opacity-40"
              aria-label="시작"
            >
              <FaPlay /> 시작
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 transition"
              aria-label="일시정지"
            >
              <FaPause /> 일시정지
            </button>
          )}
          <button
            onClick={clearViz}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-surface-300 hover:text-white transition"
            aria-label="경로 지우기"
          >
            <FaEraser /> 경로 지우기
          </button>
          <button
            onClick={maze}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-surface-300 hover:text-white transition disabled:opacity-40"
            aria-label="미로 생성"
          >
            <FaDice /> 미로 생성
          </button>
          <button
            onClick={reset}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-surface-300 hover:text-white transition disabled:opacity-40"
            aria-label="초기화"
          >
            <FaRedo /> 초기화
          </button>

          <div className="ml-auto flex items-center gap-2 glass rounded-xl px-3 py-1.5">
            <span className="text-xs text-surface-500">속도</span>
            {speeds.map((s, idx) => (
              <button
                key={s.label}
                onClick={() => setSpeedIdx(idx)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                  idx === speedIdx ? 'bg-accent/20 text-accent' : 'text-surface-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <GlassCard className="text-center py-4">
            <div className="text-2xl font-bold text-accent tabular-nums">{visitedCount}</div>
            <div className="text-xs text-surface-500">탐색 노드</div>
          </GlassCard>
          <GlassCard className="text-center py-4">
            <div className="text-2xl font-bold text-secondary tabular-nums">{pathLength}</div>
            <div className="text-xs text-surface-500">경로 길이</div>
          </GlassCard>
          <GlassCard className="text-center py-4">
            <div className="text-2xl font-bold text-yellow-400 tabular-nums font-mono">
              {(elapsed / 1000).toFixed(2)}s
            </div>
            <div className="text-xs text-surface-500">소요 시간</div>
          </GlassCard>
          <GlassCard className="text-center py-4">
            <div className="text-2xl font-bold text-white font-mono">{selectedAlgo.complexity}</div>
            <div className="text-xs text-surface-500">시간 복잡도</div>
          </GlassCard>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-surface-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-accent" /> 시작점
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-secondary" /> 도착점
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-surface-400" /> 벽
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary/50" /> 탐색됨
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-accent/80" /> 경로
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-surface-800 border border-surface-600" /> 빈 칸
          </span>
        </div>
      </section>
    </PageTransition>
  );
}
