import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaArrowRight, FaGithub, FaFileDownload } from 'react-icons/fa';
import { PageTransition } from '../components/ui';
import { PaperCard, Terminal, MacWindow } from '../components/paper';
import { useSeoulWeather } from '../hooks/useSeoulWeather';

import { highlights } from '../data/highlights';
import { achievements } from '../data/achievements';
import { skills, skillCategories, skillLevelStyles, type SkillItem } from '../data/skills';

/* ------------------------------------------------------------------ */
/* HOME — 종이 스크랩북 콜라주 hero + 아래 섹션들                       */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <PageTransition>
      <div className="bg-paper text-ink min-h-screen">
        <Hero />
        <Highlights />
        <Achievements />
        <SkillInventory />
      </div>
    </PageTransition>
  );
}

/* ============================================================ HERO */
function Hero() {
  const { weather } = useSeoulWeather();

  return (
    <section className="relative overflow-hidden min-h-[100vh] pt-10 pb-20">
      {/* 날씨에 따른 은은한 배경 오버레이 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ background: weather?.overlay ?? 'transparent' }}
        aria-hidden
      />

      {/* 좌상단 데스크의 날씨 / 좌표 메모 (Yan Liu 스타일 오마주) */}
      <div className="hidden lg:flex absolute top-6 right-8 flex-col items-end gap-1 z-10">
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-2/80 backdrop-blur border border-line"
          >
            <span className="text-base leading-none" aria-hidden>{weather.emoji}</span>
            <span className={`font-mono text-[12px] tabular-nums ${weather.accent}`}>
              {Math.round(weather.temperature)}°C
            </span>
            <span className="text-[11px] text-ink-soft">· {weather.label}</span>
          </motion.div>
        )}
        <div className="font-mono text-[11px] text-ink-mute tracking-wider">
          37.4999°N&nbsp;·&nbsp;126.9203°E&nbsp;·&nbsp;Seoul
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-[720px]">
        {/* ID Badge (좌측) */}
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ duration: 0.6 }}
          className="lg:absolute lg:left-0 lg:top-12 mx-auto lg:mx-0 max-w-[220px]"
        >
          <IdBadge />
        </motion.div>

        {/* 중앙 헤드라인 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:absolute lg:left-1/2 lg:top-24 lg:-translate-x-1/2 text-center mt-12 lg:mt-0"
        >
          <h1 className="font-hand text-[88px] sm:text-[120px] lg:text-[140px] leading-none text-ink">
            DevCamel
          </h1>
          <div className="mt-1 tracking-[0.4em] text-xs sm:text-sm text-ink-soft">
            I&nbsp;&nbsp;CODE,&nbsp;&nbsp;THEN&nbsp;&nbsp;I&nbsp;&nbsp;SHIP
          </div>
        </motion.div>

        {/* 우상단 — "Currently" 노트 */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 8 }}
          animate={{ opacity: 1, x: 0, rotate: 5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block lg:absolute lg:right-2 lg:top-32 w-[260px]"
        >
          <PaperCard tape="left" className="px-5 py-4">
            <div className="font-hand text-2xl text-camel-deep mb-1">currently</div>
            <p className="text-[13px] text-ink-soft leading-relaxed">
              CTK CLIP B2B 이커머스 리뉴얼 중.
              KCP·PayPal·EximBay 결제 연동과 EasyPost·CJ 물류 자동화로
              미정산·배송 CS를 줄이는 중.
            </p>
          </PaperCard>
        </motion.div>

        {/* 좌하단 — Resume 티켓 */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block lg:absolute lg:left-4 lg:bottom-20"
        >
          <ResumeTicket />
        </motion.div>

        {/* 중앙 하단 — 터미널 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="lg:absolute lg:left-1/2 lg:bottom-12 lg:-translate-x-1/2 max-w-[480px] mx-auto mt-12 lg:mt-0 w-full"
        >
          <Terminal
            title="devcamel — zsh"
            lines={[
              { cmd: 'whoami' },
              { out: 'Fullstack Developer · 3y · Java/Spring & Vue/React' },
              { cmd: 'ls domains/' },
              { out: 'payments/  logistics/  healthcare/  commerce/' },
              { cmd: 'cat focus.md' },
              { out: '# 배치 최적화 · 레거시 현대화 · 결제 정합성' },
            ]}
          />
        </motion.div>

        {/* 우하단 — 액션 버튼 묶음 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="lg:absolute lg:right-4 lg:bottom-24 flex flex-col gap-2 mt-8 lg:mt-0 items-center lg:items-stretch"
        >
          <Link to="/projects">
            <button className="w-52 px-5 py-3 rounded-md bg-ink text-paper hover:bg-camel-deep transition-colors text-sm font-medium flex items-center justify-center gap-2">
              프로젝트 보기 <FaArrowRight className="text-xs" />
            </button>
          </Link>
          <a
            href="https://github.com/devCamel0817"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-52 px-5 py-3 rounded-md border border-ink/20 text-ink hover:border-camel hover:text-camel-deep transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <FaGithub /> GitHub
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ID Badge — 줄에 매달린 사원증 (살짝 흔들림) */
function IdBadge() {
  return (
    <div className="relative pt-12">
      {/* 고리(고정 핀) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-3 rounded-full border-2 border-ink/70 z-10"
        aria-hidden
      />
      {/* 회전 그룹 — 핀에 매달려 좌우로 흔들림 */}
      <motion.div
        className="relative"
        style={{ transformOrigin: '50% 0%' }}
        initial={{ rotate: -5 }}
        animate={{ rotate: [-5, 6, -4, 5, -5] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 끈 */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-2 h-10 bg-ink/80" aria-hidden />
        {/* 카드 */}
        <div className="bg-ink text-paper rounded-lg p-4 shadow-[0_12px_28px_-10px_rgba(42,36,24,0.45)]">
          <div className="text-[11px] tracking-widest text-camel-light mb-1">DEVCAMEL · ID</div>
          <div className="text-2xl font-bold mb-3 leading-tight">
            정규진
            <span className="text-xs font-normal text-paper/60 ml-2">Jung Gyujin</span>
          </div>
          <div className="w-full aspect-square rounded-md bg-paper-3 flex items-center justify-center overflow-hidden">
            <img
              src="/img/증명사진.jfif"
              alt="정규진 프로필 사진"
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
            />
          </div>
          <div className="mt-3 text-[10px] font-mono text-paper/70 leading-relaxed">
            ROLE&nbsp;&nbsp;Fullstack Developer<br />
            STACK&nbsp;Java · Spring · Vue · React<br />
            SINCE&nbsp;2022
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* Resume 티켓 */
function ResumeTicket() {
  return (
    <a
      href="/정규진_이력서.pdf"
      download="정규진_이력서.pdf"
      className="group block"
    >
      <div className="relative flex bg-paper-2 paper-card overflow-hidden w-[280px] hover:bg-paper-3 transition-colors">
        {/* 좌측 stub */}
        <div className="bg-ink text-paper px-3 py-4 flex flex-col items-center justify-center border-r border-dashed border-ink/40">
          <div className="text-[10px] tracking-widest mb-1">ADMIT</div>
          <FaFileDownload className="text-camel-light" />
          <div className="text-[10px] tracking-widest mt-1">ONE</div>
        </div>
        {/* 본문 */}
        <div className="px-4 py-3 flex-1">
          <div className="text-[10px] tracking-widest text-ink-mute mb-1">RESUME · 2026</div>
          <div className="text-sm font-bold text-ink leading-tight">정규진_이력서.pdf</div>
          <div className="text-[11px] text-ink-soft mt-1">클릭해서 다운로드</div>
        </div>
        {/* 우측 perforation */}
        <div className="w-2 bg-paper-3 border-l border-dashed border-ink/30" />
      </div>
    </a>
  );
}

/* ====================================================== HIGHLIGHTS */
function Highlights() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="font-hand text-camel-deep text-3xl mb-1">strengths</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">
            핵심 <span className="ink-underline">강점</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h, i) => {
            const rotate = [-2, 1.5, -1][i] ?? 0;
            return (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1 }}
              >
                <PaperCard rotate={rotate} tape={i % 2 === 0 ? 'center' : false} className="p-6 h-full">
                  <div className="w-11 h-11 rounded-md bg-camel/15 flex items-center justify-center mb-4">
                    <h.icon className="w-5 h-5 text-camel-deep" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">{h.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{h.description}</p>
                </PaperCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==================================================== ACHIEVEMENTS */
function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 border-y border-line">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <div className="font-hand text-camel-deep text-3xl mb-1">numbers</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">
            숫자로 보는 <span className="ink-underline">성과</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {achievements.map((a, i) => (
            <AchievementNote key={a.label} item={a} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementNote({
  item,
  index,
  inView,
}: {
  item: typeof achievements[0];
  index: number;
  inView: boolean;
}) {
  const count = useCountUp(item.value, inView);
  const rotates = [-3, 2, -1.5, 2.5];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: index * 0.1 }}
    >
      <PaperCard rotate={rotates[index] ?? 0} tape={index % 2 === 1 ? 'right' : 'left'} className="px-5 py-7 text-center">
        <div className="text-4xl sm:text-5xl font-bold text-camel-deep tabular-nums mb-2">
          {count}{item.suffix}
        </div>
        <div className="text-sm font-semibold text-ink mb-1">{item.label}</div>
        <div className="text-[11px] text-ink-mute">{item.sub}</div>
      </PaperCard>
    </motion.div>
  );
}

/* ==================================================== SKILLS */
function SkillInventory() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <div className="font-hand text-camel-deep text-3xl mb-1">skills</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink">
          쓰는 <span className="ink-underline">기술들</span>
        </h2>
        <p className="mt-3 text-[13px] text-ink-mute">
          수치대신, 프로젝트에 실제로 쓰며 쌓은 경험 기준으로 정리했습니다.
        </p>
      </div>
      <MacWindow title="~/devcamel/skills.md" className="max-w-5xl mx-auto" bodyClassName="px-6 py-6 space-y-7">
        {/* 범례 */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-line">
          <span className="text-[11px] font-mono text-ink-mute uppercase tracking-wider mr-1">
            legend
          </span>
          {(Object.keys(skillLevelStyles) as Array<keyof typeof skillLevelStyles>).map((lv) => (
            <span
              key={lv}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono ${skillLevelStyles[lv].chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${skillLevelStyles[lv].dot}`} />
              {skillLevelStyles[lv].label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
          {skillCategories.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-camel-deep text-sm">##</span>
                <h4 className="text-sm font-bold text-ink uppercase tracking-wider">
                  {cat.label}
                </h4>
              </div>
              <div className="space-y-1">
                {skills
                  .filter((s) => s.category === cat.key)
                  .map((skill) => (
                    <SkillRow key={skill.name} item={skill} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </MacWindow>
    </section>
  );
}

function SkillRow({ item }: { item: SkillItem }) {
  const style = skillLevelStyles[item.level];
  return (
    <div className="grid grid-cols-[112px_1fr_auto] items-center gap-3 py-1.5 px-2 -mx-2 rounded hover:bg-paper-3/60 transition-colors">
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono justify-center ${style.chip}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {style.label}
      </span>
      <span className="text-[13px] text-ink font-medium truncate">{item.name}</span>
      <span className="text-[11px] font-mono text-ink-mute tabular-nums whitespace-nowrap">
        {item.experience}
      </span>
    </div>
  );
}

/* ====================================================== UTILITY */
function useCountUp(target: number, inView: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    const isDecimal = target % 1 !== 0;
    const steps = 50;
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
