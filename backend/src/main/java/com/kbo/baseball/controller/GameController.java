package com.kbo.baseball.controller;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.InningScore;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.service.GameService;
import com.kbo.baseball.service.TeamService;
import com.kbo.baseball.service.CrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;
    private final TeamService teamService;
    private final CrawlerService crawlerService;
    
    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        Game game = gameService.getGameById(id);
        return ResponseEntity.ok(game);
    }
    
    @GetMapping("/date")
    public ResponseEntity<List<Game>> getGamesByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        List<Game> games = gameService.getGamesByDateRange(start, end);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Game>> getGamesByTeam(@PathVariable Long teamId) {
        Team team = teamService.getTeamById(teamId);
        List<Game> games = gameService.getGamesByTeam(team);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Game>> getUpcomingGames() {
        List<Game> games = gameService.getUpcomingGames();
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Game>> getGamesByStatus(@PathVariable Game.GameStatus status) {
        List<Game> games = gameService.getGamesByStatus(status);
        return ResponseEntity.ok(games);
    }
    
    @GetMapping("/{gameId}/innings")
    public ResponseEntity<List<InningScore>> getInningScoresByGame(@PathVariable Long gameId) {
        Game game = gameService.getGameById(gameId);
        List<InningScore> inningScores = gameService.getInningScoresByGame(game);
        return ResponseEntity.ok(inningScores);
    }
    
    @PostMapping("/real-time-update")
    public ResponseEntity<Map<String, String>> updateRealTimeData() {
        Map<String, String> response = new HashMap<>();
        
        try {
            // 당일 기준 실시간 데이터 크롤링
            crawlerService.crawlTodayData();
            
            response.put("status", "success");
            response.put("message", "실시간 데이터 업데이트가 완료되었습니다.");
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "실시간 데이터 업데이트 중 오류가 발생했습니다: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.status(500).body(response);
        }
    }
} 