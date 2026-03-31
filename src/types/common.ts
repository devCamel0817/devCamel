export interface ConcurrencyResult {
  sequentialTimeMs: number;
  parallelTimeMs: number;
  results: ApiCallResult[];
}

export interface ApiCallResult {
  source: string;
  data: string;
  timeMs: number;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'etc';
  color: string;
}
