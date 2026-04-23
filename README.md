# devCamel

손으로 만든 종이 스크랩북 같은 개발자 포트폴리오. **정규진(devCamel)**의 경력 · 프로젝트 · 알고리즘 실험을 한 페이지에 담았습니다. React + TypeScript + Tailwind v4로 직접 설계 · 개발했습니다.

> Live: https://devcamel.vercel.app (배포 도메인 기준)

---

## 디자인 컨셉 — Paper Scrapbook

기존의 다크 글래스모피즘 톤을 걷어내고, **종이 / 잉크 / 카멜**의 세 가지 톤으로 재구성했습니다.

- **paper / paper-2 / paper-3** — 크림빛 배경 + 미세한 격자
- **ink / ink-soft / ink-mute** — 본문/보조/캡션 톤
- **camel / camel-light / camel-deep** — 액센트 (밑줄, 도장, 핀 색)
- **font-hand** — Caveat 손글씨 폰트로 헤드라인/캡션 처리
- **masking-tape** — 종이를 붙인 듯한 마스킹 테이프 효과

라이트 톤만 사용 (다크 모드 미지원). 시각화 캔버스만 의도적으로 어둡게 유지해 "칠판" 느낌을 줍니다.

### 디자인 시스템 컴포넌트
[src/components/paper/](src/components/paper/)

- `PaperCard` — 회전(`rotate`) / 마스킹테이프(`tape`) 옵션이 있는 종이 카드
- `MacWindow` — macOS 신호등(red/yellow/green) 헤더 윈도우
- `Terminal` — `MacWindow` 위에 prompt/output 라인을 렌더링
- `Polaroid` — 폴라로이드 사진 + 손글씨 캡션

---

## 페이지 구성

### Home — 콜라주 히어로
[src/pages/HomePage.tsx](src/pages/HomePage.tsx)

- ID 배지 (랜야드에 매달린 사진 카드, `/img/증명사진.jfif`)
- DevCamel 손글씨 헤드라인 + 좌표(`37.5665°N · 126.9780°E · Seoul`)
- Currently 노트 (마스킹테이프 PaperCard)
- Resume Ticket / Terminal 인사말
- Highlights / Achievements (카운트업 애니메이션) / Tech Marquee

### Projects — 지그재그 타임라인
[src/pages/ProjectsPage.tsx](src/pages/ProjectsPage.tsx)

- 점선 타임라인을 따라 배치된 회전 PaperCard
- 검색 / 필터 칩, 기간 스탬프(모노 폰트 + camel 보더)

### Labs — macOS Finder
[src/pages/LabsPage.tsx](src/pages/LabsPage.tsx)

- MacWindow + 사이드바 (Labs / Favorites / Sandbox / Archive)
- 컬러 팔레트 폴더 SVG 그리드, hover lift

### Lab 상세
모두 종이 톤으로 재구성. 시각화 캔버스만 어두운 톤 유지.

- [Sorting](src/pages/SortingPage.tsx) — Bubble / Selection / Insertion / Quick / Merge
- [Pathfinding](src/pages/PathfindingPage.tsx) — BFS / DFS / Dijkstra / A*
- [Boids](src/pages/BoidsPage.tsx) — 분리 / 정렬 / 결합 슬라이더
- [Fourier](src/pages/FourierPage.tsx) — 자유 드로잉 → 원들로 재구성
  - A→B→A 미러링으로 Gibbs 현상 제거
  - 복귀 구간(t > π)에는 펜·원 숨김 처리

### About / Contact
- [AboutSection](src/pages/AboutSection.tsx) — Polaroid + whoami PaperCard + Skills MacWindow
- [ContactSection](src/pages/ContactSection.tsx) — 줄친 노트 위 편지 폼 + EmailJS 연동

### Layout
- [Navbar](src/components/layout/Navbar.tsx) — 손글씨 워드마크, 카멜 underline 액티브 인디케이터
- [Footer](src/components/layout/Footer.tsx) — paper-2 배경 + 종이 톤 텍 배지

---

## 기술 스택

| 분류 | 사용 |
|---|---|
| Core | React 18, TypeScript, Vite |
| Style | Tailwind CSS v4 (`@theme` 토큰) |
| Animation | Framer Motion |
| Routing | React Router v6 |
| Form | EmailJS |
| Visualization | Canvas 2D + RAF |
| Lint/Compiler | ESLint, **React Compiler** |

### React Compiler 대응
React Compiler의 엄격 규칙(impure functions, refs during render, components in render, setState in effect)에 맞춰 다음과 같이 처리:

- `performance.now()` 호출부에 `// eslint-disable-next-line react-compiler/react-compiler`
- 컴포넌트 본문에서 정의되던 `Slider` → `renderSlider` element factory로 변경
- effect 내 `setState` 캐스케이드 → 이벤트 핸들러에서 직접 호출
- `Math.random()`로 만들던 회전값 → 인덱스 기반 고정값

---

## 디렉토리 구조

```
src/
  components/
    icons/        CamelLogo
    layout/       Navbar, Footer, Layout
    paper/        PaperCard, MacWindow, Terminal, Polaroid  ← 디자인 시스템
    ui/           Button, GlassCard, Input, SkillBar, PageTransition
  data/           projects, labs, achievements, highlights, ...
  pages/          Home / Projects / Labs / About / Contact / Lab 상세 5종
  store/          authStore, themeStore (Zustand)
  types/          공통 타입 정의
  utils/          boids, fourier, camelShape, format, array
public/img/       증명사진.jfif 등 정적 자산
```

---

## 시작하기

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

---

## 커밋 규칙

Conventional Commits

- `feat:` 새 기능 / 페이지 / 컴포넌트
- `fix:` 버그 / 시각화 오류 수정
- `refactor:` 구조 개선 (동작 변화 없음)
- `style:` 디자인 토큰 / 레이아웃 변경
- `docs:` README 등 문서
- `chore:` 패키지 / 설정

---

문의 · 기여 환영합니다. — **devCamel0817@gmail.com**
