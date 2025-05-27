package com.kbo.baseball.controller;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.InningScore;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.service.GameService;
import com.kbo.baseball.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;
    private final TeamService teamService;
    
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
} 