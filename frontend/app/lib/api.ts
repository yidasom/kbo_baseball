const API_BASE_URL = "http://localhost:8080/api";

export async function fetchTeams() {
  const response = await fetch(`${API_BASE_URL}/teams`);

  if (!response.ok) {
    throw new Error("팀 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchTeamStandings() {
  const response = await fetch(`${API_BASE_URL}/teams/standings`);

  if (!response.ok) {
    throw new Error("팀 순위 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchTeamById(teamId: string) {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}`);

  if (!response.ok) {
    throw new Error("팀 상세 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchPlayers() {
  const response = await fetch(`${API_BASE_URL}/players`);

  if (!response.ok) {
    throw new Error("선수 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchPlayerById(playerId: string) {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}`);

  if (!response.ok) {
    throw new Error("선수 상세 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchPlayersByTeam(teamId: string) {
  const response = await fetch(`${API_BASE_URL}/players/team/${teamId}`);

  if (!response.ok) {
    throw new Error("팀 선수 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchTopPitchers() {
  const response = await fetch(`${API_BASE_URL}/players/top-pitchers`);

  if (!response.ok) {
    throw new Error("투수 순위 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchTopHittersByAverage() {
  const response = await fetch(`${API_BASE_URL}/players/top-hitters/average`);

  if (!response.ok) {
    throw new Error("타율 순위 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchTopHittersByHomeRuns() {
  const response = await fetch(`${API_BASE_URL}/players/top-hitters/home-runs`);

  if (!response.ok) {
    throw new Error("홈런 순위 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchGames() {
  const response = await fetch(`${API_BASE_URL}/games`);

  if (!response.ok) {
    throw new Error("경기 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchGameById(gameId: string) {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`);

  if (!response.ok) {
    throw new Error("경기 상세 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchGamesByDate(date: string) {
  const response = await fetch(`${API_BASE_URL}/games/date?date=${date}`);

  if (!response.ok) {
    throw new Error("해당 날짜의 경기 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}

export async function fetchUpcomingGames() {
  const response = await fetch(`${API_BASE_URL}/games/upcoming`);

  if (!response.ok) {
    throw new Error("예정된 경기 데이터를 가져오는데 실패했습니다.");
  }

  return response.json();
}
