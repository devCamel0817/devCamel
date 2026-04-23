import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import { PageTransition } from '../components/ui';
import { PaperCard } from '../components/paper';
import { projects } from '../data/projects';
import { formatPeriod } from '../utils/format';
import { unique } from '../utils/array';
import type { Tag } from '../types/project';

const allTags = unique(projects.flatMap((p) => p.tags));

/* 항목별로 살짝씩 다른 회전각/테이프 위치 — 의사난수 */
const ROTATES = [-1.2, 0.8, -0.6, 1.4, -1.6, 0.5];
const TAPES: Array<'left' | 'right' | 'center' | false> = ['left', 'right', 'center', 'left', 'right', 'center'];

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <PageTransition>
      <div className="bg-paper text-ink min-h-screen pt-24 pb-24">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="font-hand text-camel-deep text-3xl mb-1">my work</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">
              <span className="ink-underline">Projects</span>
            </h1>
            <p className="text-ink-soft mt-3 text-sm">
              3년간 실무에서 수행한 프로젝트들입니다.
            </p>
          </motion.div>

          {/* Search & Filter — 종이 메모 스타일 */}
          <PaperCard className="px-5 py-4 mb-10 max-w-3xl mx-auto">
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute text-sm" />
              <input
                type="text"
                placeholder="프로젝트 검색..."
                aria-label="프로젝트 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-transparent border-b border-line-strong text-ink placeholder-ink-mute focus:outline-none focus:border-camel transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={!selectedTag} onClick={() => setSelectedTag(null)}>
                All
              </FilterChip>
              {allTags.map((tag) => (
                <FilterChip
                  key={tag}
                  active={selectedTag === tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </FilterChip>
              ))}
            </div>
          </PaperCard>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* 점선 타임라인 */}
            <div
              className="absolute left-4 md:left-1/2 md:-translate-x-px top-2 bottom-2 w-px"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, var(--color-camel) 0 6px, transparent 6px 12px)',
              }}
              aria-hidden
            />

            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const left = i % 2 === 0;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.08, 0.4) }}
                    className={`relative mb-12 md:w-[calc(50%-2rem)] ${
                      left ? 'md:mr-auto' : 'md:ml-auto'
                    } pl-12 md:pl-0`}
                  >
                    {/* Pin (타임라인 점) */}
                    <div
                      className={`absolute top-6 w-3.5 h-3.5 rounded-full bg-camel-deep border-2 border-paper z-10
                      ${left ? 'left-2.5 md:left-auto md:-right-9' : 'left-2.5 md:left-auto md:-left-9'}`}
                      aria-hidden
                    />

                    <PaperCard
                      rotate={ROTATES[i % ROTATES.length]}
                      tape={TAPES[i % TAPES.length]}
                      className="p-5"
                    >
                      {/* Period stamp + company */}
                      <div className="flex items-center justify-between mb-3 gap-3">
                        <span className="font-mono text-[11px] tracking-wider px-2 py-0.5 border border-camel/40 text-camel-deep rounded-sm">
                          {formatPeriod(project.period)}
                        </span>
                        <span className="text-[11px] text-ink-mute">{project.company}</span>
                      </div>

                      <h3 className="text-base font-bold text-ink leading-tight mb-1">
                        {project.title}
                      </h3>
                      <p className="font-hand text-camel-deep text-lg mb-3">
                        — {project.role}
                      </p>
                      <p className="text-[13px] text-ink-soft leading-relaxed mb-4">
                        {project.description}
                      </p>

                      <ul className="space-y-1 mb-4">
                        {project.achievements.map((a, idx) => (
                          <li key={idx} className="text-[12px] text-ink-soft flex items-start gap-2">
                            <span className="text-camel mt-0.5 leading-tight">▸</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-3 border-t border-line">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-1.5 py-0.5 bg-paper-2 text-ink-soft rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-xs text-camel-deep hover:text-ink transition-colors"
                        >
                          <FaExternalLinkAlt className="text-[10px]" />
                          사이트 바로가기
                        </a>
                      )}
                    </PaperCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-ink-mute font-hand text-2xl">
              일치하는 프로젝트가 없어요
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-colors border ${
        active
          ? 'bg-ink text-paper border-ink'
          : 'bg-paper text-ink-soft border-line-strong hover:border-camel hover:text-camel-deep'
      }`}
    >
      {children}
    </button>
  );
}
