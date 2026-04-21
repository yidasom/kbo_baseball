# Baseball Insight MVP Data Pipeline

## Spring Boot responsibilities

- Read from PostgreSQL.
- Serve simple MVP APIs:
  - `GET /api/standings`
  - `GET /api/games/today`
  - `GET /api/games?date=YYYY-MM-DD`
  - `GET /api/games/recent?limit=5`
  - `GET /api/teams/instagram`
- Avoid KBO crawling, parsing, scheduling, Redis caching, player stats, and inning-level data in v1.

## n8n responsibilities

Use n8n as the data collection and upsert layer.

### Workflow 1: Team standings

- Schedule: every 10 minutes.
- Steps:
  1. HTTP Request to KBO standings page.
  2. Parse HTML rows into team name, games, wins, losses, win rate, recent form if available.
  3. Upsert `teams` by `name`.
  4. Upsert `standings` by `team_id`.

### Workflow 2: Daily games

- Schedule: every 5 minutes.
- Steps:
  1. HTTP Request to KBO schedule/result source.
  2. Parse games for today or the current month.
  3. Upsert `teams` for home/away team names.
  4. Upsert `games` by `source_game_id`.

### Workflow 3: Live/result updates

- Schedule: every 1-2 minutes during game windows only.
- Steps:
  1. Fetch same KBO game source.
  2. Update score and status for games already known by `source_game_id`.
  3. Set `updated_at = now()`.

### Workflow 4: Team Instagram feeds

- Schedule: every 10-30 minutes.
- Best source: Meta Instagram Graph API for authorized Business/Creator accounts.
- Store only display fields the app needs:
  - `teams.instagram_url`
  - `social_posts.source_post_id`
  - `social_posts.post_url`
  - `social_posts.media_url`
  - `social_posts.caption`
  - `social_posts.published_at`
- Keep only the newest records needed for the app, or query the latest 3 posts per team.
- The app's `더보기` link opens `teams.instagram_url` directly.

If official API access is not available for every club account, keep `teams.instagram_url` as a manually curated seed list and use n8n only for accounts you are authorized to read. Avoid putting Instagram scraping logic in Spring Boot.

## Status mapping

Store `games.status` as one of:

- `scheduled`
- `live`
- `finished`
- `postponed`
- `canceled`

This matches the API response directly and avoids enum/string conversion in n8n.
