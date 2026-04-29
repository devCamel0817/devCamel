import { motion } from 'framer-motion';
import { useSeoulWeather } from '../../hooks/useSeoulWeather';
import { useVisitorPresence } from '../../hooks/useVisitorPresence';
import { useVisitorStats } from '../../hooks/useVisitorStats';

/**
 * 화면 우상단 fixed 위젯.
 * - 모든 페이지에서 보이는 라이브 정보 (날씨 / 실시간 온라인 / 누적 방문자)
 * - lg 이상 화면에서만 노출 (모바일에선 시야 방해)
 * - Navbar(z=40 기준) 바로 아래 떠 있어야 하므로 z-30
 */
export default function StatusOverlay() {
  const { weather } = useSeoulWeather();
  const presence = useVisitorPresence();
  const stats = useVisitorStats();

  const showVisitorRow =
    presence.status !== 'disabled' || stats.status !== 'disabled';

  return (
    <div className="hidden lg:flex pointer-events-none fixed top-20 right-6 flex-col items-end gap-1.5 z-30">
      {/* 1줄: 날씨 */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-2/80 backdrop-blur border border-line shadow-[0_4px_12px_-6px_rgba(42,36,24,0.15)]"
        >
          <span className="text-base leading-none" aria-hidden>{weather.emoji}</span>
          <span className={`font-mono text-[12px] tabular-nums ${weather.accent}`}>
            {Math.round(weather.temperature)}°C
          </span>
          <span className="text-[11px] text-ink-soft">· {weather.label}</span>
        </motion.div>
      )}

      {/* 2줄: 실시간 온라인 + 누적 방문자 */}
      {showVisitorRow && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-2/80 backdrop-blur border border-line shadow-[0_4px_12px_-6px_rgba(42,36,24,0.15)]"
          title="Firebase RTDB · 실시간 접속자 · 일별 unique 방문자"
        >
          {presence.status !== 'disabled' && (
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                {presence.status === 'live' && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    presence.status === 'live'
                      ? 'bg-emerald-500'
                      : presence.status === 'connecting'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                />
              </span>
              <span className="font-mono text-[12px] tabular-nums text-ink">
                {presence.status === 'live' ? presence.count : '—'}
              </span>
              <span className="text-[11px] text-ink-soft">online</span>
            </span>
          )}

          {presence.status !== 'disabled' && stats.status !== 'disabled' && (
            <span className="text-ink-mute/60" aria-hidden>·</span>
          )}

          {stats.status !== 'disabled' && (
            <span className="flex items-center gap-1.5">
              <span aria-hidden>👀</span>
              <span className="font-mono text-[12px] tabular-nums text-ink">
                {stats.status === 'live' ? stats.today.toLocaleString() : '—'}
              </span>
              <span className="text-[11px] text-ink-soft">today</span>
              <span className="text-ink-mute/60" aria-hidden>/</span>
              <span className="font-mono text-[12px] tabular-nums text-ink-soft">
                {stats.status === 'live' ? stats.total.toLocaleString() : '—'}
              </span>
              <span className="text-[11px] text-ink-soft">total</span>
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
