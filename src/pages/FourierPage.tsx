import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPen, FaPause, FaPlay } from 'react-icons/fa';
import { PageTransition } from '../components/ui';

/* ── Types ── */
interface Point { x: number; y: number }
interface Epicycle { freq: number; amp: number; phase: number }

/* ── DFT ── */
function dft(points: Point[]): Epicycle[] {
  const N = points.length;
  const result: Epicycle[] = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const θ = (2 * Math.PI * k * n) / N;
      re += points[n].x * Math.cos(θ) + points[n].y * Math.sin(θ);
      im += points[n].y * Math.cos(θ) - points[n].x * Math.sin(θ);
    }
    re /= N;
    im /= N;
    result.push({
      freq: k > N / 2 ? k - N : k,
      amp: Math.sqrt(re * re + im * im),
      phase: Math.atan2(im, re),
    });
  }
  return result.sort((a, b) => b.amp - a.amp);
}

/* ── Resample closed path to N evenly-spaced points ── */
function resample(raw: Point[], count: number): Point[] {
  if (raw.length < 2) return raw;
  const pts = [...raw, raw[0]];
  const dists = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    dists.push(dists[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const total = dists[dists.length - 1];
  if (total === 0) return raw;
  const result: Point[] = [];
  let seg = 0;
  for (let i = 0; i < count; i++) {
    const target = (i / count) * total;
    while (seg < pts.length - 2 && dists[seg + 1] < target) seg++;
    const segLen = dists[seg + 1] - dists[seg];
    const t = segLen > 0 ? (target - dists[seg]) / segLen : 0;
    result.push({
      x: pts[seg].x + t * (pts[seg + 1].x - pts[seg].x),
      y: pts[seg].y + t * (pts[seg + 1].y - pts[seg].y),
    });
  }
  return result;
}

/* ── Preset shapes (centered at origin) ── */
function starShape(r = 120): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (Math.PI / 5) * i;
    const rad = i % 2 === 0 ? r : r * 0.45;
    pts.push({ x: rad * Math.cos(angle), y: rad * Math.sin(angle) });
  }
  return pts;
}

function heartShape(scale = 7): Point[] {
  const pts: Point[] = [];
  for (let t = 0; t < 2 * Math.PI; t += 0.03) {
    pts.push({
      x: scale * 16 * Math.sin(t) ** 3,
      y: -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    });
  }
  return pts;
}

function infinityShape(a = 120): Point[] {
  const pts: Point[] = [];
  for (let t = 0; t < 2 * Math.PI; t += 0.03) {
    const d = 1 + Math.sin(t) ** 2;
    pts.push({ x: (a * Math.cos(t)) / d, y: (a * Math.sin(t) * Math.cos(t)) / d });
  }
  return pts;
}

/* ── Constants ── */
const SAMPLE_COUNT = 256;
const CYCLE_MS = 8000;
const SPEEDS = [
  { label: '0.5x', factor: 0.5 },
  { label: '1x', factor: 1 },
  { label: '2x', factor: 2 },
  { label: '4x', factor: 4 },
];

/* ── Component ── */
export default function FourierPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'draw' | 'animate'>('draw');
  const [paused, setPaused] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [numCircles, setNumCircles] = useState(SAMPLE_COUNT);
  const [maxCircles, setMaxCircles] = useState(SAMPLE_COUNT);

  /* mutable refs for animation loop (no re-render) */
  const coeffsRef = useRef<Epicycle[]>([]);
  const originalRef = useRef<Point[]>([]);
  const trailRef = useRef<Point[]>([]);
  const rafRef = useRef(0);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const circlesRef = useRef(SAMPLE_COUNT);
  const modeRef = useRef<'draw' | 'animate'>('draw');

  const isDrawingRef = useRef(false);
  const rawRef = useRef<Point[]>([]);
  const drawCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { speedRef.current = SPEEDS[speedIdx].factor; }, [speedIdx]);
  useEffect(() => { circlesRef.current = numCircles; }, [numCircles]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  /* ── Canvas helpers ── */
  const setupCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return { ctx: null as CanvasRenderingContext2D | null, w: 0, h: 0 };
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    return { ctx, w: r.width, h: r.height };
  }, []);

  const drawPrompt = useCallback(() => {
    const { ctx, w, h } = setupCanvas();
    if (!ctx) return;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✏️ 여기에 그림을 그려주세요', w / 2, h / 2);
  }, [setupCanvas]);

  /* ── Drawing handlers ── */
  const getPos = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): Point => {
      const r = e.currentTarget.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (modeRef.current !== 'draw') return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const { ctx, w, h } = setupCanvas();
      if (!ctx) return;
      drawCtxRef.current = ctx;
      ctx.clearRect(0, 0, w, h);
      const p = getPos(e);
      isDrawingRef.current = true;
      rawRef.current = [p];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    },
    [setupCanvas, getPos],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || !drawCtxRef.current) return;
      const p = getPos(e);
      rawRef.current.push(p);
      drawCtxRef.current.lineTo(p.x, p.y);
      drawCtxRef.current.stroke();
    },
    [getPos],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (rawRef.current.length < 10) {
      drawPrompt();
      return;
    }
    startAnim(rawRef.current);
  }, []);

  /* ── Start animation ── */
  const startAnim = useCallback(
    (input: Point[], centered = false) => {
      const c = canvasRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      let pts: Point[];
      if (centered) {
        pts = input;
      } else {
        const cx = input.reduce((s, p) => s + p.x, 0) / input.length;
        const cy = input.reduce((s, p) => s + p.y, 0) / input.length;
        pts = input.map((p) => ({ x: p.x - cx, y: p.y - cy }));
      }

      const maxR = Math.max(...pts.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))));
      const limit = Math.min(w, h) * 0.35;
      if (maxR > limit && maxR > 0) {
        const s = limit / maxR;
        pts = pts.map((p) => ({ x: p.x * s, y: p.y * s }));
      }

      const sampled = resample(pts, SAMPLE_COUNT);
      originalRef.current = sampled;
      const coeffs = dft(sampled);
      coeffsRef.current = coeffs;
      trailRef.current = [];
      accRef.current = 0;
      lastRef.current = performance.now();

      setMaxCircles(coeffs.length);
      setNumCircles(coeffs.length);
      circlesRef.current = coeffs.length;
      setPaused(false);
      pausedRef.current = false;
      setMode('animate');
      modeRef.current = 'animate';

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    },
    [],
  );

  /* ── Animation loop ── */
  const animate = useCallback(() => {
    const c = canvasRef.current;
    if (!c || modeRef.current !== 'animate') return;

    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(rect.width * dpr);
    if (c.width !== targetW) {
      c.width = rect.width * dpr;
      c.height = rect.height * dpr;
    }
    const ctx = c.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width;
    const h = rect.height;

    /* Time */
    const now = performance.now();
    const delta = now - lastRef.current;
    lastRef.current = now;
    const prevAcc = accRef.current;
    if (!pausedRef.current) accRef.current += delta * speedRef.current;
    const prevCycle = Math.floor(prevAcc / CYCLE_MS);
    const curCycle = Math.floor(accRef.current / CYCLE_MS);
    if (curCycle > prevCycle) trailRef.current = [];
    const t = ((accRef.current % CYCLE_MS) / CYCLE_MS) * 2 * Math.PI;

    ctx.clearRect(0, 0, w, h);

    /* Ghost original */
    const orig = originalRef.current;
    if (orig.length > 1) {
      ctx.beginPath();
      ctx.moveTo(orig[0].x + w / 2, orig[0].y + h / 2);
      for (let i = 1; i < orig.length; i++) ctx.lineTo(orig[i].x + w / 2, orig[i].y + h / 2);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* Epicycles */
    const coeffs = coeffsRef.current;
    const nc = Math.min(circlesRef.current, coeffs.length);
    let x = 0, y = 0;
    for (let i = 0; i < nc; i++) {
      const { freq, amp, phase } = coeffs[i];
      const px = x, py = y;
      const angle = freq * t + phase;
      x += amp * Math.cos(angle);
      y += amp * Math.sin(angle);

      const alpha = Math.max(0.04, 0.25 * (1 - i / nc));
      ctx.beginPath();
      ctx.arc(px + w / 2, py + h / 2, amp, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(45,212,191,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(px + w / 2, py + h / 2);
      ctx.lineTo(x + w / 2, y + h / 2);
      ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.08, 0.35 * (1 - i / nc))})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* Tip glow */
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, 8);
    glow.addColorStop(0, 'rgba(212,113,94,0.9)');
    glow.addColorStop(1, 'rgba(212,113,94,0)');
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 8, 0, 2 * Math.PI);
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#d4715e';
    ctx.fill();

    /* Trail */
    if (!pausedRef.current) trailRef.current.push({ x, y });
    const trail = trailRef.current;
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(trail[0].x + w / 2, trail[0].y + h / 2);
      for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x + w / 2, trail[i].y + h / 2);
      ctx.strokeStyle = '#c4956a';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  /* Cleanup */
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* Draw mode init */
  useEffect(() => {
    if (mode === 'draw') drawPrompt();
  }, [mode, drawPrompt]);

  /* ── Controls ── */
  const togglePause = useCallback(() => {
    if (pausedRef.current) {
      lastRef.current = performance.now();
      setPaused(false);
      pausedRef.current = false;
    } else {
      setPaused(true);
      pausedRef.current = true;
    }
  }, []);

  const resetDraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    trailRef.current = [];
    coeffsRef.current = [];
    setMode('draw');
    modeRef.current = 'draw';
    setPaused(false);
    pausedRef.current = false;
  }, []);

  const loadPreset = useCallback(
    (gen: () => Point[]) => {
      cancelAnimationFrame(rafRef.current);
      startAnim(gen(), true);
    },
    [startAnim],
  );

  const presetBtns = (size: 'sm' | 'md') => {
    const cls =
      size === 'md'
        ? 'px-5 py-2.5 rounded-xl glass text-surface-300 hover:text-white hover:border-primary/50 transition'
        : 'px-3 py-1.5 rounded-lg text-xs glass text-surface-400 hover:text-white transition';
    return (
      <>
        <button onClick={() => loadPreset(starShape)} className={cls}>⭐ 별</button>
        <button onClick={() => loadPreset(heartShape)} className={cls}>❤️ 하트</button>
        <button onClick={() => loadPreset(infinityShape)} className={cls}>∞ 무한대</button>
      </>
    );
  };

  return (
    <PageTransition>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">
        {/* Header */}
        <div>
          <Link to="/labs" className="inline-flex items-center gap-1 text-sm text-surface-400 hover:text-accent transition-colors mb-4">
            <FaArrowLeft /> Labs
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-bold text-gradient">
            Fourier Transform
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-surface-400 mt-2">
            그림을 그리면 회전하는 원들이 그대로 따라 그립니다
          </motion.p>
        </div>

        {/* Canvas */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <canvas
            ref={canvasRef}
            className={`w-full h-[300px] sm:h-[420px] lg:h-[500px] rounded-xl border border-glass-border bg-surface-900 ${mode === 'draw' ? 'cursor-crosshair' : 'cursor-default'}`}
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        </motion.div>

        {/* Controls */}
        <AnimatePresence mode="wait">
          {mode === 'draw' ? (
            <motion.div key="draw" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-center text-surface-400 text-sm">프리셋을 선택하거나 캔버스에 직접 그려보세요</p>
              <div className="flex flex-wrap justify-center gap-3">{presetBtns('md')}</div>
            </motion.div>
          ) : (
            <motion.div key="anim" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={togglePause} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/20 text-accent hover:bg-accent/30 transition" aria-label={paused ? '재생' : '일시정지'}>
                  {paused ? <><FaPlay /> 재생</> : <><FaPause /> 일시정지</>}
                </button>
                <button onClick={resetDraw} className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-surface-300 hover:text-white transition" aria-label="다시 그리기">
                  <FaPen /> 다시 그리기
                </button>
                <div className="ml-auto flex items-center gap-2 glass rounded-xl px-3 py-1.5">
                  <span className="text-xs text-surface-500">속도</span>
                  {SPEEDS.map((s, idx) => (
                    <button key={s.label} onClick={() => setSpeedIdx(idx)} className={`px-2 py-1 rounded-lg text-xs font-medium transition ${idx === speedIdx ? 'bg-accent/20 text-accent' : 'text-surface-400 hover:text-white'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 glass rounded-xl px-4 py-3">
                <span className="text-sm text-surface-400 whitespace-nowrap">원 개수</span>
                <input
                  type="range"
                  min={1}
                  max={maxCircles}
                  value={numCircles}
                  onChange={(e) => setNumCircles(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-surface-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-sm text-accent tabular-nums font-mono w-14 text-right">{numCircles}개</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-surface-500">프리셋:</span>
                {presetBtns('sm')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}
