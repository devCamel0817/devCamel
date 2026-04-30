/**
 * Backend Lab — N+1 vs Fetch Join vs EntityGraph
 * 백엔드 응답 shape을 그대로 반영. 임의 변형 금지.
 */

export type Nplus1VariantValue = 'n-plus-one' | 'fetch-join' | 'entity-graph';

export type Nplus1MetricPoint = {
  key: string;
  label: string;
  value: number;
  unit: string;
};

export type Nplus1VariantOption = {
  value: Nplus1VariantValue;
  label: string;
  summary: string;
  badge: string;
  recommendedUse: string;
  selected: boolean;
};

export type Nplus1RequestSpec = {
  requestedAuthorCount: number;
  appliedAuthorCount: number;
  booksPerAuthor: number;
  maxAvailableAuthors: number;
};

export type Nplus1Result = {
  scenario: 'nplus1';
  variant: Nplus1VariantValue;
  title: string;
  subtitle: string;
  request: Nplus1RequestSpec;
  elapsedMs: number;
  queryCount: number;
  rows: number;
  metrics: {
    elapsedMs: number;
    queryCount: number;
    rowCount: number;
    authorCount: number;
    bookCount: number;
  };
  dataset: {
    authorCount: number;
    bookCount: number;
    averageBooksPerAuthor: number;
    chart: Nplus1MetricPoint[];
  };
  comparisonHints: string[];
  variants: Nplus1VariantOption[];
  extra: {
    authorCount: number;
    bookCount: number;
    description: string;
    badge: string;
    requestedAuthorCount: number;
    appliedAuthorCount: number;
    booksPerAuthor: number;
  };
};

export type Nplus1Summary = {
  bestByElapsedMs: {
    value: Nplus1VariantValue;
    label: string;
    metricKey: 'elapsedMs';
    metricValue: number;
    reason: string;
  };
  bestByQueryCount: {
    value: Nplus1VariantValue;
    label: string;
    metricKey: 'queryCount';
    metricValue: number;
    reason: string;
  };
  comparedVariantCount: number;
  authorCount: number;
  bookCount: number;
};

export type Nplus1CompareResponse = {
  scenario: 'nplus1';
  title: string;
  subtitle: string;
  request: Nplus1RequestSpec;
  variants: Nplus1VariantOption[];
  results: Nplus1Result[];
  summary: Nplus1Summary;
};
