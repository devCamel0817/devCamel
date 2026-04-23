export interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const BOID_COUNT = 200;
export const MAX_SPEED = 3;
export const VISUAL_RANGE = 75;
export const TRAIL_ALPHA = 0.12;

export const PRESETS: Record<string, { separation: number; alignment: number; cohesion: number }> = {
  balanced: { separation: 1, alignment: 1, cohesion: 1 },
  swarm: { separation: 0.3, alignment: 0.2, cohesion: 2.5 },
  scatter: { separation: 3, alignment: 0.3, cohesion: 0.2 },
  school: { separation: 0.8, alignment: 2.5, cohesion: 0.8 },
};

export function clampSpeed(boid: Boid) {
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

export function createBoids(w: number, h: number, count: number): Boid[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * MAX_SPEED * 2,
    vy: (Math.random() - 0.5) * MAX_SPEED * 2,
  }));
}
