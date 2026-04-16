// 배열 관련 유틸 함수

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
