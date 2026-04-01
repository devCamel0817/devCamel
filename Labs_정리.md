# Labs 정리

---

## 1. Sorting Algorithms — 정렬 알고리즘 시각화

**경로**: `/labs/sorting`

30개의 막대를 5가지 정렬 알고리즘으로 정렬하는 과정을 실시간으로 보여준다.

### 알고리즘
| 이름 | 방식 | 시간 복잡도 |
|------|------|-------------|
| Bubble Sort | 인접한 두 원소를 비교하여 교환 | O(n²) |
| Selection Sort | 최솟값을 찾아 맨 앞으로 이동 | O(n²) |
| Insertion Sort | 정렬된 부분에 올바른 위치 삽입 | O(n²) |
| Quick Sort | 피벗 기준으로 분할 정복 (Lomuto 파티션) | O(n log n) |
| Merge Sort | 분할 후 병합하며 정렬 | O(n log n) |

### 구현 핵심
- 각 알고리즘을 **Generator 함수**(`function*`)로 구현하여 한 스텝씩 yield
- setInterval로 yield를 소비하며 속도 제어 (0.5x / 1x / 2x / 4x)
- 비교 중(teal), 교환 중(terracotta), 정렬 완료(camel gold), 피벗(yellow) 색상 분리
- 비교 횟수, 교환 횟수, 소요 시간(10ms 단위 타이머) 실시간 표시

---

## 2. Pathfinding Algorithms — 경로 탐색 시각화

**경로**: `/labs/pathfinding`

21×41 격자 위에서 시작점→도착점 최단 경로를 탐색하는 과정을 보여준다.

### 알고리즘
| 이름 | 방식 | 최단 경로 보장 | 시간 복잡도 |
|------|------|:--------------:|-------------|
| BFS | 큐 기반 너비 우선 탐색 | O | O(V+E) |
| DFS | 스택 기반 깊이 우선 탐색 | X | O(V+E) |
| Dijkstra | 우선순위 큐 기반 최단 거리 | O | O(V²) |
| A* | 맨해튼 거리 휴리스틱 + Dijkstra | O | O(E log V) |

### 구현 핵심
- **벽 드래그**: 클릭 & 드래그로 벽 추가/제거 (mousedown + mouseenter로 구현)
- **미로 생성**: Recursive Backtracking — 모든 셀을 벽으로 초기화 후 스택 DFS로 2칸씩 뚫기
- 탐색 노드(primary/50), 최종 경로(accent/80) 색상 분리
- 탐색 노드 수, 경로 길이, 소요 시간 실시간 표시

---

## 3. Boids Simulation — 군집 행동 시뮬레이션

**경로**: `/labs/boids`

200마리(최대 500) 개체가 3가지 규칙만으로 군집 비행하는 모습을 시뮬레이션한다.

### 3가지 규칙
| 규칙 | 내용 | 구현 |
|------|------|------|
| 분리 (Separation) | 가까운 이웃과 부딪히지 않도록 밀어냄 | 시야 범위 40% 이내 이웃에 대해 거리 반비례 반발 벡터 |
| 정렬 (Alignment) | 주변 이웃과 같은 방향으로 맞춤 | 이웃들의 평균 속도 벡터 방향으로 5% 보정 |
| 결합 (Cohesion) | 주변 이웃의 무게중심으로 모임 | 이웃들의 평균 위치를 향해 0.5% 보정 |

### 구현 핵심
- **시야 범위**: 75px 이내 이웃만 고려
- **속도 제한**: 최소 1 ~ 최대 3 (clampSpeed)
- **가장자리 처리**: margin 50px 이내에서 반대 방향 turnFactor 적용 + 화면 밖 wrap
- **잔상 트레일**: 매 프레임 `clearRect` 대신 반투명(alpha 0.12) 배경 덮어쓰기
- **색상**: 속도에 따라 camel gold(느림) → teal(빠름) 선형 보간
- **프리셋 4종**: Balanced / Swarm(뭉침) / Scatter(흩어짐) / School(물고기떼)
- 슬라이더로 분리/정렬/결합 가중치 + 개체 수(20~500) 실시간 조절

---

## 4. Fourier Transform — 푸리에 변환 시각화

**경로**: `/labs/fourier`

캔버스에 그린 그림을 DFT로 분해하여 회전하는 원(에피사이클)들이 원본을 따라 그린다.

### 동작 과정
1. 사용자가 캔버스에 자유롭게 그림 (또는 프리셋: 별/하트/무한대)
2. 그린 경로를 **256개 등간격 점으로 리샘플링** (총 길이 기준 보간)
3. 각 점을 복소수(x + iy)로 취급, **DFT** 수행 → 256개 주파수 계수 산출
4. 계수를 **진폭(amplitude) 큰 순**으로 정렬
5. 각 계수의 amp = 원의 반지름, phase = 초기 각도, freq = 회전 속도
6. 원을 체인으로 연결, 마지막 원의 끝점이 원본 경로를 추적

### 구현 핵심
- **DFT**: O(n²) 순수 JS 구현 (n=256이면 65,536 연산, 수 ms 이내)
- **리샘플링**: 경로 총 길이를 구한 뒤 등간격 선형 보간 — DFT의 등간격 전제 충족
- **원 개수 슬라이더**: 1~256개 조절 — 줄이면 고주파 성분이 빠져 형태가 뭉개짐
- **시각 연출**: teal 원 테두리(진폭순 alpha 감소) + primary 색 trail + secondary tip glow
- **8초 1사이클**: 사이클마다 trail 초기화, 속도 0.5x/1x/2x 조절 가능

---

## 공통 기술

- **Canvas 2D API** + `requestAnimationFrame` — 라이브러리 없이 순수 JS 렌더링
- **React Ref 패턴** — 애니메이션 루프에서 mutable 값은 ref, UI 바인딩만 state
- **DPR(devicePixelRatio)** 대응 — 레티나 디스플레이 선명도
- 컴포넌트 언마운트 시 `cancelAnimationFrame` / `clearInterval`로 메모리 누수 방지
