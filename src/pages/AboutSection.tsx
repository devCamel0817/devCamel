import { motion } from 'framer-motion';
import { PageTransition, GlassCard, SkillBar } from '../components/ui';
import type { Skill } from '../types';

const skills: Skill[] = [
  // Backend
  { name: 'Java 8 / 17', level: 90, category: 'backend', color: '#e76f00' },
  { name: 'Spring Boot / Framework', level: 88, category: 'backend', color: '#6db33f' },
  { name: 'JPA / QueryDSL', level: 82, category: 'backend', color: '#59666c' },
  { name: 'MyBatis', level: 85, category: 'backend', color: '#c2302d' },
  // Frontend
  { name: 'Vue3 / Quasar', level: 80, category: 'frontend', color: '#42b883' },
  { name: 'React', level: 70, category: 'frontend', color: '#61dafb' },
  { name: 'JavaScript / jQuery', level: 85, category: 'frontend', color: '#f7df1e' },
  { name: 'JSP / Chart.js', level: 75, category: 'frontend', color: '#ff6384' },
  // Database
  { name: 'PostgreSQL', level: 82, category: 'database', color: '#336791' },
  { name: 'MariaDB / MySQL', level: 80, category: 'database', color: '#003545' },
  { name: 'Oracle', level: 78, category: 'database', color: '#f80000' },
  // DevOps
  { name: 'Docker / Kubernetes', level: 75, category: 'devops', color: '#2496ed' },
  { name: 'Jenkins / Argo CD', level: 70, category: 'devops', color: '#d24939' },
  { name: 'Git / SVN', level: 88, category: 'devops', color: '#f05032' },
];

const categories = [
  { key: 'backend' as const, label: 'Backend', color: 'from-primary to-accent' },
  { key: 'frontend' as const, label: 'Frontend', color: 'from-success to-primary' },
  { key: 'database' as const, label: 'Database', color: 'from-warning to-secondary' },
  { key: 'devops' as const, label: 'DevOps', color: 'from-secondary to-danger' },
];

export default function AboutSection() {
  return (
    <PageTransition>
      <section className="section-padding">
        <div className="container-narrow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About <span className="text-gradient">Me</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              3년 실무 경험. Java/Spring Boot 백엔드부터 Vue.js 프론트엔드, Docker/K8s 인프라까지.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: About text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
            >
              <GlassCard hover={false} className="h-full">
                <h3 className="text-xl font-semibold text-white mb-4">👋 안녕하세요, 정규진입니다!</h3>
                <div className="space-y-4 text-surface-400 leading-relaxed text-sm">
                  <p>
                    느려도 끝까지 가는 풀스택 개발자입니다.
                    Java · Spring Boot 기반 백엔드와 Vue.js · React 기반 프론트엔드를
                    넘나들며 실서비스를 구축합니다.
                  </p>
                  <p>
                    결제/물류 도메인 연동, 대용량 배치 최적화(3h→1.5h), 델파이 레거시의
                    웹 전환, MSA 설계 등 실무에서 검증된 경험을 보유하고 있습니다.
                  </p>
                  <p>
                    포기하지 않고 꾸준히 배우며, 하나씩 완성해나가는 것을 좋아합니다.
                  </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-glass-border">
                  {[
                    { value: '3', label: 'Years Exp.' },
                    { value: '4', label: 'Projects' },
                    { value: '∞', label: 'Passion' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-xs text-surface-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Right: Skills */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="space-y-6"
            >
              {categories.map((cat) => (
                <GlassCard key={cat.key} hover={false}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${cat.color}`} />
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                      {cat.label}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {skills
                      .filter((s) => s.category === cat.key)
                      .map((skill) => (
                        <SkillBar
                          key={skill.name}
                          label={skill.name}
                          value={skill.level}
                          color={skill.color}
                        />
                      ))}
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
