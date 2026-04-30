import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui';
import { MacWindow } from '../components/paper';
import { labs, labGroups, type LabItem, type LabGroup } from '../data/labs';

/* Yan Liu 스크린샷의 macOS Finder 스타일.
 * 좌측 사이드바(그룹) + 우측 폴더 그리드.
 * 그룹별 섹션 헤더로 분류해서 보여줌. */

/** 폴더 색 팔레트 — 인덱스로 순환 */
const FOLDER_COLORS = [
  { body: '#7da7c8', tab: '#6892b6' },   // 파랑
  { body: '#d4a574', tab: '#b88a5c' },   // 카멜
  { body: '#7fb88a', tab: '#65a070' },   // 초록
  { body: '#d28676', tab: '#b86b5d' },   // 코랄
  { body: '#a890c8', tab: '#8d75ad' },   // 라벤더
  { body: '#e0c068', tab: '#c5a548' },   // 머스타드
];

export default function LabsPage() {
  return (
    <PageTransition>
      <div className="bg-paper text-ink min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="font-hand text-camel-deep text-3xl mb-1">playground</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">
              <span className="ink-underline">Labs</span>
            </h1>
            <p className="text-ink-soft mt-3 text-sm">
              눈으로 보는 알고리즘과 직접 측정한 백엔드 실험들
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MacWindow title="~/devcamel/labs" bodyClassName="flex min-h-[480px]">
              {/* Sidebar — 그룹 네비 (앵커 스크롤) */}
              <aside className="w-48 hidden sm:block border-r border-line bg-paper-2/40 py-4 px-2">
                <div className="text-[11px] font-mono text-ink-mute uppercase tracking-wider px-2 mb-2">
                  Categories
                </div>
                <ul className="space-y-0.5">
                  {labGroups.map((g, i) => (
                    <li key={g.key}>
                      <a
                        href={`#group-${g.key}`}
                        className={`block px-2.5 py-1.5 rounded text-sm flex items-center gap-2 ${
                          i === 0
                            ? 'bg-camel/20 text-ink font-medium'
                            : 'text-ink-soft hover:bg-paper-3/60'
                        }`}
                      >
                        <span className="text-base leading-none">
                          {g.key === 'visual-algorithms' ? '🎨' : '⚙️'}
                        </span>
                        {g.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 px-2 text-[10px] font-mono text-ink-mute leading-relaxed">
                  <div className="mb-1">{labs.filter((l) => l.status === 'live').length} live</div>
                  <div>{labs.filter((l) => l.status === 'soon').length} coming soon</div>
                </div>
              </aside>

              {/* Folder grids by group */}
              <div className="flex-1 p-6 sm:p-10 space-y-12">
                {labGroups.map((group) => (
                  <GroupSection
                    key={group.key}
                    groupKey={group.key}
                    label={group.label}
                    hand={group.hand}
                    desc={group.desc}
                    items={labs.filter((l) => l.group === group.key)}
                  />
                ))}
              </div>
            </MacWindow>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function GroupSection({
  groupKey,
  label,
  hand,
  desc,
  items,
}: {
  groupKey: LabGroup;
  label: string;
  hand: string;
  desc: string;
  items: LabItem[];
}) {
  return (
    <section id={`group-${groupKey}`} className="scroll-mt-24">
      <div className="mb-5 pb-2 border-b border-line">
        <div className="font-hand text-camel-deep text-2xl leading-none mb-1">{hand}</div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-ink">{label}</h2>
          <span className="text-[11px] font-mono text-ink-mute">
            {items.filter((i) => i.status === 'live').length}/{items.length} live
          </span>
        </div>
        <p className="text-[12px] text-ink-soft mt-1">{desc}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {items.map((lab, i) => {
          const c = FOLDER_COLORS[i % FOLDER_COLORS.length];
          const isSoon = lab.status === 'soon';
          const Wrapper: React.ElementType = isSoon ? 'div' : Link;
          const wrapperProps = isSoon ? {} : { to: lab.to };
          return (
            <motion.div
              key={lab.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <Wrapper
                {...wrapperProps}
                className={`group flex flex-col items-center text-center ${
                  isSoon ? 'cursor-default opacity-70' : ''
                }`}
              >
                <div className="relative">
                  <Folder color={c} icon={<lab.icon className="w-7 h-7" />} dimmed={isSoon} />
                  {/* Status badge */}
                  <span
                    className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                      isSoon
                        ? 'bg-paper-2 text-ink-mute border-line'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    }`}
                  >
                    {isSoon ? 'soon' : 'live'}
                  </span>
                </div>
                <div className="mt-2 text-[13px] text-ink font-medium leading-tight max-w-[140px]">
                  {lab.title}
                </div>
                {/* Backend tag chips */}
                {lab.tags && lab.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    {lab.tags.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded-full bg-camel/15 text-camel-deep text-[9px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-1 text-[11px] text-ink-mute leading-tight max-w-[160px]">
                  {lab.desc}
                </div>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/** macOS 스타일 폴더 SVG */
function Folder({
  color,
  icon,
  dimmed = false,
}: {
  color: { body: string; tab: string };
  icon: React.ReactNode;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`relative w-24 h-20 transition-transform ${
        dimmed ? '' : 'group-hover:-translate-y-1'
      }`}
    >
      <svg
        viewBox="0 0 96 80"
        className={`w-full h-full drop-shadow-[0_4px_8px_rgba(42,36,24,0.18)] ${
          dimmed ? 'grayscale-[40%] opacity-80' : ''
        }`}
      >
        {/* Tab */}
        <path
          d="M 4 14 Q 4 8 10 8 L 36 8 L 44 16 L 88 16 Q 92 16 92 20 L 92 24 L 4 24 Z"
          fill={color.tab}
        />
        {/* Body */}
        <path
          d="M 4 22 Q 4 18 8 18 L 88 18 Q 92 18 92 22 L 92 70 Q 92 76 86 76 L 10 76 Q 4 76 4 70 Z"
          fill={color.body}
        />
      </svg>
      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center pt-3 text-white/85">
        {icon}
      </div>
    </div>
  );
}
