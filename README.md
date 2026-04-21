# Baseball Insight MVP

KBO 팬이 모바일에서 빠르게 확인할 수 있는 MVP 대시보드입니다. 현재 목표는 복잡한 선수/분석 기능보다 `오늘 경기`, `최근 결과`, `팀 순위`, `구단 인스타그램`을 안정적으로 보여주는 것입니다.

## 현재 방향

- 모바일 우선 UI
- Spring Boot는 PostgreSQL 읽기 API만 담당
- n8n은 KBO/Instagram 데이터 수집과 DB upsert 담당
- Redis, 앱 내부 크롤러, 선수 통계, 이닝별 데이터, 로그인, 알림은 MVP 범위 밖

## MVP 기능

- 홈
  - 오늘 경기 요약
  - 팀 순위 Top 5
  - 최근 경기 결과
  - 구단 인스타그램 미리보기
- 팀 순위
  - 전체 팀 순위
  - 승/패/승률
  - 구단별 Instagram 최신 게시글 3개
  - `더보기` 클릭 시 구단 Instagram으로 이동
- 경기
  - 날짜별 경기 조회
  - 상태 필터: 전체 / 예정 / 진행중 / 종료

## 아키텍처

```text
KBO / Instagram
      ↓
n8n workflows
      ↓
PostgreSQL
      ↓
Spring Boot API
      ↓
React mobile-first UI
```

## 데이터 모델

현재 MVP DB는 아래 테이블만 사용합니다.

- `teams`
  - `id`
  - `name`
  - `instagram_url`
- `standings`
  - `team_id`
  - `games`
  - `wins`
  - `losses`
  - `win_rate`
  - `recent_form`
  - `updated_at`
- `games`
  - `date`
  - `home_team_id`
  - `away_team_id`
  - `home_score`
  - `away_score`
  - `status`
  - `stadium`
  - `source_game_id`
  - `updated_at`
- `social_posts`
  - `team_id`
  - `source_post_id`
  - `post_url`
  - `media_url`
  - `caption`
  - `published_at`
  - `updated_at`

Schema/upsert 예시는 [docs/mvp-schema.sql](docs/mvp-schema.sql)에 있습니다.

## API

- `GET /api/standings`
- `GET /api/games/today`
- `GET /api/games?date=YYYY-MM-DD`
- `GET /api/games/recent?limit=5`
- `GET /api/teams`
- `GET /api/teams/{id}`
- `GET /api/teams/instagram`

## n8n에서 맡을 일

자세한 파이프라인은 [docs/MVP_DATA_PIPELINE.md](docs/MVP_DATA_PIPELINE.md)를 보세요.

권장 워크플로:

1. Team standings
   - 10분마다 KBO 순위 페이지 수집
   - `teams`, `standings` upsert

2. Daily games
   - 5분마다 오늘 경기/일정 수집
   - `teams`, `games` upsert

3. Live/result updates
   - 경기 시간대에만 1-2분마다 실행
   - 점수와 `status` 갱신

4. Team Instagram feeds
   - 10-30분마다 실행
   - `teams.instagram_url`, `social_posts` upsert
   - 공식적으로는 Meta Instagram Graph API 같은 권한 기반 접근을 우선 검토
   - Spring Boot 안에 Instagram scraping 로직을 넣지 않는 방향

## 실행 방법

### 1. PostgreSQL 실행

```bash
docker compose up -d
```

현재 `docker-compose.yml`은 PostgreSQL만 실행합니다.

### 2. Backend 실행

이 저장소에는 현재 `gradlew`가 없습니다. 다른 로컬에서 이어서 할 때는 둘 중 하나가 필요합니다.

- 로컬 Gradle 설치 후:

```bash
cd backend
gradle bootRun
```

- 또는 Gradle wrapper 추가 후:

```bash
cd backend
./gradlew bootRun
```

Backend 기본 DB 설정:

```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/kbo_baseball
spring.datasource.username: postgres
spring.datasource.password: password
```

### 3. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

접속:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Frontend API URL을 바꾸려면:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 검증 명령

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Docker Compose:

```bash
docker compose config
```

Backend:

```bash
cd backend
gradle test
```

주의: 현재 작업 환경에는 `gradle`/`gradlew`가 없어서 backend compile/test는 아직 실제 실행하지 못했습니다.

## 현재까지 확인한 것

- `npm run build`: 통과
- `npm run lint`: 통과
- `docker compose config`: 통과
- `git diff --check`: 통과
- 개발 서버 `http://127.0.0.1:5173/`: 응답 확인

## 이어서 할 작업

- Gradle wrapper 추가
- Backend compile/test 실행
- 기존 PostgreSQL 볼륨에 남아 있을 수 있는 예전 테이블 정리
  - `players`
  - `inning_scores`
  - 예전 `teams` 통계 컬럼
  - 예전 `games` 이닝/크롤링 관련 컬럼
- n8n 워크플로 생성
- KBO 팀별 Instagram URL seed 데이터 준비
- Instagram 최신 게시글 수집 방식 확정
- 배포용 Dockerfile/compose 정리

## 중요한 변경 메모

- 선수 통계, 선수 비교, 이닝별 데이터, 구장별 분석은 제거했습니다.
- 앱 내부 `CrawlerService`도 제거했습니다.
- Redis 의존성도 제거했습니다.
- 현재 앱은 DB에 데이터가 없으면 빈 상태 메시지를 보여줍니다.
- `social_posts.media_url`이 없으면 게시글 카드에는 텍스트 fallback이 보입니다.

## 참고 문서

- [MVP data pipeline](docs/MVP_DATA_PIPELINE.md)
- [MVP schema and n8n upsert SQL](docs/mvp-schema.sql)
