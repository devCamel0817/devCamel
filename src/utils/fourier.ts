export interface Point { x: number; y: number }
export interface Epicycle { freq: number; amp: number; phase: number }

export function dft(points: Point[]): Epicycle[] {
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

export function resample(raw: Point[], count: number, closed = false): Point[] {
  if (raw.length < 2) return raw;
  const pts = closed ? [...raw, raw[0]] : [...raw];
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
    const target = closed
      ? (i / count) * total
      : (count === 1 ? 0 : (i / (count - 1)) * total);
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
