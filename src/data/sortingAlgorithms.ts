export type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';

export interface AlgorithmInfo {
  key: SortAlgorithm;
  label: string;
  desc: string;
  complexity: string;
}

export const algorithms: AlgorithmInfo[] = [
  { key: 'bubble', label: 'Bubble Sort', desc: '인접한 두 원소를 비교하여 교환', complexity: 'O(n²)' },
  { key: 'selection', label: 'Selection Sort', desc: '최솟값을 찾아 맨 앞으로 이동', complexity: 'O(n²)' },
  { key: 'insertion', label: 'Insertion Sort', desc: '정렬된 부분에 올바른 위치 삽입', complexity: 'O(n²)' },
  { key: 'quick', label: 'Quick Sort', desc: '피벗 기준 분할 정복', complexity: 'O(n log n)' },
  { key: 'merge', label: 'Merge Sort', desc: '분할 후 병합하며 정렬', complexity: 'O(n log n)' },
];
