# devCamel

**devCamel**은 저의 경력, 프로젝트, 기술, 성장 과정을 한눈에 보여주는 개발자 포트폴리오 웹사이트입니다. TypeScript, React, Tailwind CSS 등 최신 프론트엔드 스택을 활용해 직접 설계·개발했습니다.

## 주요 섹션

### 1. About & Projects
- 실제 SI/프리랜서 경험 기반의 실전 프로젝트 중심 포트폴리오
- 주요 프로젝트: B2B 이커머스, 병원 차세대 시스템, 공공기관 플랫폼 등
- 각 프로젝트별 역할, 성과, 사용 기술, 기간, 상세 설명 제공

### 2. Labs (알고리즘/시뮬레이션 실험실)
- **Sorting Algorithms**: Bubble, Selection, Insertion, Quick, Merge Sort 시각화
- **Pathfinding Algorithms**: BFS, DFS, Dijkstra, A* 경로 탐색 시각화
- **Boids Simulation**: 단순 규칙으로 구현한 군집 행동 시뮬레이션
- **Fourier Transform**: 그림을 그리면 푸리에 변환으로 원들이 따라 그리는 시각화

> 알고리즘을 직접 눈으로 보고, 원리와 동작을 직관적으로 이해할 수 있도록 만든 실험실(Labs)입니다.

## 커밋 메시지 규칙

- Conventional Commits 규칙 사용
- 예시:  
  - feat: 새로운 알고리즘 시각화 추가  
  - fix: 프로젝트 기간 표기 오류 수정  
  - refactor: Labs 코드 구조 개선  
  - docs: README 업데이트  
  - chore: 패키지 업데이트

## 아키텍처/특징

- **타입 안전성**: 프로젝트/경력/날짜/태그 등 모든 데이터 엄격 타입화
- **유틸 함수 분리**: 날짜·태그 등 반복 로직은 별도 함수로 관리
- **SVG/테마 일관성**: 커스텀 SVG 로고, CSS 변수 기반 테마
- **컴포넌트 분리**: UI/로직/데이터 구조화, 확장성 고려
- **애니메이션/UX**: Framer Motion, 반응형, 접근성(A11y) 반영

## 시작하기
1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`
3. 빌드: `npm run build`

---

문의/기여 환영합니다!
