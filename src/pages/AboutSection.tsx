import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui';
import { PaperCard, MacWindow, Polaroid } from '../components/paper';
import type { Skill } from '../types';

const skills: Skill[] = [
  { name: 'Java 8 / 17', level: 90, category: 'backend', color: '#e76f00' },
  { name: 'Spring Boot / Framework', level: 88, category: 'backend', color: '#6db33f' },
  { name: 'JPA / QueryDSL', level: 82, category: 'backend', color: '#59666c' },
  { name: 'MyBatis', level: 85, category: 'backend', color: '#c2302d' },

  { name: 'Vue3 / Quasar', level: 80, category: 'frontend', color: '#42b883' },
  { name: 'React', level: 70, category: 'frontend', color: '#61dafb' },
  { name: 'JavaScript / jQuery', level: 85, category: 'frontend', color: '#f7df1e' },
  { name: 'JSP / Chart.js', level: 75, category: 'frontend', color: '#ff6384' },

  { name: 'PostgreSQL', level: 82, category: 'database', color: '#336791' },
  { name: 'MariaDB / MySQL', level: 80, category: 'database', color: '#003545' },
  { name: 'Oracle', level: 78, category: 'database', color: '#f80000' },

  { name: 'Docker / Kubernetes', level: 75, category: 'devops', color: '#2496ed' },
  { name: 'Jenkins / Argo CD', level: 70, category: 'devops', color: '#d24939' },
  { name: 'Git / SVN', level: 88, category: 'devops', color: '#f05032' },
];

const categories = [
  { key: 'backend' as const, label: 'Backend' },
  { key: 'frontend' as const, label: 'Frontend' },
  { key: 'database' as const, label: 'Database' },
  { key: 'devops' as const, label: 'DevOps' },
];

export default function AboutSection() {
  return (
    <PageTransition>
      <div className="bg-paper text-ink min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="font-hand text-camel-deep text-3xl mb-1">about me</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">
              <span className="ink-underline">정규진</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
            {/* Left — Polaroid + bio */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center lg:items-start gap-6"
            >
              <Polaroid
                src="/img/증명사진.jfif"
                alt="정규진"
                caption="hello, world!"
                rotate={-3}
                size={220}
              />

              <PaperCard rotate={1.5} className="px-5 py-4 max-w-[280px]">
                <div className="font-hand text-2xl text-camel-deep mb-2">whoami</div>
                <p className="text-[13px] text-ink-soft leading-relaxed">
                  늦게 시작한 만큼 확실히 몰입하는 풀스택 개발자.
                  결제·물류·헬스케어·커머스 4개 도메인을 횡단하며
                  배치 최적화와 레거시 현대화를 주로 다뤘습니다.
                </p>
              </PaperCard>

              <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                {[
                  { value: '3', label: 'years' },
                  { value: '4', label: 'projects' },
                  { value: '∞', label: 'passion' },
                ].map((s, i) => (
                  <PaperCard key={s.label} rotate={[-2, 1.5, -1][i] ?? 0} className="px-2 py-3 text-center">
                    <div className="text-xl font-bold text-camel-deep">{s.value}</div>
                    <div className="text-[10px] text-ink-mute font-mono uppercase tracking-wider">{s.label}</div>
                  </PaperCard>
                ))}
              </div>
            </motion.div>

            {/* Right — Skills as MacWindow */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MacWindow title="~/devcamel/skills.md" bodyClassName="px-6 py-6 space-y-7">
                {categories.map((cat) => (
                  <div key={cat.key}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-camel-deep text-sm">##</span>
                      <h4 className="text-sm font-bold text-ink uppercase tracking-wider">
                        {cat.label}
                      </h4>
                    </div>
                    <div className="space-y-2.5">
                      {skills
                        .filter((s) => s.category === cat.key)
                        .map((skill) => (
                          <PaperSkillBar key={skill.name} label={skill.name} value={skill.level} color={skill.color} />
                        ))}
                    </div>
                  </div>
                ))}
              </MacWindow>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

/** 종이톤 스킬 바 */
function PaperSkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] text-ink">{label}</span>
        <span className="text-[11px] font-mono text-ink-mute">{value}%</span>
      </div>
      <div className="h-1.5 bg-paper-3 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
