import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaRandom, FaArrowLeft } from 'react-icons/fa';
import { PageTransition, GlassCard } from '../components/ui';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';

interface Bar {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

interface SortStep {
  bars: Bar[];
  comparisons: number;
  swaps: number;
}

const algorithms: { key: SortAlgorithm; label: string; desc: string; complexity: string }[] = [
  { key: 'bubble', label: 'Bubble Sort', desc: '인접한 두 원소를 비교하여 교환', complexity: 'O(n²)' },
  { key: 'selection', label: 'Selection Sort', desc: '최솟값을 찾아 맨 앞으로 이동', complexity: 'O(n²)' },
  { key: 'insertion', label: 'Insertion Sort', desc: '정렬된 부분에 올바른 위치 삽입', complexity: 'O(n²)' },
  { key: 'quick', label: 'Quick Sort', desc: '피벗 기준 분할 정복', complexity: 'O(n log n)' },
  { key: 'merge', label: 'Merge Sort', desc: '분할 후 병합하며 정렬', complexity: 'O(n log n)' },
];

function generateBars(count: number): Bar[] {
  const arr: Bar[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({ value: Math.floor(Math.random() * 90) + 10, state: 'default' });
  }
  return arr;
}

// ===== Sort step generators =====

function* bubbleSortSteps(input: Bar[]): Generator<SortStep> {
  const bars = input.map((b) => ({ ...b }));
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < bars.length - 1; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      bars[j].state = 'comparing';
      bars[j + 1].state = 'comparing';
      comparisons++;
      yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };

      if (bars[j].value > bars[j + 1].value) {
        bars[j].state = 'swapping';
        bars[j + 1].state = 'swapping';
        yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
        [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
        swaps++;
      }
      bars[j].state = 'default';
      bars[j + 1].state = 'default';
    }
    bars[bars.length - 1 - i].state = 'sorted';
  }
  bars[0].state = 'sorted';
  yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
}

function* selectionSortSteps(input: Bar[]): Generator<SortStep> {
  const bars = input.map((b) => ({ ...b }));
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < bars.length - 1; i++) {
    let minIdx = i;
    bars[i].state = 'pivot';
    yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };

    for (let j = i + 1; j < bars.length; j++) {
      bars[j].state = 'comparing';
      comparisons++;
      yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
      if (bars[j].value < bars[minIdx].value) {
        if (minIdx !== i) bars[minIdx].state = 'default';
        minIdx = j;
        bars[minIdx].state = 'pivot';
      } else {
        bars[j].state = 'default';
      }
    }

    if (minIdx !== i) {
      bars[i].state = 'swapping';
      bars[minIdx].state = 'swapping';
      yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
      [bars[i], bars[minIdx]] = [bars[minIdx], bars[i]];
      swaps++;
    }
    for (let k = i + 1; k < bars.length; k++) bars[k].state = 'default';
    bars[i].state = 'sorted';
  }
  bars[bars.length - 1].state = 'sorted';
  yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
}

function* insertionSortSteps(input: Bar[]): Generator<SortStep> {
  const bars = input.map((b) => ({ ...b }));
  let comparisons = 0;
  let swaps = 0;

  bars[0].state = 'sorted';
  yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };

  for (let i = 1; i < bars.length; i++) {
    const key = { ...bars[i] };
    bars[i].state = 'comparing';
    yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };

    let j = i - 1;
    while (j >= 0 && bars[j].value > key.value) {
      comparisons++;
      bars[j].state = 'swapping';
      yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
      bars[j + 1] = { ...bars[j] };
      bars[j].state = 'sorted';
      swaps++;
      j--;
    }
    comparisons++;
    bars[j + 1] = { ...key, state: 'sorted' };
    yield { bars: bars.map((b) => ({ ...b })), comparisons, swaps };
  }
  yield { bars: bars.map((b) => ({ ...b, state: 'sorted' })), comparisons, swaps };
}

function* quickSortSteps(
  bars: Bar[],
  low: number,
  high: number,
  stats: { comparisons: number; swaps: number },
): Generator<SortStep> {
  if (low < high) {
    // Partition
    const pivotVal = bars[high].value;
    bars[high].state = 'pivot';
    yield { bars: bars.map((b) => ({ ...b })), ...stats };

    let i = low - 1;
    for (let j = low; j < high; j++) {
      bars[j].state = 'comparing';
      stats.comparisons++;
      yield { bars: bars.map((b) => ({ ...b })), ...stats };

      if (bars[j].value <= pivotVal) {
        i++;
        if (i !== j) {
          bars[i].state = 'swapping';
          bars[j].state = 'swapping';
          yield { bars: bars.map((b) => ({ ...b })), ...stats };
          [bars[i], bars[j]] = [bars[j], bars[i]];
          stats.swaps++;
        }
      }
      if (bars[j].state !== 'sorted') bars[j].state = 'default';
      if (i >= 0 && bars[i].state !== 'sorted') bars[i].state = 'default';
    }

    i++;
    [bars[i], bars[high]] = [bars[high], bars[i]];
    stats.swaps++;
    bars[i].state = 'sorted';
    yield { bars: bars.map((b) => ({ ...b })), ...stats };

    // Reset non-sorted
    for (let k = low; k <= high; k++) {
      if (bars[k].state !== 'sorted') bars[k].state = 'default';
    }

    yield* quickSortSteps(bars, low, i - 1, stats);
    yield* quickSortSteps(bars, i + 1, high, stats);
  } else if (low === high) {
    bars[low].state = 'sorted';
    yield { bars: bars.map((b) => ({ ...b })), ...stats };
  }
}

function* mergeSortSteps(
  bars: Bar[],
  left: number,
  right: number,
  stats: { comparisons: number; swaps: number },
): Generator<SortStep> {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    yield* mergeSortSteps(bars, left, mid, stats);
    yield* mergeSortSteps(bars, mid + 1, right, stats);

    // Merge
    const temp: Bar[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      bars[i].state = 'comparing';
      bars[j].state = 'comparing';
      stats.comparisons++;
      yield { bars: bars.map((b) => ({ ...b })), ...stats };

      if (bars[i].value <= bars[j].value) {
        temp.push({ ...bars[i], state: 'default' });
        bars[i].state = 'default';
        i++;
      } else {
        temp.push({ ...bars[j], state: 'default' });
        bars[j].state = 'default';
        j++;
        stats.swaps++;
      }
    }
    while (i <= mid) { temp.push({ ...bars[i], state: 'default' }); i++; }
    while (j <= right) { temp.push({ ...bars[j], state: 'default' }); j++; }

    for (let k = 0; k < temp.length; k++) {
      bars[left + k] = { ...temp[k], state: 'swapping' };
    }
    yield { bars: bars.map((b) => ({ ...b })), ...stats };

    for (let k = left; k <= right; k++) {
      bars[k].state = 'default';
    }
  } else if (left === right && left === 0 || right === bars.length - 1) {
    // single element
  }

  // Check if fully sorted
  if (left === 0 && right === bars.length - 1) {
    for (let k = 0; k < bars.length; k++) bars[k].state = 'sorted';
    yield { bars: bars.map((b) => ({ ...b })), ...stats };
  }
}

function getStepGenerator(algo: SortAlgorithm, bars: Bar[]): Generator<SortStep> {
  const copy = bars.map((b) => ({ ...b }));
  switch (algo) {
    case 'bubble': return bubbleSortSteps(copy);
    case 'selection': return selectionSortSteps(copy);
    case 'insertion': return insertionSortSteps(copy);
    case 'quick': return quickSortSteps(copy, 0, copy.length - 1, { comparisons: 0, swaps: 0 });
    case 'merge': return mergeSortSteps(copy, 0, copy.length - 1, { comparisons: 0, swaps: 0 });
  }
}

// ===== Color util =====

function barColor(state: Bar['state']) {
  switch (state) {
    case 'comparing': return 'bg-accent';
    case 'swapping': return 'bg-secondary';
    case 'sorted': return 'bg-primary';
    case 'pivot': return 'bg-yellow-400';
    default: return 'bg-surface-500';
  }
}

// ===== Component =====

const DEFAULT_COUNT = 30;
const SPEED_OPTIONS = [
  { label: '0.5x', ms: 120 },
  { label: '1x', ms: 60 },
  { label: '2x', ms: 30 },
  { label: '4x', ms: 10 },
];

export default function SortingPage() {
  const [algo, setAlgo] = useState<SortAlgorithm>('bubble');
  const [barCount, setBarCount] = useState(DEFAULT_COUNT);
  const [bars, setBars] = useState<Bar[]>(() => generateBars(DEFAULT_COUNT));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const genRef = useRef<Generator<SortStep> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barsRef = useRef(bars);
  const runningRef = useRef(running);

  useEffect(() => { barsRef.current = bars; }, [bars]);
  useEffect(() => { runningRef.current = running; }, [running]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    genRef.current = null;
    const newBars = generateBars(barCount);
    setBars(newBars);
    setRunning(false);
    setDone(false);
    setComparisons(0);
    setSwaps(0);
    setElapsed(0);
    if (clockRef.current) clearInterval(clockRef.current);
  }, [barCount]);

  const shuffle = useCallback(() => {
    reset();
  }, [reset]);

  const step = useCallback(() => {
    if (!genRef.current) {
      genRef.current = getStepGenerator(algo, barsRef.current);
    }
    const next = genRef.current.next();
    if (next.done) {
      setRunning(false);
      setDone(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
      return;
    }
    setBars(next.value.bars);
    setComparisons(next.value.comparisons);
    setSwaps(next.value.swaps);
  }, [algo]);

  const play = useCallback(() => {
    if (done) return;
    setRunning(true);
    if (clockRef.current) clearInterval(clockRef.current);
    clockRef.current = setInterval(() => setElapsed((t) => t + 10), 10);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!runningRef.current) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      step();
    }, SPEED_OPTIONS[speedIdx].ms);
  }, [done, step, speedIdx]);

  const pause = useCallback(() => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (clockRef.current) clearInterval(clockRef.current);
  }, []);

  // Restart interval when speed changes while running
  useEffect(() => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        step();
      }, SPEED_OPTIONS[speedIdx].ms);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [speedIdx, running, step]);

  // Reset when algo changes
  useEffect(() => {
    reset();
  }, [algo, reset]);

  const selectedAlgo = algorithms.find((a) => a.key === algo)!;

  return (
    <PageTransition>
      <section className="section-padding">
        <div className="container-narrow px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-12"
          >
            <Link to="/labs" className="inline-flex items-center gap-1 text-sm text-surface-400 hover:text-accent transition-colors mb-4">
              <FaArrowLeft /> Labs
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              정렬 알고리즘 <span className="text-gradient">시각화</span>
            </h1>
            <p className="text-surface-400 max-w-xl mx-auto">
              다양한 정렬 알고리즘의 동작 원리를 시각적으로 확인하세요.
            </p>
          </motion.div>

          {/* Algorithm selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {algorithms.map((a) => (
              <button
                key={a.key}
                onClick={() => setAlgo(a.key)}
                disabled={running}
                className={`px-4 py-2 text-sm rounded-xl transition-colors disabled:opacity-50 ${
                  algo === a.key
                    ? 'bg-primary text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-white border border-glass-border'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Info card */}
          <motion.div
            key={algo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="text-sm text-surface-400">{selectedAlgo.desc}</span>
            <span className="mx-2 text-surface-600">·</span>
            <span className="text-sm text-accent font-mono">{selectedAlgo.complexity}</span>
          </motion.div>

          {/* Visualization */}
          <GlassCard className="mb-6">
            <div className="flex items-end justify-center gap-[2px] sm:gap-1 h-64 sm:h-80">
              {bars.map((bar, i) => (
                <motion.div
                  key={i}
                  className={`rounded-t-sm ${barColor(bar.state)} transition-colors duration-100`}
                  style={{
                    height: `${bar.value}%`,
                    width: `${100 / bars.length}%`,
                    maxWidth: '20px',
                  }}
                  layout
                  transition={{ duration: 0.05 }}
                />
              ))}
            </div>
          </GlassCard>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {!running ? (
                <button
                  onClick={play}
                  disabled={done}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <FaPlay size={12} /> 실행
                </button>
              ) : (
                <button
                  onClick={pause}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  <FaPause size={12} /> 일시정지
                </button>
              )}
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-800 text-surface-400 text-sm font-medium border border-glass-border hover:text-white transition-colors"
              >
                <FaRedo size={12} /> 초기화
              </button>
              <button
                onClick={shuffle}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-800 text-surface-400 text-sm font-medium border border-glass-border hover:text-white transition-colors"
              >
                <FaRandom size={12} /> 셔플
              </button>
            </div>

            {/* Speed */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-surface-500 mr-2">속도</span>
              {SPEED_OPTIONS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSpeedIdx(i)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    speedIdx === i
                      ? 'bg-accent text-white'
                      : 'bg-surface-800 text-surface-400 border border-glass-border hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Count */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500">개수</span>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={barCount}
                disabled={running}
                onChange={(e) => { setBarCount(Number(e.target.value)); }}
                className="w-24 h-1.5 rounded-full appearance-none bg-surface-700 cursor-pointer disabled:opacity-40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-xs text-primary tabular-nums font-mono w-6 text-right">{barCount}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <GlassCard className="text-center py-4">
              <div className="text-2xl font-bold text-accent tabular-nums">{comparisons}</div>
              <div className="text-xs text-surface-500">비교 횟수</div>
            </GlassCard>
            <GlassCard className="text-center py-4">
              <div className="text-2xl font-bold text-secondary tabular-nums">{swaps}</div>
              <div className="text-xs text-surface-500">교환 횟수</div>
            </GlassCard>
            <GlassCard className="text-center py-4">
              <div className="text-2xl font-bold text-yellow-400 tabular-nums font-mono">{(elapsed / 1000).toFixed(2)}s</div>
              <div className="text-xs text-surface-500">소요 시간</div>
            </GlassCard>
            <GlassCard className="text-center py-4">
              <div className="text-2xl font-bold text-primary tabular-nums">{barCount}</div>
              <div className="text-xs text-surface-500">데이터 수</div>
            </GlassCard>
            <GlassCard className="text-center py-4">
              <div className="text-2xl font-bold text-white font-mono">{selectedAlgo.complexity}</div>
              <div className="text-xs text-surface-500">시간 복잡도</div>
            </GlassCard>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-surface-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-surface-500" /> 기본</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent" /> 비교 중</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-secondary" /> 교환</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400" /> 피벗</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" /> 정렬 완료</span>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
