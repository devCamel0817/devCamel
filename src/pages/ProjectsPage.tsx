import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import { PageTransition, GlassCard } from '../components/ui';
import { projects } from '../data/projects';

const allTags = [...new Set(projects.flatMap((p) => p.tags))];

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <PageTransition>
      <section className="section-padding">
        <div className="container-narrow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              3년간 실무에서 수행한 프로젝트들입니다.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="프로젝트 검색..."
                aria-label="프로젝트 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-800 border border-glass-border text-white placeholder-surface-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  !selectedTag
                    ? 'bg-primary text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-white border border-glass-border'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-white'
                      : 'bg-surface-800 text-surface-400 hover:text-white border border-glass-border'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Project Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-glass-border" />

            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative mb-10 md:w-[calc(50%-2rem)] ${
                    i % 2 === 0 ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
                  } pl-12 md:pl-0`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-6 w-3 h-3 rounded-full bg-primary border-2 border-surface-900 z-10 md:hidden" />
                  <div className={`absolute top-6 w-3 h-3 rounded-full bg-primary border-2 border-surface-900 z-10 hidden md:block ${
                    i % 2 === 0 ? 'right-[-2.45rem]' : 'left-[-2.45rem]'
                  }`} />

                  <GlassCard className="flex flex-col">
                    {/* Header: period + company */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent-light border border-accent/20">
                        {project.period}
                      </span>
                      <span className="text-xs text-surface-500">
                        {project.company}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-primary-light mb-3">{project.role}</p>
                    <p className="text-sm text-surface-400 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Achievements */}
                    <ul className="space-y-1.5 mb-4">
                      {project.achievements.map((a, idx) => (
                        <li key={idx} className="text-xs text-surface-400 flex items-start gap-2">
                          <span className="text-accent mt-0.5">▹</span>
                          {a}
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-glass-border">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-light border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Live Link */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-accent-light hover:text-accent transition-colors"
                      >
                        <FaExternalLinkAlt className="text-[10px]" />
                        사이트 바로가기
                      </a>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-surface-500">
              일치하는 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
