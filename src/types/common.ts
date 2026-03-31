export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'etc';
  color: string;
}
