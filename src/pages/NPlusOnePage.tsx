import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSyncAlt, FaDatabase, FaTrophy, FaBolt } from 'react-icons/fa';
import { PageTransition } from '../components/ui';
import { MacWindow } from '../components/paper';
import { useNplus1Compare } from '../hooks/useNplus1Compare';
import { AUTHOR_COUNT_PRESETS } from '../api/nplus1';
import { API_BASE_URL } from '../api/client';
import type {
  Nplus1CompareResponse,
  Nplus1Result,
  Nplus1VariantValue,
} from '../types/nplus1';

/* ────────────────────────────────────────────────
 * Backend Lab — N+1 vs Fetch Join vs EntityGraph
 * GET /api/nplus1/compare?authorCount=N
 * ──────────────────────────────────────────────── */

const VARIANT_ORDER: Nplus1VariantValue[] = ['n-plus-one', 'fetch-join', 'entity-graph'];

const VARIANT_ACCENT: Record<
  Nplus1VariantValue,
  { bg: string; border: string; text: string; bar: string }
> = {
  'n-plus-one': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', bar: 'bg-rose-500' },
  'fetch-join': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'entity-graph': { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', bar: 'bg-sky-500' },
};

export default function NPlusOnePage() {
  const [authorCount, setAuthorCount] = useState<number>(30);
  const [reloadKey, setReloadKey] = useState(0);
  const state = useNplus1Compare(authorCount, reloadKey);

  return (
    <PageTransition>
      <div className="bg-paper text-ink min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <Link
                to="/labs"
                className="inline-flex items-center gap-1.5 text-[12px] text-ink-soft hover:text-camel-deep mb-2"
              >
                <FaArrowLeft className="text-[10px]" /> Back to Labs
              </Link>
              <div className="font-hand text-camel-deep text-2xl leading-none mb-1">measure</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">
                N+1 vs Fetch Join vs <span className="ink-underline">EntityGraph</span>
              </h1>
            </div>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="px-3 py-2 rounded-md border border-line bg-paper-2 hover:bg-paper-3 text-sm flex items-center gap-2 transition-colors"
              disabled={state.status === 'loading'}
            >
              <FaSyncAlt className={state.status === 'loading' ? 'animate-spin' : ''} />
              다시 측정
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MacWindow title="~/devcamel/labs/jpa-nplus1" bodyClassName="p-6 sm:p-8">
              {/* 컨트롤 */}
              <AuthorCountControl
                value={authorCount}
                onChange={setAuthorCount}
                disabled={state.status === 'loading'}
              />

              <div className="mt-6">
                {state.status === 'loading' && <LoadingBlock />}
                {state.status === 'error' && (
                  <ErrorBlock
                    message={state.message}
                    onRetry={() => setReloadKey((k) => k + 1)}
                  />
                )}
                {state.status === 'ready' && <ReadyBlock data={state.data} />}
              </div>
            </MacWindow>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

/* ─────────────────────── Control ─────────────────────── */

function AuthorCountControl({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState<string>(String(value));

  return (
    <div className="rounded-lg border border-line bg-paper-2/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-mute">
            dataset size
          </div>
          <div className="text-sm font-bold text-ink">authorCount</div>
        </div>
        <div className="text-[11px] text-ink-soft font-mono">range 1 ~ 200</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {AUTHOR_COUNT_PRESETS.map((n) => {
          const active = n === value;
          return (
            <button
              key={n}
              disabled={disabled}
              onClick={() => {
                setDraft(String(n));
                onChange(n);
              }}
              className={[
                'px-3 py-1.5 rounded-md text-sm font-mono border transition-colors',
                active
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper border-line text-ink-soft hover:bg-paper-3 hover:text-ink',
                disabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {n}
            </button>
          );
        })}

        <form
          className="flex items-center gap-2 ml-auto"
          onSubmit={(e) => {
            e.preventDefault();
            const n = clamp(parseInt(draft, 10) || 0, 1, 200);
            setDraft(String(n));
            if (n !== value) onChange(n);
          }}
        >
          <input
            type="number"
            min={1}
            max={200}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={disabled}
            className="w-20 px-2 py-1.5 rounded-md border border-line bg-paper text-sm font-mono text-ink focus:outline-none focus:border-camel-deep"
          />
          <button
            type="submit"
            disabled={disabled}
            className="px-3 py-1.5 rounded-md text-sm bg-camel-deep text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            적용
          </button>
        </form>
      </div>
    </div>
  );
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/* ─────────────────────── Loading / Error ─────────────────────── */

function LoadingBlock() {
  return (
    <div className="py-20 flex flex-col items-center text-ink-soft">
      <FaDatabase className="text-3xl mb-3 animate-pulse text-camel-deep" />
      <div className="text-sm">백엔드를 깨우는 중… (콜드스타트는 30~50초 걸려요 ☕)</div>
    </div>
  );
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="text-rose-600 font-semibold mb-2">측정에 실패했어요</div>
      <div className="text-[13px] text-ink-soft mb-4 max-w-md break-all">{message}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-md bg-ink text-paper text-sm hover:bg-camel-deep transition-colors"
      >
        다시 시도
      </button>
      <div className="mt-6 text-[11px] text-ink-mute">
        백엔드 주소: <code className="font-mono">{API_BASE_URL}</code>
      </div>
    </div>
  );
}

/* ─────────────────────── Ready ─────────────────────── */

function ReadyBlock({ data }: { data: Nplus1CompareResponse }) {
  const sorted = useMemo(() => {
    const map = new Map((data.results ?? []).map((r) => [r.variant, r] as const));
    return VARIANT_ORDER.map((v) => map.get(v)).filter(Boolean) as Nplus1Result[];
  }, [data.results]);

  if (sorted.length === 0) {
    return (
      <div className="py-16 text-center text-ink-soft text-sm">
        측정 결과가 비어있어요. authorCount를 바꿔서 다시 시도해 보세요.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 시나리오 설명 */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-1">{data.title}</h2>
        <p className="text-[13px] text-ink-soft leading-relaxed">{data.subtitle}</p>
        {data.request && (
          <div className="mt-2 text-[11px] font-mono text-ink-mute">
            requested {data.request.requestedAuthorCount} · applied{' '}
            {data.request.appliedAuthorCount} · books/author {data.request.booksPerAuthor} ·
            max {data.request.maxAvailableAuthors}
          </div>
        )}
      </div>

      {/* 요약 카드 2개 */}
      {data.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            icon={<FaBolt />}
            tone="emerald"
            eyebrow="가장 빠른 방식"
            title={data.summary.bestByElapsedMs.label}
            metric={`${data.summary.bestByElapsedMs.metricValue.toLocaleString()} ms`}
            reason={data.summary.bestByElapsedMs.reason}
          />
          <SummaryCard
            icon={<FaTrophy />}
            tone="sky"
            eyebrow="쿼리가 가장 적은 방식"
            title={data.summary.bestByQueryCount.label}
            metric={`${data.summary.bestByQueryCount.metricValue.toLocaleString()} 개`}
            reason={data.summary.bestByQueryCount.reason}
          />
        </div>
      )}

      {/* 비교 차트 */}
      <ComparisonChart results={sorted} />

      {/* variant 카드 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sorted.map((r, i) => (
          <motion.div
            key={r.variant}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <VariantCard result={r} />
          </motion.div>
        ))}
      </div>

      {/* 데이터셋 메타 */}
      {data.summary && (
        <div className="text-[11px] font-mono text-ink-mute pt-2 border-t border-line">
          dataset · authors {data.summary.authorCount.toLocaleString()} · books{' '}
          {data.summary.bookCount.toLocaleString()} · compared{' '}
          {data.summary.comparedVariantCount} variants
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Components ─────────────────────── */

function SummaryCard({
  icon,
  tone,
  eyebrow,
  title,
  metric,
  reason,
}: {
  icon: React.ReactNode;
  tone: 'emerald' | 'sky';
  eyebrow: string;
  title: string;
  metric: string;
  reason: string;
}) {
  const toneClass =
    tone === 'emerald'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
      : 'bg-sky-50 border-sky-200 text-sky-700';
  return (
    <div className={`rounded-lg border p-5 ${toneClass}`}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-mono mb-2">
        {icon}
        <span>{eyebrow}</span>
      </div>
      <div className="text-2xl font-bold text-ink mb-1">{title}</div>
      <div className="text-3xl font-bold tabular-nums mb-2">{metric}</div>
      <div className="text-[12px] text-ink-soft leading-snug">{reason}</div>
    </div>
  );
}

function VariantCard({ result }: { result: Nplus1Result }) {
  const accent = VARIANT_ACCENT[result.variant];
  const ds = result.dataset ?? {
    authorCount: 0,
    bookCount: 0,
    averageBooksPerAuthor: 0,
    chart: [],
  };
  return (
    <div className={`rounded-lg border ${accent.border} ${accent.bg} p-5 h-full flex flex-col`}>
      <div className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ${accent.text}`}>
        {result.extra?.badge || result.variant}
      </div>
      <div className="text-base font-bold text-ink mb-1 leading-tight">{result.title}</div>
      <div className="text-[12px] text-ink-soft leading-snug mb-4">{result.subtitle}</div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Metric label="elapsed" value={`${result.elapsedMs.toLocaleString()} ms`} accent={accent.text} />
        <Metric label="queries" value={`${result.queryCount.toLocaleString()}`} accent={accent.text} />
        <Metric label="authors" value={`${ds.authorCount.toLocaleString()}`} />
        <Metric label="books" value={`${ds.bookCount.toLocaleString()}`} />
      </div>

      <div className="text-[11px] text-ink-soft mb-4">
        평균 책/작가 ·{' '}
        <span className="font-mono tabular-nums text-ink">
          {(ds.averageBooksPerAuthor ?? 0).toFixed(2)}
        </span>
      </div>

      {result.comparisonHints && result.comparisonHints.length > 0 && (
        <ul className="mt-auto space-y-1 text-[11px] text-ink-soft list-disc list-inside">
          {result.comparisonHints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-mute">{label}</div>
      <div className={`text-base font-bold tabular-nums ${accent ?? 'text-ink'}`}>{value}</div>
    </div>
  );
}

/* ─────────────────────── Bar Chart ─────────────────────── */

function ComparisonChart({ results }: { results: Nplus1Result[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BarBlock
        title="응답 시간 (ms)"
        unit="ms"
        items={results.map((r) => ({
          label: r.title,
          value: r.elapsedMs,
          textColor: VARIANT_ACCENT[r.variant].text,
          barColor: VARIANT_ACCENT[r.variant].bar,
        }))}
      />
      <BarBlock
        title="실행된 쿼리 수"
        unit="queries"
        items={results.map((r) => ({
          label: r.title,
          value: r.queryCount,
          textColor: VARIANT_ACCENT[r.variant].text,
          barColor: VARIANT_ACCENT[r.variant].bar,
        }))}
      />
    </div>
  );
}

function BarBlock({
  title,
  unit,
  items,
}: {
  title: string;
  unit: string;
  items: Array<{ label: string; value: number; textColor: string; barColor: string }>;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="rounded-lg border border-line bg-paper-2/50 p-4">
      <div className="text-[12px] font-bold text-ink mb-3 flex items-baseline justify-between">
        <span>{title}</span>
        <span className="text-[10px] font-mono text-ink-mute">unit: {unit}</span>
      </div>
      <div className="space-y-2.5">
        {items.map((it) => {
          const pct = (it.value / max) * 100;
          return (
            <div key={it.label}>
              <div className="flex items-baseline justify-between text-[11px] mb-1">
                <span className="text-ink-soft truncate">{it.label}</span>
                <span className={`font-mono tabular-nums font-semibold ${it.textColor}`}>
                  {it.value.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-paper-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${it.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
