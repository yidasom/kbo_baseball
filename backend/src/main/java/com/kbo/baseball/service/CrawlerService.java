package com.kbo.baseball.service;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.Player;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CrawlerService {

    private final TeamService teamService;
    private final PlayerService playerService;
    private final GameService gameService;
    private final PlayerRepository playerRepository;
    
    // 새로운 KBO 공식 URL 구조
    private static final String KBO_URL = "https://www.koreabaseball.com";
    private static final String KBO_STATS_URL = "https://www.koreabaseball.com/Record";
    private static final String TEAM_RANK_URL = KBO_STATS_URL + "/TeamRank/TeamRankDaily.aspx";
    private static final String PITCHER_STATS_URL = KBO_STATS_URL + "/Player/PitcherBasic/BasicOld.aspx";
    private static final String HITTER_STATS_URL = KBO_STATS_URL + "/Player/HitterBasic/Basic1.aspx";
    private static final String SCHEDULE_URL = KBO_URL + "/Schedule/Schedule.aspx";
    
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
    
    private void crawlSchedule() throws IOException {
        log.info("경기 일정 크롤링 시작");
        
        LocalDate now = LocalDate.now();
        
        // 현재 월과 다음 월의 일정 크롤링
        for (int monthOffset = 0; monthOffset <= 1; monthOffset++) {
            LocalDate targetDate = now.plusMonths(monthOffset);
            String year = String.valueOf(targetDate.getYear());
            String month = String.format("%02d", targetDate.getMonthValue());
            
            String scheduleUrl = SCHEDULE_URL + "?gameDate=" + year + "-" + month;
            
            log.info("{}-{} 월 경기 일정 크롤링", year, month);
            
            Document doc = Jsoup.connect(scheduleUrl)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();
            
            Elements scheduleTables = doc.select("div.schedule-wrap div.sch-wrap");
            
            for (Element scheduleTable : scheduleTables) {
                try {
                    Element dateElement = scheduleTable.selectFirst("h4");
                    if (dateElement == null) continue;
                    
                    String dateText = dateElement.text().trim();
                    if (dateText.isEmpty()) continue;
                    
                    // 날짜 형식: "2023.04.15 (토)"
                    String[] dateParts = dateText.split("\\s+")[0].split("\\.");
                    if (dateParts.length < 3) continue;
                    
                    int yearVal = Integer.parseInt(dateParts[0]);
                    int monthVal = Integer.parseInt(dateParts[1]);
                    int dayVal = Integer.parseInt(dateParts[2]);
                    
                    LocalDate gameDate = LocalDate.of(yearVal, monthVal, dayVal);
                    
                    Elements gameElements = scheduleTable.select("div.schedule-game");
                    for (Element gameElement : gameElements) {
                        Element timeElement = gameElement.selectFirst("div.time");
                        Element awayElement = gameElement.selectFirst("div.away span.team-name");
                        Element homeElement = gameElement.selectFirst("div.home span.team-name");
                        Element stadiumElement = gameElement.selectFirst("div.place");
                        
                        if (timeElement == null || awayElement == null || homeElement == null || stadiumElement == null) continue;
                        
                        String timeText = timeElement.text().trim();
                        String awayTeamName = awayElement.text().trim();
                        String homeTeamName = homeElement.text().trim();
                        String stadium = stadiumElement.text().trim();
                        
                        Optional<Team> awayTeam = teamService.getTeamByName(awayTeamName);
                        Optional<Team> homeTeam = teamService.getTeamByName(homeTeamName);
                        
                        if (awayTeam.isEmpty() || homeTeam.isEmpty()) {
                            log.warn("팀 정보를 찾을 수 없음: {} vs {}", awayTeamName, homeTeamName);
                            continue;
                        }
                        
                        // 시간 파싱
                        LocalDateTime gameDateTime;
                        if (timeText.equalsIgnoreCase("취소") || timeText.equalsIgnoreCase("미정")) {
                            continue;
                        } else {
                            String[] timeParts = timeText.split(":");
                            if (timeParts.length != 2) continue;
                            
                            int hour = Integer.parseInt(timeParts[0]);
                            int minute = Integer.parseInt(timeParts[1]);
                            gameDateTime = LocalDateTime.of(gameDate, java.time.LocalTime.of(hour, minute));
                        }
                        
                        // 이미 존재하는 경기인지 확인
                        List<Game> existingGames = gameService.getGamesByDateRange(
                            gameDateTime.withHour(0).withMinute(0),
                            gameDateTime.withHour(23).withMinute(59)
                        );
                        
                        boolean exists = false;
                        for (Game existingGame : existingGames) {
                            if (existingGame.getHomeTeam().getId().equals(homeTeam.get().getId()) &&
                                existingGame.getAwayTeam().getId().equals(awayTeam.get().getId())) {
                                exists = true;
                                break;
                            }
                        }
                        
                        if (!exists) {
                            Game game = new Game();
                            game.setHomeTeam(homeTeam.get());
                            game.setAwayTeam(awayTeam.get());
                            game.setGameDate(gameDateTime);
                            game.setStadium(stadium);
                            game.setStatus(Game.GameStatus.SCHEDULED);
                            
                            gameService.saveGame(game);
                            log.info("새 경기 일정 저장: {} vs {} @ {} ({})", 
                                    awayTeamName, homeTeamName, stadium, gameDateTime);
                        }
                    }
                } catch (Exception e) {
                    log.error("경기 일정 처리 중 오류", e);
                }
            }
        }
        
        log.info("경기 일정 크롤링 완료");
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