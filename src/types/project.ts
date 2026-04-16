
export type Tag =
  | 'Java'
  | 'Spring Boot'
  | 'Spring Framework'
  | 'MyBatis'
  | 'JPA'
  | 'QueryDSL'
  | 'MySQL'
  | 'MariaDB'
  | 'Oracle'
  | 'PostgreSQL'
  | 'JSP'
  | 'Docker'
  | 'Jenkins'
  | 'SVN'
  | 'Vue3'
  | 'Quasar'
  | 'Chart.js'
  | 'Argo CD';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: Tag[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
}

/** yyyyMM 형식 (예: '202506') */
type Year = `20${number}${number}`;
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
export type YearMonth = `${Year}${Month}`;

export interface Period {
  start: YearMonth;
  end: YearMonth | 'present';
}

export interface CareerProject extends Project {
  period: Period;
  company: string;
  role: string;
  achievements: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
