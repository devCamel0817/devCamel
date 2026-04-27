import { useEffect, useState } from 'react';

/* WMO weather code → 한글 라벨 + 이모지 + 톤(Hero overlay 색)
   https://open-meteo.com/en/docs#api_form */
export interface WeatherInfo {
  code: number;
  label: string;
  emoji: string;
  /** Hero 배경에 깔릴 그라데이션 (Tailwind arbitrary). 너무 진하지 않게. */
  overlay: string;
  /** 강조 텍스트 컬러 토큰 */
  accent: string;
}

function classify(code: number): Pick<WeatherInfo, 'label' | 'emoji' | 'overlay' | 'accent'> {
  // 맑음
  if (code === 0) return {
    label: '맑음', emoji: '☀️',
    overlay: 'radial-gradient(ellipse at top right, rgba(244,200,120,0.22), transparent 60%)',
    accent: 'text-camel-deep',
  };
  // 대체로 맑음 / 부분 흐림
  if (code === 1 || code === 2) return {
    label: '구름 조금', emoji: '🌤️',
    overlay: 'radial-gradient(ellipse at top right, rgba(244,200,120,0.14), transparent 60%)',
    accent: 'text-camel-deep',
  };
  // 흐림
  if (code === 3) return {
    label: '흐림', emoji: '☁️',
    overlay: 'radial-gradient(ellipse at top, rgba(120,130,150,0.18), transparent 60%)',
    accent: 'text-ink-soft',
  };
  // 안개
  if (code === 45 || code === 48) return {
    label: '안개', emoji: '🌫️',
    overlay: 'linear-gradient(to bottom, rgba(200,200,210,0.22), transparent 50%)',
    accent: 'text-ink-soft',
  };
  // 이슬비 / 비
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return {
    label: '비', emoji: '🌧️',
    overlay: 'linear-gradient(to bottom, rgba(80,120,180,0.18), transparent 60%)',
    accent: 'text-blue-700',
  };
  // 눈
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return {
    label: '눈', emoji: '🌨️',
    overlay: 'linear-gradient(to bottom, rgba(190,210,235,0.28), transparent 55%)',
    accent: 'text-blue-700',
  };
  // 천둥
  if (code >= 95) return {
    label: '천둥번개', emoji: '⛈️',
    overlay: 'radial-gradient(ellipse at top, rgba(70,80,110,0.28), transparent 60%)',
    accent: 'text-purple-700',
  };
  return {
    label: '알 수 없음', emoji: '🌡️',
    overlay: 'transparent',
    accent: 'text-ink-soft',
  };
}

interface CurrentWeatherResponse {
  current_weather?: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    time: string;
  };
}

const SEOUL = { lat: 37.5665, lon: 126.978 };
const CACHE_KEY = 'seoul-weather-v1';
const TTL = 10 * 60 * 1000; // 10 min

type CachedWeather = WeatherInfo & { temperature: number; windspeed: number };

function readCache(): CachedWeather | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts < TTL) return parsed.data as CachedWeather;
  } catch { /* ignore */ }
  return null;
}

/** 서울 현재 날씨 — Open-Meteo. API 키 불필요. 10분 캐시 (sessionStorage). */
export function useSeoulWeather(): {
  weather: CachedWeather | null;
  loading: boolean;
} {
  const [data, setData] = useState<CachedWeather | null>(() => readCache());
  const [loading, setLoading] = useState(() => readCache() === null);

  useEffect(() => {
    if (readCache()) return; // 이미 캐시로 채워짐

    const ctrl = new AbortController();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL.lat}&longitude=${SEOUL.lon}&current_weather=true&timezone=Asia%2FSeoul`;

    fetch(url, { signal: ctrl.signal })
      .then((r) => r.json() as Promise<CurrentWeatherResponse>)
      .then((json) => {
        if (!json.current_weather) return;
        const cw = json.current_weather;
        const meta = classify(cw.weathercode);
        const result: CachedWeather = {
          code: cw.weathercode,
          temperature: cw.temperature,
          windspeed: cw.windspeed,
          ...meta,
        };
        setData(result);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: result }));
        } catch { /* ignore */ }
      })
      .catch(() => { /* offline / blocked — silently ignore */ })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  return { weather: data, loading };
}
