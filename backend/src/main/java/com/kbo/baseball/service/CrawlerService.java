package com.kbo.baseball.service;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.Player;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.repository.PlayerRepository;
import com.kbo.baseball.dto.KboScheduleResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class CrawlerService {

    private final TeamService teamService;
    private final PlayerService playerService;
    private final GameService gameService;
    private final PlayerRepository playerRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // 새로운 KBO 공식 URL 구조
    private static final String KBO_URL = "https://www.koreabaseball.com";
    private static final String KBO_STATS_URL = "https://www.koreabaseball.com/Record";
    private static final String TEAM_RANK_URL = KBO_STATS_URL + "/TeamRank/TeamRankDaily.aspx";
    private static final String PITCHER_STATS_URL = KBO_STATS_URL + "/Player/PitcherBasic/BasicOld.aspx";
    private static final String HITTER_STATS_URL = KBO_STATS_URL + "/Player/HitterBasic/Basic1.aspx";
    private static final String SCHEDULE_URL = KBO_URL + "/Schedule/Schedule.aspx";
    private static final String KBO_SCHEDULE_API_URL = "https://www.koreabaseball.com/Schedule/Schedule.aspx/GetScheduleList";
    
    // 사용자 에이전트 설정
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    
    @Scheduled(cron = "${crawler.schedule}")
    @Transactional
    public void crawlAllData() {
        log.info("KBO 데이터 크롤링 시작: {}", LocalDateTime.now());
        
        try {
            crawlTeams();
            crawlPitchers();
            crawlHitters();
            crawlSchedule();
            
            log.info("KBO 데이터 크롤링 완료: {}", LocalDateTime.now());
        } catch (Exception e) {
            log.error("크롤링 중 오류 발생", e);
        }
    }
    
    /**
     * 당일 기준 실시간 데이터만 크롤링하는 메서드
     */
    @Transactional
    public void crawlTodayData() {
        log.info("당일 실시간 KBO 데이터 크롤링 시작: {}", LocalDateTime.now());
        
        try {
            // 팀 순위 (실시간 업데이트)
            crawlTeams();
            
            // 당일 경기 일정 및 결과 (실시간 업데이트)
            crawlTodaySchedule();
            
            // 선수 통계는 당일에 반영되지 않을 수 있으므로 팀 순위와 경기 결과만 업데이트
            log.info("당일 실시간 KBO 데이터 크롤링 완료: {}", LocalDateTime.now());
        } catch (Exception e) {
            log.error("당일 실시간 크롤링 중 오류 발생", e);
            throw new RuntimeException("실시간 데이터 업데이트 실패", e);
        }
    }
    
    /**
     * KBO JSON API를 사용하여 경기 일정을 크롤링하는 리팩토링된 메서드
     */
    private void crawlSchedule() throws IOException {
        log.info("KBO JSON API를 사용한 경기 일정 크롤링 시작");
        
        LocalDate now = LocalDate.now();
        
        // 현재 월과 다음 월의 일정 크롤링
        for (int monthOffset = 0; monthOffset <= 1; monthOffset++) {
            LocalDate targetDate = now.plusMonths(monthOffset);
            String yearMonth = targetDate.format(DateTimeFormatter.ofPattern("yyyyMM"));
            String todayDate = targetDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            
            log.info("{} 월 경기 일정 크롤링", yearMonth);
            
            try {
                // KBO JSON API 호출을 위한 요청 파라미터 생성
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("leagueId", "1");      // ← KBO 리그 ID
                requestBody.put("seriesId", "");       // ← 시즌 ID (0 = 정규시즌)
                requestBody.put("teamId", "");         // ← 팀 아이디
                requestBody.put("month", yearMonth);         // ← YYYYMM 형식 (예: "202406")
                requestBody.put("gameDate", todayDate);      // ← "2024-06-20"
                
                // // HTTP 헤더 설정
                // HttpHeaders headers = new HttpHeaders();
                // headers.setContentType(MediaType.APPLICATION_JSON);
                // headers.set("User-Agent", USER_AGENT);
                // headers.set("Referer", "https://www.koreabaseball.com/Schedule/Schedule.aspx");
                
                // HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
                
                // // API 호출
                // ResponseEntity<KboScheduleResponse> response = restTemplate.exchange(
                //     KBO_SCHEDULE_API_URL,
                //     HttpMethod.POST,
                //     requestEntity,
                //     KboScheduleResponse.class
                // );
                WebClient client = WebClient.builder()
                .baseUrl("https://www.koreabaseball.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .defaultHeader(HttpHeaders.REFERER, "https://www.koreabaseball.com/Schedule/Schedule.aspx")
                .build();
            
            String response = client.post()
                .uri("/ws/Schedule.asmx/GetScheduleList")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
                
                if (response != null) {
                    // response는 JSON 문자열로, { "d": "{\"rows\": [...] }" } 형태임
                    String innerJson = objectMapper.readTree(response).get("d").asText();
                
                    // innerJson을 ScheduleData 객체로 변환
                    KboScheduleResponse.ScheduleData scheduleData = objectMapper.readValue(innerJson, KboScheduleResponse.ScheduleData.class);
                
                    processScheduleData(scheduleData);
                // if (response.getBody() != null && response.getBody().getData() != null) {
                //     // JSON 문자열을 ScheduleData 객체로 파싱
                //     String jsonData = response.getBody().getData();
                //     KboScheduleResponse.ScheduleData scheduleData = objectMapper.readValue(jsonData, KboScheduleResponse.ScheduleData.class);
                    
                //     processScheduleData(scheduleData);
                } else {
                    log.warn("{} 월 일정 데이터를 받아올 수 없습니다", yearMonth);
                }
                
            } catch (Exception e) {
                log.error("{} 월 일정 크롤링 중 오류 발생", yearMonth, e);
            }
        }
        
        log.info("KBO JSON API를 사용한 경기 일정 크롤링 완료");
    }
    
    /**
     * KBO JSON API를 사용하여 당일 경기 일정을 크롤링하는 리팩토링된 메서드
     */
    private void crawlTodaySchedule() throws IOException {
        log.info("KBO JSON API를 사용한 당일 경기 데이터 크롤링 시작");
        
        LocalDate today = LocalDate.now();
        String todayDate = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        try {
            // KBO JSON API 호출을 위한 요청 파라미터 생성
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("leId", "1");     // KBO 리그 ID
            requestBody.put("srId", "0");     // 시즌 ID (0 = 정규시즌)
            requestBody.put("gameDate", today.format(DateTimeFormatter.ofPattern("yyyyMM"))); // YYYYMM 형식
            
            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", USER_AGENT);
            headers.set("Referer", "https://www.koreabaseball.com/Schedule/Schedule.aspx");
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // API 호출
            ResponseEntity<KboScheduleResponse> response = restTemplate.exchange(
                KBO_SCHEDULE_API_URL,
                HttpMethod.POST,
                requestEntity,
                KboScheduleResponse.class
            );
            
            if (response.getBody() != null && response.getBody().getData() != null) {
                // JSON 문자열을 ScheduleData 객체로 파싱
                String jsonData = response.getBody().getData();
                KboScheduleResponse.ScheduleData scheduleData = objectMapper.readValue(jsonData, KboScheduleResponse.ScheduleData.class);
                
                // 당일 경기만 필터링해서 처리
                List<KboScheduleResponse.GameRow> todayGames = scheduleData.getRows().stream()
                    .filter(game -> todayDate.equals(game.getGameDate()))
                    .toList();
                
                KboScheduleResponse.ScheduleData todayScheduleData = new KboScheduleResponse.ScheduleData();
                todayScheduleData.setRows(todayGames);
                todayScheduleData.setTotalCount(todayGames.size());
                
                processScheduleData(todayScheduleData);
                
            } else {
                log.warn("당일 경기 데이터를 받아올 수 없습니다");
            }
            
        } catch (Exception e) {
            log.error("당일 경기 크롤링 중 오류 발생", e);
            throw new IOException("당일 경기 데이터 크롤링 실패", e);
        }
        
        log.info("KBO JSON API를 사용한 당일 경기 데이터 크롤링 완료");
    }
    
    /**
     * 크롤링한 스케줄 데이터를 처리하는 공통 메서드
     */
    private void processScheduleData(KboScheduleResponse.ScheduleData scheduleData) {
        for (KboScheduleResponse.GameRow gameRow : scheduleData.getRows()) {
            try {
                // 팀 이름으로 팀 정보 조회
                Optional<Team> homeTeam = teamService.getTeamByName(gameRow.getHomeTeamName());
                Optional<Team> awayTeam = teamService.getTeamByName(gameRow.getAwayTeamName());
                
                if (homeTeam.isEmpty() || awayTeam.isEmpty()) {
                    log.warn("팀 정보를 찾을 수 없습니다: {} vs {}", gameRow.getAwayTeamName(), gameRow.getHomeTeamName());
                    continue;
                }
                
                // KBO 게임 키로 기존 경기 확인
                Optional<Game> existingGame = gameService.getGameByKboKey(gameRow.getGameKey());
                
                Game game;
                if (existingGame.isPresent()) {
                    game = existingGame.get();
                } else {
                    game = new Game();
                    game.setKboGameKey(gameRow.getGameKey());
                    game.setHomeTeam(homeTeam.get());
                    game.setAwayTeam(awayTeam.get());
                    game.setStadium(gameRow.getStadium());
                    
                    // 경기 날짜 및 시간 설정
                    LocalDateTime gameDateTime = parseKboDateTime(gameRow.getGameDate(), gameRow.getGameTime());
                    game.setGameDate(gameDateTime);
                    
                    log.info("새로운 경기 생성: {} vs {} @ {} ({})", 
                            gameRow.getAwayTeamName(), gameRow.getHomeTeamName(), 
                            gameRow.getStadium(), gameDateTime);
                }
                
                // 경기 상태 및 점수 업데이트
                updateGameStatus(game, gameRow);
                
                gameService.saveGame(game);
                
            } catch (Exception e) {
                log.error("경기 데이터 처리 중 오류: {}", gameRow.getGameKey(), e);
            }
        }
    }
    
    /**
     * KBO 날짜/시간 형식을 LocalDateTime으로 변환
     */
    private LocalDateTime parseKboDateTime(String dateStr, String timeStr) {
        try {
            // dateStr: "20250103", timeStr: "1800"
            int year = Integer.parseInt(dateStr.substring(0, 4));
            int month = Integer.parseInt(dateStr.substring(4, 6));
            int day = Integer.parseInt(dateStr.substring(6, 8));
            
            int hour = Integer.parseInt(timeStr.substring(0, 2));
            int minute = timeStr.length() >= 4 ? Integer.parseInt(timeStr.substring(2, 4)) : 0;
            
            return LocalDateTime.of(year, month, day, hour, minute);
            
        } catch (Exception e) {
            log.warn("KBO 날짜/시간 파싱 실패: {} {}, 현재 시간 사용", dateStr, timeStr);
            return LocalDateTime.now();
        }
    }
    
    /**
     * KBO API 데이터를 기반으로 게임 상태 업데이트
     */
    private void updateGameStatus(Game game, KboScheduleResponse.GameRow gameRow) {
        // 취소/연기 상태 확인
        if ("Y".equals(gameRow.getCancelFlag())) {
            game.setStatus(Game.GameStatus.CANCELED);
            return;
        }
        
        if ("Y".equals(gameRow.getPostponeFlag())) {
            game.setStatus(Game.GameStatus.POSTPONED);
            return;
        }
        
        // 점수 정보가 있는 경우
        if (gameRow.getHomeScore() != null && !gameRow.getHomeScore().trim().isEmpty() &&
            gameRow.getAwayScore() != null && !gameRow.getAwayScore().trim().isEmpty()) {
            
            try {
                game.setHomeScore(Integer.parseInt(gameRow.getHomeScore()));
                game.setAwayScore(Integer.parseInt(gameRow.getAwayScore()));
                
                // 상태에 따른 경기 상태 설정
                if ("종료".equals(gameRow.getStatus())) {
                    game.setStatus(Game.GameStatus.COMPLETED);
                } else {
                    game.setStatus(Game.GameStatus.IN_PROGRESS);
                    // 진행중인 경기의 이닝 정보 설정
                    game.setCurrentInning(gameRow.getInning());
                    game.setTopBottom(gameRow.getTopBottom());
                }
                
            } catch (NumberFormatException e) {
                game.setStatus(Game.GameStatus.SCHEDULED);
            }
        } else {
            game.setStatus(Game.GameStatus.SCHEDULED);
        }
    }
    
    private void crawlTeams() throws IOException {
        log.info("팀 순위 데이터 크롤링 시작");
        
        Document doc = Jsoup.connect(TEAM_RANK_URL)
                .userAgent(USER_AGENT)
                .timeout(10000)
                .get();

        doc.select("div#cphContents_cphContents_cphContents_pnlVsTeam").remove();
        Elements teamRows = doc.select("table.tData tbody tr");
        
        for (Element teamRow : teamRows) {
            try {
                Elements cols = teamRow.select("td");
                if (cols.size() < 10) continue;
                
                String teamName = cols.get(1).text().trim();
                Optional<Team> existingTeam = teamService.getTeamByName(teamName);
                
                Team team;
                if (existingTeam.isPresent()) {
                    team = existingTeam.get();
                } else {
                    team = new Team();
                    team.setName(teamName);
                    log.info("새로운 팀 생성: {}", teamName);
                }
                
                // 팀 통계 정보 설정
                team.setGames(Integer.parseInt(cols.get(2).text().trim()));
                team.setWins(Integer.parseInt(cols.get(3).text().trim()));
                team.setLosses(Integer.parseInt(cols.get(4).text().trim()));
                team.setDraws(Integer.parseInt(cols.get(5).text().trim()));
                
                String wpText = cols.get(6).text().replace("%", "").trim();
                team.setWinningPercentage(Double.parseDouble(wpText) / 100.0);
                
                // 추가 통계
                String consecutiveStr = cols.get(8).text().trim();
                if (consecutiveStr.contains("연승")) {
                    team.setConsecutiveWins(Integer.parseInt(consecutiveStr.replace("연승", "")));
                    team.setConsecutiveLosses(0);
                } else if (consecutiveStr.contains("연패")) {
                    team.setConsecutiveLosses(Integer.parseInt(consecutiveStr.replace("연패", "")));
                    team.setConsecutiveWins(0);
                }
                
                teamService.saveTeam(team);
                
            } catch (Exception e) {
                log.error("팀 데이터 처리 중 오류", e);
            }
        }
        
        log.info("팀 순위 데이터 크롤링 완료");
    }
    
    private void crawlPitchers() throws IOException {
        log.info("투수 데이터 크롤링 시작");
        
        // 모든 페이지 처리를 위한 변수
        boolean hasMorePages = true;
        int currentPage = 1;
        
        while (hasMorePages) {
            log.info("투수 데이터 {} 페이지 크롤링", currentPage);
            
            // URL 생성
            String url = PITCHER_STATS_URL;
            if (currentPage > 1) {
                url += "?currentPage=" + currentPage;
            }
            
            Document pitcherDoc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();
            
            Elements pitcherRows = pitcherDoc.select("table.tData tbody tr");
            
            if (pitcherRows.isEmpty()) {
                hasMorePages = false;
                continue;
            }
            
            for (Element pitcherRow : pitcherRows) {
                try {
                    Elements cols = pitcherRow.select("td");
                    if (cols.size() < 13) continue;
                    
                    String teamName = cols.get(0).text().trim();
                    String playerName = cols.get(1).text().trim();
                    
                    Optional<Team> team = teamService.getTeamByName(teamName);
                    if (team.isEmpty()) {
                        log.warn("투수 {} 의 팀 {} 정보를 찾을 수 없습니다", playerName, teamName);
                        continue;
                    }
                    
                    List<Player> teamPlayers = playerService.getPlayersByTeam(team.get());
                    Optional<Player> existingPlayer = teamPlayers.stream()
                        .filter(p -> p.getName().equals(playerName))
                        .findFirst();
                    
                    Player player;
                    if (existingPlayer.isPresent()) {
                        player = existingPlayer.get();
                    } else {
                        player = new Player();
                        player.setName(playerName);
                        player.setTeam(team.get());
                        player.setPosition("투수");
                        log.info("새로운 투수 선수 생성: {} ({})", playerName, teamName);
                    }
                    
                    // 투수 통계 설정 - BasicOld.aspx 페이지의 컬럼 인덱스에 맞게 수정
                    player.setEra(parseDoubleOrDefault(cols.get(3).text()));
                    player.setGames(parseIntOrDefault(cols.get(4).text()));
                    player.setWins(parseIntOrDefault(cols.get(6).text()));
                    player.setLosses(parseIntOrDefault(cols.get(7).text()));
                    player.setSaves(parseIntOrDefault(cols.get(8).text()));
                    player.setHolds(parseIntOrDefault(cols.get(9).text()));
                    player.setInningsPitched(parseIntOrDefault(cols.get(10).text()));
                    player.setStrikeouts(parseIntOrDefault(cols.get(12).text()));
                    
                    playerService.savePlayer(player);
                    
                } catch (Exception e) {
                    log.error("투수 데이터 처리 중 오류", e);
                }
            }
            
            // 다음 페이지 존재 확인
            Elements pagination = pitcherDoc.select("div.paging a");
            final int nextPage = currentPage + 1;
            boolean foundNextPage = pagination.stream()
                    .anyMatch(a -> a.text().equals(String.valueOf(nextPage)));
            
            if (foundNextPage) {
                currentPage = nextPage;
            } else {
                hasMorePages = false;
            }
        }
        
        log.info("투수 데이터 크롤링 완료");
    }
    
    private void crawlHitters() throws IOException {
        log.info("타자 데이터 크롤링 시작");
        
        // 모든 페이지 처리를 위한 변수
        boolean hasMorePages = true;
        int currentPage = 1;
        
        while (hasMorePages) {
            log.info("타자 데이터 {} 페이지 크롤링", currentPage);
            
            // URL 생성
            String url = HITTER_STATS_URL;
            if (currentPage > 1) {
                url += "?currentPage=" + currentPage;
            }
            
            Document hitterDoc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();
            
            Elements hitterRows = hitterDoc.select("table.tData tbody tr");
            
            if (hitterRows.isEmpty()) {
                hasMorePages = false;
                continue;
            }
            
            for (Element hitterRow : hitterRows) {
                try {
                    Elements cols = hitterRow.select("td");
                    if (cols.size() < 15) continue;
                    
                    String teamName = cols.get(0).text().trim();
                    String playerName = cols.get(1).text().trim();
                    
                    Optional<Team> team = teamService.getTeamByName(teamName);
                    if (team.isEmpty()) {
                        log.warn("타자 {} 의 팀 {} 정보를 찾을 수 없습니다", playerName, teamName);
                        continue;
                    }
                    
                    List<Player> teamPlayers = playerService.getPlayersByTeam(team.get());
                    Optional<Player> existingPlayer = teamPlayers.stream()
                        .filter(p -> p.getName().equals(playerName))
                        .findFirst();
                    
                    Player player;
                    if (existingPlayer.isPresent()) {
                        player = existingPlayer.get();
                    } else {
                        player = new Player();
                        player.setName(playerName);
                        player.setTeam(team.get());
                        player.setPosition("타자"); // 상세 포지션은 따로 크롤링 필요
                        log.info("새로운 타자 선수 생성: {} ({})", playerName, teamName);
                    }
                    
                    // 타자 통계 설정 - Basic1.aspx 페이지의 컬럼 인덱스에 맞게 수정
                    player.setGames(parseIntOrDefault(cols.get(3).text()));
                    player.setAtBats(parseIntOrDefault(cols.get(4).text()));
                    player.setRuns(parseIntOrDefault(cols.get(5).text()));
                    player.setHits(parseIntOrDefault(cols.get(6).text()));
                    player.setHomeRuns(parseIntOrDefault(cols.get(9).text()));
                    player.setRbi(parseIntOrDefault(cols.get(10).text()));
                    player.setStolenBases(parseIntOrDefault(cols.get(11).text()));
                    
                    // 타율 계산
                    double battingAvg = parseDoubleOrDefault(cols.get(2).text());
                    player.setBattingAverage(battingAvg);
                    
                    playerService.savePlayer(player);
                    
                } catch (Exception e) {
                    log.error("타자 데이터 처리 중 오류", e);
                }
            }
            
            // 다음 페이지 존재 확인
            Elements pagination = hitterDoc.select("div.paging a");
            final int nextPage = currentPage + 1;
            boolean foundNextPage = pagination.stream()
                    .anyMatch(a -> a.text().equals(String.valueOf(nextPage)));
            
            if (foundNextPage) {
                currentPage = nextPage;
            } else {
                hasMorePages = false;
            }
        }
        
        log.info("타자 데이터 크롤링 완료");
    }
    
    // 유틸리티 메서드
    private int parseIntOrDefault(String text) {
        try {
            return Integer.parseInt(text.replaceAll(",", "").trim());
        } catch (Exception e) {
            return 0;
        }
    }
    
    private double parseDoubleOrDefault(String text) {
        try {
            return Double.parseDouble(text.replaceAll(",", "").trim());
        } catch (Exception e) {
            return 0.0;
        }
    }
} 