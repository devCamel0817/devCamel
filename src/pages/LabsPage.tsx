import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui';
import { MacWindow } from '../components/paper';
import { labs } from '../data/labs';

/* Yan Liu 스크린샷의 macOS Finder 스타일.
 * 좌측 사이드바 + 우측에 컬러 폴더 그리드. */

const SIDEBAR = [
  { icon: '🏠', label: 'Labs', active: true },
  { icon: '⭐', label: 'Favorites' },
  { icon: '🌿', label: 'Sandbox' },
  { icon: '📦', label: 'Archive' },
];

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
              알고리즘과 시뮬레이션을 눈으로 보고 이해하세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MacWindow title="~/devcamel/labs" bodyClassName="flex min-h-[480px]">
              {/* Sidebar */}
              <aside className="w-44 hidden sm:block border-r border-line bg-paper-2/40 py-4 px-2">
                <div className="text-[11px] font-mono text-ink-mute uppercase tracking-wider px-2 mb-2">
                  Favorites
                </div>
                <ul className="space-y-0.5">
                  {SIDEBAR.map((s) => (
                    <li
                      key={s.label}
                      className={`px-2.5 py-1.5 rounded text-sm flex items-center gap-2 ${
                        s.active ? 'bg-camel/20 text-ink font-medium' : 'text-ink-soft'
                      }`}
                    >
                      <span className="text-base leading-none">{s.icon}</span>
                      {s.label}
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Folder grid */}
              <div className="flex-1 p-6 sm:p-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {labs.map((lab, i) => {
                    const c = FOLDER_COLORS[i % FOLDER_COLORS.length];
                    return (
                      <motion.div
                        key={lab.to}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.07 }}
                      >
                        <Link
                          to={lab.to}
                          className="group flex flex-col items-center text-center"
                        >
                          <Folder color={c} icon={<lab.icon className="w-7 h-7" />} />
                          <div className="mt-2 text-[13px] text-ink font-medium leading-tight max-w-[120px]">
                            {lab.title}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-mute leading-tight max-w-[140px]">
                            {lab.desc}
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </MacWindow>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

/** macOS 스타일 폴더 SVG */
function Folder({
  color,
  icon,
}: {
  color: { body: string; tab: string };
  icon: React.ReactNode;
}) {
  return (
    <div className="relative w-24 h-20 group-hover:-translate-y-1 transition-transform">
      <svg viewBox="0 0 96 80" className="w-full h-full drop-shadow-[0_4px_8px_rgba(42,36,24,0.18)]">
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
      <div className="absolute inset-0 flex items-center justify-center pt-3 text-white/80">
        {icon}
      </div>
    </div>
  );
}
