# KBO 야구 통계 시각화 프로젝트 (Cursor AI 이용)

KBO 리그 데이터를 기반으로 구단/선수/경기별 타율, 타점, 홈런 등 핵심 지표를 시각화하고, 이닝별 득점 흐름을 분석하는 웹 애플리케이션입니다.

## 기술 스택

- **tools**: Cursor AI + IntelliJ
- **Backend**: Java 19 + Spring Boot 3.x
- **Frontend**: Next.js 14.x + TypeScript + TailwindCSS
- **Database**: PostgreSQL
- **Cache**: Redis
- **Infra**: Docker Compose + AWS EC2

## 주요 기능

- 데이터 적재: 외부 크롤러를 통한 KBO 경기 데이터 수집
- 선수/팀 통계 조회: 월별 및 시즌 누적 기준 통계 제공
- 구장별 선수 퍼포먼스: 특정 구장에서 선수의 기록 비교
- 투수 지표 분석: 선발/중간/마무리별 통계 분리
- 이닝별 득점 흐름: 각 이닝별 득점/실책/기회 여부를 타임라인 차트로 시각화

## 시작하기

### 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

## 프론트엔드 구조

프론트엔드는 Next.js 및 React를 사용하여 구현되었으며, 다음과 같은 페이지들로 구성되어 있습니다:

- **대시보드**: 주요 통계 정보를 한눈에 볼 수 있는 대시보드
- **팀 순위**: KBO 리그 팀 순위 및 팀별 상세 정보
- **선수 통계**: 투수와 타자의 주요 지표 및 순위
- **경기 일정**: 지난 경기 결과 및 예정된 경기 일정

각 페이지는 반응형으로 설계되어 모바일과 데스크톱 환경 모두에서 최적화된 경험을 제공합니다.

## 개발 환경 설정

### 데이터베이스 설정

PostgreSQL과 Redis가 필요합니다. Docker Compose를 사용하여 간편하게 설정할 수 있습니다:

```bash
docker-compose up -d
```

## API 문서

API 문서는 Swagger UI를 통해 확인할 수 있습니다:
http://localhost:8080/swagger-ui.html
