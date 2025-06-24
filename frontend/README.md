# Baseball Insight Frontend

데이터 기반 야구 경기 분석 플랫폼의 프론트엔드 애플리케이션입니다.

## 🚀 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 및 빌드 도구
- **TailwindCSS** - 유틸리티 CSS 프레임워크
- **React Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Recharts** - 차트 라이브러리

## 🎯 주요 기능

- 📊 **실시간 통계 대시보드** - KBO 리그 주요 지표 요약
- 🏆 **팀 순위** - 승률 기준 팀 랭킹 및 상세 통계
- ⚾ **선수 통계** - 타자/투수별 상세 성적 분석
- 📅 **경기 일정** - 예정 경기 및 결과 조회
- 🔍 **비교 분석** - 선수/팀 간 성과 비교

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Card 등)
│   ├── stats/          # 통계 전용 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅 (React Query 등)
├── lib/                # 유틸리티 및 API 클라이언트
├── types/              # TypeScript 타입 정의
└── styles/             # 글로벌 스타일
```

## 📡 API 연동

백엔드 API와의 연동을 위해 다음 환경 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🎨 UI/UX 특징

- **반응형 디자인** - 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 모드** - 사용자 환경 설정 대응
- **접근성** - ARIA 표준 준수
- **성능 최적화** - 코드 스플리팅 및 지연 로딩

## 📊 데이터 캐싱

React Query를 사용하여 효율적인 데이터 관리:

- **실시간 데이터**: 30초~2분 간격 업데이트
- **정적 데이터**: 10분~30분 캐시 유지
- **오프라인 지원**: 캐시된 데이터로 기본 기능 제공

## 🔧 개발 가이드

### 새로운 페이지 추가

1. `src/pages/` 에 새 페이지 컴포넌트 생성
2. `src/App.tsx` 의 라우팅 로직에 추가
3. 네비게이션 메뉴에 항목 추가

### API 훅 추가

1. `src/lib/api.ts` 에 API 함수 추가
2. `src/hooks/useApi.ts` 에 React Query 훅 생성
3. 컴포넌트에서 훅 사용

## 📝 코딩 컨벤션

- **컴포넌트**: PascalCase
- **파일명**: PascalCase for components, camelCase for others
- **변수/함수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **CSS 클래스**: TailwindCSS 유틸리티 클래스 우선

## 🚀 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과를 dist/ 폴더에서 확인
```

## 🤝 기여 방법

1. 이슈 확인 또는 새 이슈 생성
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
