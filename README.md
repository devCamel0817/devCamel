# devCamel

종이 스크랩북 톤으로 만든 프론트엔드 포트폴리오이자 실험실입니다. 프로젝트 소개, 인터랙티브 알고리즘 시각화, 그리고 JPA 성능 비교 같은 백엔드 실험 결과를 한 사이트에 담았습니다.

> Live: https://devcamel.vercel.app

---

## 프로젝트 개요

- 손글씨와 종이 질감 중심의 paper scrapbook UI
- 프로젝트 타임라인, 포트폴리오 소개, 연락 폼 제공
- 알고리즘 실험실과 백엔드 성능 비교 랩 제공
- Firebase Realtime Database 기반 실시간 방문 상태 표시
- EmailJS 기반 연락 폼 전송

---

## 주요 기능

### 포트폴리오 페이지

- [src/pages/HomePage.tsx](src/pages/HomePage.tsx): 콜라주형 히어로, 소개 카드, 하이라이트, 업적, 스킬 마키
- [src/pages/ProjectsPage.tsx](src/pages/ProjectsPage.tsx): 필터 가능한 프로젝트 타임라인
- [src/pages/ContactSection.tsx](src/pages/ContactSection.tsx): EmailJS 기반 문의 폼

### Labs

- [src/pages/LabsPage.tsx](src/pages/LabsPage.tsx): Finder 스타일 랩 인덱스
- [src/pages/SortingPage.tsx](src/pages/SortingPage.tsx): 정렬 알고리즘 시각화
- [src/pages/PathfindingPage.tsx](src/pages/PathfindingPage.tsx): 경로 탐색 알고리즘 시각화
- [src/pages/FourierPage.tsx](src/pages/FourierPage.tsx): 드로잉을 푸리에 원운동으로 복원
- [src/pages/BoidsPage.tsx](src/pages/BoidsPage.tsx): 군집 행동 시뮬레이션
- [src/pages/NPlusOnePage.tsx](src/pages/NPlusOnePage.tsx): N+1, Fetch Join, EntityGraph 비교 랩

### 공통 레이아웃

- [src/components/layout/Layout.tsx](src/components/layout/Layout.tsx): Navbar, Footer, Toaster, StatusOverlay 조합
- [src/components/layout/StatusOverlay.tsx](src/components/layout/StatusOverlay.tsx): 서울 날씨, 실시간 온라인, today/total 방문자 표시

---

## 디자인 시스템

디자인 핵심은 paper, ink, camel 3개 톤입니다.

- `paper / paper-2 / paper-3`: 크림톤 배경과 종이 레이어
- `ink / ink-soft / ink-mute`: 본문, 보조 텍스트, 캡션 색상
- `camel / camel-deep`: 강조선, 핀, 배지 액센트
- `font-hand`: 손글씨 헤드라인

관련 컴포넌트는 [src/components/paper](src/components/paper) 에 있습니다.

- `PaperCard`: 종이 카드 스타일과 tape, rotate 옵션
- `MacWindow`: macOS 스타일 헤더 윈도우
- `Terminal`: 터미널 출력 스타일 래퍼
- `Polaroid`: 사진 + 캡션 카드

---

## 기술 스택

| 분류 | 사용 |
|---|---|
| Core | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM 7 |
| Animation | Framer Motion |
| Forms | EmailJS, React Hot Toast |
| Data / Infra | Firebase Realtime Database |
| Visualization | Canvas 2D, requestAnimationFrame, animated div bars |
| Tooling | ESLint, TypeScript |

---

## 현재 라우트

- `/`: Home
- `/projects`: Projects
- `/labs`: Labs index
- `/labs/sorting`: Sorting Lab
- `/labs/pathfinding`: Pathfinding Lab
- `/labs/fourier`: Fourier Lab
- `/labs/boids`: Boids Lab
- `/labs/jpa-nplus1`: JPA N+1 Comparison Lab
- `/contact`: Contact

라우트 정의는 [src/App.tsx](src/App.tsx) 에 있습니다.

---

## N+1 비교 랩

[src/pages/NPlusOnePage.tsx](src/pages/NPlusOnePage.tsx) 는 별도 Spring Boot 백엔드와 연결되는 프론트입니다.

- `GET /api/nplus1/compare?authorCount=30`
- `GET /api/nplus1?variant=n-plus-one|fetch-join|entity-graph&authorCount=30`
- `GET /api/nplus1/variants`

프론트는 다음 파일로 분리되어 있습니다.

- [src/types/nplus1.ts](src/types/nplus1.ts): 백엔드 응답 타입
- [src/api/nplus1.ts](src/api/nplus1.ts): API 호출 함수와 authorCount clamp/preset
- [src/hooks/useNplus1Compare.ts](src/hooks/useNplus1Compare.ts): 로딩, 에러, 재요청 상태 관리
- [src/pages/NPlusOnePage.tsx](src/pages/NPlusOnePage.tsx): authorCount 선택, 요약 카드, 비교 바 차트, variant 카드 UI

---

## 환경 변수

### Firebase

실시간 방문자 상태 표시를 쓰려면 아래 값이 필요합니다.

파일 예시는 [.env.example](.env.example) 에 있습니다.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

### 백엔드 랩 API

JPA 비교 랩을 로컬 백엔드에 붙일 때는 아래 값을 사용할 수 있습니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

- 운영(Vercel): `Project Settings → Environment Variables`에 `VITE_API_BASE_URL=https://<백엔드도메인>` 으로 추가 후 redeploy.
- trailing slash 없이 저장 (`https://api.example.com` ✅, `https://api.example.com/` ❌).
- 미설정 시 기본값은 `http://localhost:8080` 입니다.
- (legacy) 기존 `VITE_BACKEND_URL` 도 fallback으로 인식합니다.

> ⚠️ 프론트가 HTTPS인데 백엔드가 `http://<IP>` 라면 브라우저 Mixed Content 정책으로 차단됩니다. 운영은 백엔드도 HTTPS 도메인으로 노출하세요.

---

## 디렉토리 구조

```text
src/
  api/            백엔드 호출 함수
  components/
    icons/        아이콘 컴포넌트
    layout/       Navbar, Footer, Layout, StatusOverlay
    paper/        PaperCard, MacWindow, Terminal, Polaroid
    ui/           Button, Input, SkillBar, PageTransition 등
  data/           projects, labs, achievements, highlights 등 정적 데이터
  hooks/          Firebase, weather, N+1 compare hooks
  lib/            Firebase 초기화
  pages/          Home, Projects, Labs, Contact, 각종 Lab 페이지
  store/          실험용 상태 저장소 자리
  types/          공통 타입, N+1 타입
  utils/          시뮬레이션 및 포맷 유틸
public/           정적 파일
```

---

## 실행 방법

```bash
npm install
npm run dev
npm run build
npm run lint
```

개발 서버 기본 주소는 `http://localhost:5173` 입니다.

---

## 공개 레포 메모

- 실제 비밀값은 `.env` 에 두고 커밋하지 않습니다.
- Firebase Web 설정값은 클라이언트용이므로 노출 자체보다 Firebase Rules 설정이 더 중요합니다.
- EmailJS를 사용할 경우 서비스 콘솔에서 origin 제한과 스팸 방어 설정을 권장합니다.

---

## 연락

devCamel0817@gmail.com
