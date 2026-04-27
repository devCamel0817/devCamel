export type SkillLevel = 'production' | 'comfortable' | 'learning';
export type SkillCategory = 'backend' | 'frontend' | 'database' | 'devops';

export interface SkillItem {
  name: string;
  level: SkillLevel;
  /** 예: '3y · 4 projects' */
  experience: string;
  category: SkillCategory;
}

export const skills: SkillItem[] = [
  // Backend
  { name: 'Java 8 / 17', level: 'production', experience: '3y · 4 projects', category: 'backend' },
  { name: 'Spring Boot / Framework', level: 'production', experience: '3y · 4 projects', category: 'backend' },
  { name: 'MyBatis', level: 'production', experience: '3y · 3 projects', category: 'backend' },
  { name: 'JPA / QueryDSL', level: 'production', experience: '1y · 강북삼성', category: 'backend' },
  { name: 'Spring Batch', level: 'comfortable', experience: '1y · 야간 판정 배치', category: 'backend' },

  // Frontend
  { name: 'Vue 3 / Quasar', level: 'production', experience: '1.5y · 2 projects', category: 'frontend' },
  { name: 'JavaScript / jQuery', level: 'production', experience: '3y · 4 projects', category: 'frontend' },
  { name: 'TypeScript', level: 'production', experience: '1.5y · 2 projects', category: 'frontend' },
  { name: 'JSP / Chart.js', level: 'production', experience: '1y · GSEEK·강북삼성', category: 'frontend' },
  { name: 'Chart.js', level: 'comfortable', experience: '1y · GSEEK·강북삼성', category: 'frontend' },
  { name: 'React', level: 'learning', experience: '6mo · 이 사이트', category: 'frontend' },

  // Database
  { name: 'Oracle', level: 'production', experience: '1y · 롯데 SCM (대용량 튜닝)', category: 'database' },
  { name: 'MySQL / MariaDB', level: 'production', experience: '3y · CTK·GSEEK', category: 'database' },
  { name: 'PostgreSQL', level: 'production', experience: '1y · 강북삼성', category: 'database' },
  { name: 'Redis', level: 'learning', experience: '6mo · 멱등성 키·캐시', category: 'database' },

  // DevOps
  { name: 'Git / SVN', level: 'production', experience: '3y · daily', category: 'devops' },
  { name: 'Docker', level: 'comfortable', experience: '1y · 강북삼성', category: 'devops' },
  { name: 'Jenkins / Argo CD', level: 'comfortable', experience: '1y · CI/CD 연동', category: 'devops' },
  { name: 'Kubernetes', level: 'learning', experience: '학습 중', category: 'devops' },
];

export const skillCategories: { key: SkillCategory; label: string }[] = [
  { key: 'backend', label: 'Backend' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'database', label: 'Database' },
  { key: 'devops', label: 'DevOps' },
];

export const skillLevelStyles: Record<
  SkillLevel,
  { label: string; chip: string; dot: string }
> = {
  production: {
    label: 'Production',
    chip: 'bg-camel/15 text-camel-deep border-camel/30',
    dot: 'bg-camel-deep',
  },
  comfortable: {
    label: 'Comfortable',
    chip: 'bg-paper-3 text-ink-soft border-line',
    dot: 'bg-ink-soft',
  },
  learning: {
    label: 'Learning',
    chip: 'bg-paper-2 text-ink-mute border-line/60',
    dot: 'bg-ink-mute',
  },
};
