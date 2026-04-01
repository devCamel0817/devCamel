import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPause, FaPlay, FaRedo } from 'react-icons/fa';
import { PageTransition, GlassCard } from '../components/ui';

/* ── Types ── */
interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/* ── Constants ── */
const BOID_COUNT = 200;
const MAX_SPEED = 3;
const VISUAL_RANGE = 75;
const TRAIL_ALPHA = 0.12;

const PRESETS: Record<string, { separation: number; alignment: number; cohesion: number }> = {
  balanced: { separation: 1, alignment: 1, cohesion: 1 },
  swarm: { separation: 0.3, alignment: 0.2, cohesion: 2.5 },
  scatter: { separation: 3, alignment: 0.3, cohesion: 0.2 },
  school: { separation: 0.8, alignment: 2.5, cohesion: 0.8 },
};

/* ── Helpers ── */
function clampSpeed(boid: Boid) {
  const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
  if (speed > MAX_SPEED) {
    boid.vx = (boid.vx / speed) * MAX_SPEED;
    boid.vy = (boid.vy / speed) * MAX_SPEED;
  }
  if (speed < 1) {
    boid.vx = (boid.vx / (speed || 1)) * 1;
    boid.vy = (boid.vy / (speed || 1)) * 1;
  }
}

function createBoids(w: number, h: number, count: number): Boid[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * MAX_SPEED * 2,
    vy: (Math.random() - 0.5) * MAX_SPEED * 2,
  }));
}

/* ── Component ── */
export default function BoidsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boidsRef = useRef<Boid[]>([]);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);

  const [paused, setPaused] = useState(false);
  const [separation, setSeparation] = useState(1);
  const [alignment, setAlignment] = useState(1);
  const [cohesion, setCohesion] = useState(1);
  const [count, setCount] = useState(BOID_COUNT);

  /* Refs for animation access without re-render */
  const sepRef = useRef(separation);
  const aliRef = useRef(alignment);
  const cohRef = useRef(cohesion);

  useEffect(() => { sepRef.current = separation; }, [separation]);
  useEffect(() => { aliRef.current = alignment; }, [alignment]);
  useEffect(() => { cohRef.current = cohesion; }, [cohesion]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  /* ── Init boids ── */
  const initBoids = useCallback((n: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    boidsRef.current = createBoids(r.width, r.height, n);
  }, []);

  /* ── Simulation step ── */
  const simulate = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const boids = boidsRef.current;
    const sepW = sepRef.current;
    const aliW = aliRef.current;
    const cohW = cohRef.current;

    for (let i = 0; i < boids.length; i++) {
      const b = boids[i];
      let sx = 0, sy = 0; // separation
      let ax = 0, ay = 0; // alignment
      let cx = 0, cy = 0; // cohesion
      let neighbors = 0;
      let closeCnt = 0;

      for (let j = 0; j < boids.length; j++) {
        if (i === j) continue;
        const o = boids[j];
        const dx = o.x - b.x;
        const dy = o.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < VISUAL_RANGE) {
          // Alignment + Cohesion
          ax += o.vx;
          ay += o.vy;
          cx += o.x;
          cy += o.y;
          neighbors++;

          // Separation (closer = stronger)
          if (dist < VISUAL_RANGE * 0.4) {
            sx -= dx / (dist || 1);
            sy -= dy / (dist || 1);
            closeCnt++;
          }
        }
      }

      if (neighbors > 0) {
        // Alignment: steer towards average heading
        ax /= neighbors;
        ay /= neighbors;
        b.vx += (ax - b.vx) * 0.05 * aliW;
        b.vy += (ay - b.vy) * 0.05 * aliW;

        // Cohesion: steer towards average position
        cx = cx / neighbors - b.x;
        cy = cy / neighbors - b.y;
        b.vx += cx * 0.005 * cohW;
        b.vy += cy * 0.005 * cohW;
      }

      if (closeCnt > 0) {
        // Separation: steer away from close neighbors
        b.vx += sx * 0.15 * sepW;
        b.vy += sy * 0.15 * sepW;
      }

      // Edge wrapping
      const margin = 50;
      const turnFactor = 0.3;
      if (b.x < margin) b.vx += turnFactor;
      if (b.x > W - margin) b.vx -= turnFactor;
      if (b.y < margin) b.vy += turnFactor;
      if (b.y > H - margin) b.vy -= turnFactor;

      clampSpeed(b);

      b.x += b.vx;
      b.y += b.vy;

      // Wrap
      if (b.x < -10) b.x = W + 10;
      if (b.x > W + 10) b.x = -10;
      if (b.y < -10) b.y = H + 10;
      if (b.y > H + 10) b.y = -10;
    }
  }, []);

  /* ── Render ── */
  const render = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    if (c.width !== Math.round(w * dpr)) {
      c.width = w * dpr;
      c.height = h * dpr;
    }
    const ctx = c.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Trail effect
    ctx.fillStyle = `rgba(26, 20, 16, ${TRAIL_ALPHA})`;
    ctx.fillRect(0, 0, w, h);

    const boids = boidsRef.current;
    for (const b of boids) {
      const angle = Math.atan2(b.vy, b.vx);
      const size = 6;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);

      // Triangle boid
      ctx.beginPath();
      ctx.moveTo(size * 1.5, 0);
      ctx.lineTo(-size, size * 0.6);
      ctx.lineTo(-size * 0.5, 0);
      ctx.lineTo(-size, -size * 0.6);
      ctx.closePath();

      // Color by speed
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      const ratio = speed / MAX_SPEED;
      const r = Math.round(196 * (1 - ratio) + 45 * ratio);
      const g = Math.round(149 * (1 - ratio) + 212 * ratio);
      const bl = Math.round(106 * (1 - ratio) + 191 * ratio);
      ctx.fillStyle = `rgba(${r},${g},${bl},0.9)`;
      ctx.fill();

      ctx.restore();
    }
  }, []);

  /* ── Animation loop ── */
  const loop = useCallback(() => {
    if (!pausedRef.current) {
      simulate();
    }
    render();
    rafRef.current = requestAnimationFrame(loop);
  }, [simulate, render]);

  /* Start */
  useEffect(() => {
    initBoids(count);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initBoids, loop, count]);

  /* ── Preset apply ── */
  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    setSeparation(p.separation);
    setCohesion(p.cohesion);
    setAlignment(p.alignment);
  };

  const reset = () => {
    applyPreset('balanced');
    setCount(BOID_COUNT);
    initBoids(BOID_COUNT);
  };

  /* ── Slider component ── */
  const Slider = ({
    label,
    value,
    onChange,
    min = 0,
    max = 3,
    step = 0.1,
    color,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    color: string;
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-surface-400 w-20 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`flex-1 h-1.5 rounded-full appearance-none bg-surface-700 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer ${color}`}
      />
      <span className="text-sm text-accent tabular-nums font-mono w-10 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );

  return (
    <PageTransition>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">
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
            Boids Simulation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-400 mt-2"
          >
            3가지 규칙만으로 만들어지는 군집 행동을 관찰하세요
          </motion.p>
        </div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-[300px] sm:h-[420px] lg:h-[500px] rounded-xl border border-glass-border bg-surface-900"
          />
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/20 text-accent hover:bg-accent/30 transition"
            aria-label={paused ? '재생' : '일시정지'}
          >
            {paused ? <><FaPlay /> 재생</> : <><FaPause /> 일시정지</>}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-surface-300 hover:text-white transition"
            aria-label="초기화"
          >
            <FaRedo /> 초기화
          </button>
          <div className="ml-auto flex items-center gap-2">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="px-3 py-1.5 rounded-lg text-xs glass text-surface-400 hover:text-white hover:border-primary/40 transition capitalize"
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <GlassCard className="p-6 space-y-4">
          <Slider
            label="분리 (Separation)"
            value={separation}
            onChange={setSeparation}
            color="[&::-webkit-slider-thumb]:bg-secondary"
          />
          <Slider
            label="정렬 (Alignment)"
            value={alignment}
            onChange={setAlignment}
            color="[&::-webkit-slider-thumb]:bg-accent"
          />
          <Slider
            label="결합 (Cohesion)"
            value={cohesion}
            onChange={setCohesion}
            color="[&::-webkit-slider-thumb]:bg-primary"
          />
          <Slider
            label="개체 수"
            value={count}
            onChange={(v) => {
              setCount(v);
              initBoids(v);
            }}
            min={20}
            max={500}
            step={10}
            color="[&::-webkit-slider-thumb]:bg-white"
          />
        </GlassCard>

        {/* Rules explanation */}
        <div className="grid sm:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <div className="text-secondary text-lg font-bold mb-1">분리</div>
            <p className="text-surface-400 text-xs leading-relaxed">
              가까운 이웃과 부딪히지 않도록 멀어지는 방향으로 조향합니다
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="text-accent text-lg font-bold mb-1">정렬</div>
            <p className="text-surface-400 text-xs leading-relaxed">
              주변 이웃들의 평균 방향을 맞춰 같은 방향으로 이동합니다
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="text-primary text-lg font-bold mb-1">결합</div>
            <p className="text-surface-400 text-xs leading-relaxed">
              주변 이웃들의 무게중심을 향해 모여드는 힘이 작용합니다
            </p>
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
