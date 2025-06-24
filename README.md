# ⚾ Baseball Insight - 데이터 기반 야구 경기 분석 플랫폼

> KBO 리그의 상세한 통계와 인사이트를 제공하는 현대적인 웹 애플리케이션

![Baseball](https://img.shields.io/badge/Sport-Baseball-orange)
![KBO](https://img.shields.io/badge/League-KBO-blue)
![Status](https://img.shields.io/badge/Status-Development-yellow)

## 🎯 프로젝트 개요

Baseball Insight는 KBO(Korean Baseball Organization) 리그의 실시간 통계와 분석을 제공하는 웹 플랫폼입니다. 선수별 성적, 팀 순위, 경기 결과 등을 시각화하여 야구 팬들과 분석가들에게 유용한 인사이트를 제공합니다.

## 🚀 주요 기능

### 📊 실시간 통계 대시보드
- KBO 리그 주요 지표 요약
- 실시간 데이터 업데이트
- 인터랙티브 차트와 그래프

### 🏆 팀 분석
- 승률 기준 팀 순위
- 월별/누적 기록 분석
- 팀별 상세 통계 (타율, ERA, 홈런 등)

### ⚾ 선수 통계
- 타자/투수별 상세 성적 분석
- 포지션별 필터링
- 선수 비교 기능
- 월별/시즌 누적 데이터

### 📅 경기 정보
- 예정 경기 일정
- 경기 결과 및 스코어
- 이닝별 득점 흐름

### 🔍 고급 분석
- 구장별 선수 퍼포먼스
- 투수 역할별 분석 (선발/중간/마무리)
- 통계적 트렌드 분석

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│                 │    │                 │    │                 │
│ React 18        │◄──►│ Spring Boot 3   │◄──►│ PostgreSQL      │
│ TypeScript      │    │ Java 19         │    │                 │
│ TailwindCSS     │    │ Redis Cache     │    │                 │
│ React Query     │    │ REST APIs       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ 기술 스택

### Backend
- **Java 19** + **Spring Boot 3.x**
- **PostgreSQL** - 메인 데이터베이스
- **Redis** - 캐싱 및 세션 관리
- **Gradle** - 빌드 도구

### Frontend
- **React 18** + **TypeScript**
- **Vite** - 빠른 개발 환경
- **TailwindCSS** - 유틸리티 CSS
- **React Query** - 서버 상태 관리
- **Recharts** - 데이터 시각화

### Infrastructure
- **Docker Compose** - 컨테이너 오케스트레이션
- **AWS EC2** - 배포 환경

## 🚀 시작하기

### 필수 요구사항

- **Java 19+**
- **Node.js 18+**
- **Docker & Docker Compose**
- **PostgreSQL** (또는 Docker로 실행)

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-repo/baseball-insight.git
cd baseball-insight
```

### 2. Docker Compose로 전체 실행

```bash
# 모든 서비스 실행 (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d
```

### 3. 개별 실행

#### Backend 실행

```bash
cd backend
./gradlew bootRun
```

#### Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

### 4. 접속

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API 문서**: http://localhost:8080/swagger-ui.html

## 📁 프로젝트 구조

```
baseball-insight/
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/kbo/baseball/
│   │       ├── controller/  # REST API 컨트롤러
│   │       ├── service/     # 비즈니스 로직
│   │       ├── model/       # 엔티티 모델
│   │       └── repository/  # 데이터 접근 계층
│   └── build.gradle
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── lib/           # 유틸리티
│   │   └── types/         # 타입 정의
│   └── package.json
├── docker-compose.yml      # 컨테이너 설정
└── README.md
```

## 📊 API 문서

### 주요 엔드포인트

#### 팀 관련
- `GET /api/teams` - 모든 팀 조회
- `GET /api/teams/{id}` - 특정 팀 상세 정보
- `GET /api/teams/standings` - 팀 순위

#### 선수 관련
- `GET /api/players` - 모든 선수 조회
- `GET /api/players/{id}` - 특정 선수 상세 정보
- `GET /api/players/team/{teamId}` - 팀별 선수 목록
- `GET /api/players/top-hitters/average` - 타율 상위 타자
- `GET /api/players/top-pitchers` - 상위 투수

#### 경기 관련
- `GET /api/games` - 모든 경기 조회
- `GET /api/games/date?date={date}` - 날짜별 경기
- `GET /api/games/upcoming` - 예정 경기
- `GET /api/games/{gameId}/innings` - 이닝별 스코어

## 🎨 UI/UX 특징

- **반응형 디자인** - 모바일, 태블릿, 데스크톱 완벽 지원
- **모던 인터페이스** - shadcn/ui 기반 컴포넌트
- **실시간 업데이트** - React Query로 자동 데이터 갱신
- **접근성** - ARIA 표준 준수
- **다크 테마** 지원 (향후 추가 예정)

## 📈 성능 최적화

- **캐싱 전략**: Redis 기반 API 캐싱
- **코드 스플리팅**: 페이지별 lazy loading
- **이미지 최적화**: WebP 포맷 지원
- **번들 최적화**: Vite 기반 빠른 빌드

## 🔧 개발 가이드

### 새로운 기능 추가

1. **백엔드**: 컨트롤러 → 서비스 → 레포지토리 순으로 구현
2. **프론트엔드**: API 훅 → 컴포넌트 → 페이지 순으로 구현
3. **테스트**: 단위 테스트 및 통합 테스트 작성

### 코딩 컨벤션

- **Java**: Spring Boot 표준 컨벤션
- **TypeScript**: ESLint + Prettier 설정
- **커밋 메시지**: Conventional Commits 표준

## 🚀 배포

### 개발 환경

```bash
# Frontend 빌드
cd frontend && npm run build

# Backend 빌드
cd backend && ./gradlew build

# Docker 이미지 빌드
docker-compose build
```

### 프로덕션 배포

```bash
# AWS EC2에 배포
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 로드맵

- [x] **MVP 완성** - 기본 통계 조회 기능
- [ ] **고급 분석** - 상세 통계 및 비교 기능
- [ ] **실시간 알림** - 경기 결과 및 기록 알림
- [ ] **모바일 앱** - React Native 기반
- [ ] **AI 예측** - 경기 결과 및 선수 성과 예측

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 확인하세요.

## 📞 연락처

- **개발자**: [Your Name]
- **이메일**: your.email@example.com
- **이슈**: [GitHub Issues](https://github.com/your-repo/baseball-insight/issues)

---

⚾ **Made with ❤️ for Baseball Fans**
