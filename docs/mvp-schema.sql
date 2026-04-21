CREATE TABLE IF NOT EXISTS teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    instagram_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS standings (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL UNIQUE REFERENCES teams(id),
    games INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    win_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
    recent_form VARCHAR(255),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id BIGSERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    home_team_id BIGINT NOT NULL REFERENCES teams(id),
    away_team_id BIGINT NOT NULL REFERENCES teams(id),
    home_score INTEGER,
    away_score INTEGER,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled',
    stadium VARCHAR(255),
    source_game_id VARCHAR(255) UNIQUE,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);
CREATE INDEX IF NOT EXISTS idx_games_status_date ON games(status, date);

CREATE TABLE IF NOT EXISTS social_posts (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL REFERENCES teams(id),
    source_post_id VARCHAR(255) NOT NULL UNIQUE,
    post_url VARCHAR(500) NOT NULL,
    media_url VARCHAR(1000),
    caption VARCHAR(1000),
    published_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_posts_team_published_at
ON social_posts(team_id, published_at DESC);

-- Example n8n-style upsert for a team.
INSERT INTO teams (name, instagram_url)
VALUES (:team_name, :instagram_url)
ON CONFLICT (name) DO UPDATE
SET instagram_url = COALESCE(EXCLUDED.instagram_url, teams.instagram_url)
RETURNING id;

-- Example n8n-style upsert for standings.
INSERT INTO standings (team_id, games, wins, losses, win_rate, recent_form, updated_at)
VALUES (:team_id, :games, :wins, :losses, :win_rate, :recent_form, now())
ON CONFLICT (team_id) DO UPDATE
SET games = EXCLUDED.games,
    wins = EXCLUDED.wins,
    losses = EXCLUDED.losses,
    win_rate = EXCLUDED.win_rate,
    recent_form = EXCLUDED.recent_form,
    updated_at = now();

-- Example n8n-style upsert for games.
INSERT INTO games (
    date,
    home_team_id,
    away_team_id,
    home_score,
    away_score,
    status,
    stadium,
    source_game_id,
    updated_at
)
VALUES (
    :date,
    :home_team_id,
    :away_team_id,
    :home_score,
    :away_score,
    :status,
    :stadium,
    :source_game_id,
    now()
)
ON CONFLICT (source_game_id) DO UPDATE
SET date = EXCLUDED.date,
    home_team_id = EXCLUDED.home_team_id,
    away_team_id = EXCLUDED.away_team_id,
    home_score = EXCLUDED.home_score,
    away_score = EXCLUDED.away_score,
    status = EXCLUDED.status,
    stadium = EXCLUDED.stadium,
    updated_at = now();

-- Example n8n-style upsert for Instagram posts.
INSERT INTO social_posts (
    team_id,
    source_post_id,
    post_url,
    media_url,
    caption,
    published_at,
    updated_at
)
VALUES (
    :team_id,
    :source_post_id,
    :post_url,
    :media_url,
    :caption,
    :published_at,
    now()
)
ON CONFLICT (source_post_id) DO UPDATE
SET post_url = EXCLUDED.post_url,
    media_url = EXCLUDED.media_url,
    caption = EXCLUDED.caption,
    published_at = EXCLUDED.published_at,
    updated_at = now();
