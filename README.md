# 잇벤토리 (Eatventory)

가지고 있는 식재료를 실온/냉장/냉동으로 등록해두면, 그 재료로 만들 수 있는 레시피를 추천해주는 반응형 웹 서비스입니다.

## 핵심 컨셉

- **냉장고 = 재료 저장소**: 실제 냉장고 문을 연 모습으로 재료를 시각화. 재료는 카드가 아니라 종류별로 다른 실루엣(우유팩/에그박스/채소 묶음/두부박스/냉동 파우치/오일병 등)을 가진 "용기(Vessel)"로 표현됩니다.
- **재료 기반 레시피 추천**: 등록한 재료를 기준으로 만들 수 있는 레시피를 매칭도 순으로 추천하고, 부족한 재료를 알려줍니다.
- **라이트/다크 모드**: 하단 네비게이션의 토글로 전환하며 선택은 브라우저에 저장됩니다.

## 화면 구성

| 화면 | 경로 | 설명 |
|---|---|---|
| 홈 | `/` | 보유 재료 요약, 오늘 만들 수 있는 요리 미리보기 |
| 냉장고 | `/fridge` | 실온/냉장/냉동 구분 재료 등록·조회·삭제, 유통기한 표시 |
| 레시피 추천 | `/recipes` | 보유 재료 매칭 기준 레시피 목록, 필터 |
| 레시피 상세 | `/recipes/:id` | 보유/부족 재료 구분, 조리 순서 |
| 즐겨찾기 | `/favorites` | 즐겨찾기한 레시피 모아보기 |

## 기술 스택

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [React Router](https://reactrouter.com/) — 클라이언트 라우팅
- [Tailwind CSS](https://tailwindcss.com/) — `darkMode: 'class'`
- [lucide-react](https://lucide.dev/) — 아이콘
- [Playwright](https://playwright.dev/) — E2E 테스트

상태 관리는 별도 라이브러리 없이 React Context(`AppContext`, `ThemeContext`)로 처리하며, 데이터는 프로토타입 단계라 `src/data/mock.js`의 더미 데이터를 메모리에서 관리합니다(새로고침 시 초기화, 백엔드 없음).

## 시작하기

```bash
npm install
npm run dev
```

기본적으로 `http://localhost:5173`에서 실행됩니다(포트가 사용 중이면 다른 포트로 자동 전환).

### 빌드

```bash
npm run build
npm run preview
```

### E2E 테스트

```bash
npm run test:e2e       # 헤드리스 실행 (Playwright)
npm run test:e2e:ui    # Playwright UI 모드
```

`playwright.config.js`가 테스트용 dev 서버(4310번 포트)를 자동으로 띄우므로 별도 서버 실행 없이 바로 테스트할 수 있습니다. 데스크톱(1280×800)/모바일(Pixel 7) 두 프로젝트로 동시에 실행됩니다.

## 폴더 구조

```
src/
  components/     재사용 UI 컴포넌트 (BottomNav, RecipeCard, EmptyState, 냉장고 전용 컴포넌트 등)
  context/        전역 상태 (AppContext: 재료/즐겨찾기, ThemeContext: 라이트/다크)
  data/           더미 데이터, 냉장고 시각 팔레트/실루엣 매핑
  pages/          라우트 단위 화면
  utils/          레시피-재료 매칭 로직
e2e/              Playwright E2E 테스트
docs/             기획서, 와이어프레임/UI 명세, 냉장고 디자인 스펙
.claude/agents/   프로젝트 전용 서브에이전트 페르소나 정의
```

## 문서

- [docs/01_기획서.md](docs/01_기획서.md) — 서비스 개요, 타겟, 핵심 기능, 경쟁 서비스 분석
- [docs/02_와이어프레임_UI명세.md](docs/02_와이어프레임_UI명세.md) — 화면 목록/흐름, 화면별 명세
- [docs/03_냉장고_디자인_스펙.md](docs/03_냉장고_디자인_스펙.md) — 냉장고 화면 디자인 스펙(v2)

## 현재 범위 / 제약

- 로그인·계정 시스템 없음, 데이터는 브라우저 새로고침 시 초기화됩니다(백엔드·영속 저장소 미연동).
- 레시피 데이터는 자체 더미 데이터이며 외부 레시피 API 연동은 없습니다.
- 프로토타입 단계로, 실제 서비스 배포를 위한 인증/결제/서버 인프라는 범위 밖입니다.
