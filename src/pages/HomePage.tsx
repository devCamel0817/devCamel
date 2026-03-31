import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaArrowRight, FaFileDownload } from 'react-icons/fa';
import { HiCode, HiDatabase, HiServer } from 'react-icons/hi';
import { PageTransition, GlassCard } from '../components/ui';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const typingWords = [
  'Build · Ship · Repeat 🚀',
  'Java & Spring Boot',
  '레거시를 현대화하는 개발자',
  'Clean Code Enthusiast',
  '복잡한 문제를 단순하게',
  'Never Stop Learning 🐪',
];

const floatingOrbs = [
  { color: 'from-primary to-primary-light', size: 'w-72 h-72', pos: '-top-20 -left-20', delay: 0 },
  { color: 'from-secondary to-secondary-light', size: 'w-96 h-96', pos: '-bottom-32 -right-32', delay: 2 },
  { color: 'from-accent to-accent-light', size: 'w-64 h-64', pos: 'top-1/2 left-1/2', delay: 4 },
];

const highlights = [
  {
    icon: HiServer,
    title: '결제 · 물류 도메인',
    description: 'KCP/PayPal/EximBay 결제 연동, EasyPost/CJ 물류 자동화 등 실서비스 도메인 경험.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: HiDatabase,
    title: '대용량 데이터 처리',
    description: '판정 배치 성능 50% 향상 (3h → 1.5h), Oracle SQL 튜닝 및 쿼리 최적화.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: HiCode,
    title: '레거시 현대화',
    description: '델파이 → 웹 전환, MSA 도메인 분산 설계, 공통 모듈 구축으로 생산성 20% 향상.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

const achievements = [
  { label: '배치 성능 향상', value: 50, suffix: '%', sub: '3h → 1.5h', color: 'text-accent' },
  { label: '생산성 향상', value: 20, suffix: '%', sub: '공통 모듈 구축', color: 'text-primary' },
  { label: '실무 프로젝트', value: 4, suffix: '개', sub: '결제·물류·의료·교육', color: 'text-secondary' },
  { label: '실무 경력', value: 3.2, suffix: '년', sub: 'Full-Stack Developer', color: 'text-accent-light' },
];

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) { setCount(0); return; }
    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(isDecimal ? Math.round(current * 10) / 10 : Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, inView, duration]);
  return count;
}

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = typingWords[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length - 1 === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % typingWords.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <PageTransition>
      {/* ========== HERO ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: orb.delay,
            }}
            className={`absolute ${orb.pos} ${orb.size} rounded-full bg-gradient-to-br ${orb.color} opacity-10 blur-3xl pointer-events-none`}
          />
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-sm mb-8"
            >
              3년 2개월 경력 · Full-Stack Developer
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">정규진</span>
              <br />
              <span className="text-gradient">느려도 끝까지 가는 개발자</span>
            </h1>

            {/* Typing animation */}
            <div className="h-10 flex items-center justify-center mb-6">
              <span className="text-xl sm:text-2xl text-accent-light font-mono">
                {'> '}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex + text}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                  >
                    {text}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                  className="inline-block w-0.5 h-6 bg-accent-light ml-0.5 align-middle"
                />
              </span>
            </div>

            <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Java · Spring Boot · Vue.js 기반 풀스택 개발자.
              <br className="hidden sm:block" />
              결제/물류 도메인 경험, 대용량 데이터 최적화, 레거시 시스템 현대화.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-48 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                >
                  프로젝트 둘러보기
                  <FaArrowRight />
                </motion.button>
              </Link>
              <a
                href="/resume.pdf"
                download="정규진_이력서_2026.pdf"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-48 py-3.5 rounded-xl bg-accent/20 border border-accent/30 text-accent-light font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent/30 transition-colors"
                >
                  <FaFileDownload />
                  이력서 다운로드
                </motion.button>
              </a>
              <a
                href="https://github.com/devCamel0817"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-48 py-3.5 rounded-xl bg-surface-800 border border-glass-border text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-700 transition-colors"
                >
                  <FaGithub />
                  GitHub
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 rounded-full border-2 border-surface-500 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-surface-500" />
          </div>
        </motion.div>
      </section>

      {/* ========== HIGHLIGHTS ========== */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              핵심 <span className="text-gradient">강점</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              실무에서 검증된 역량들입니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="h-full">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ACHIEVEMENT COUNTERS ========== */}
      <AchievementCounters />

      {/* ========== TECH STACK BANNER ========== */}
      <section className="py-16 border-y border-glass-border overflow-hidden">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex gap-12">
              {[
                'Java 17', 'Spring Boot', 'JPA', 'QueryDSL', 'MyBatis',
                'Vue3', 'Quasar', 'PostgreSQL', 'MariaDB', 'Oracle',
                'Docker', 'Kubernetes', 'Jenkins', 'Argo CD', 'MSA',
              ].map((tech) => (
                <span key={`${groupIdx}-${tech}`} className="text-2xl font-bold text-surface-700">
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ========== ABOUT (inline) ========== */}
      <AboutSection />

      {/* ========== CONTACT (inline) ========== */}
      <ContactSection />
    </PageTransition>
  );
}

function AchievementCounters() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            숫자로 보는 <span className="text-gradient">성과</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            실무에서 만들어낸 결과들입니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((a, i) => (
            <AchievementCard key={a.label} item={a} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementCard({ item, index, inView }: { item: typeof achievements[0]; index: number; inView: boolean }) {
  const count = useCountUp(item.value, inView);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false }}
      transition={{ delay: index * 0.12 }}
    >
      <GlassCard className="text-center py-8">
        <div className={`text-4xl sm:text-5xl font-bold ${item.color} mb-2 tabular-nums`}>
          {count}{item.suffix}
        </div>
        <div className="text-sm font-medium text-white mb-1">{item.label}</div>
        <div className="text-xs text-surface-500">{item.sub}</div>
      </GlassCard>
    </motion.div>
  );
}
