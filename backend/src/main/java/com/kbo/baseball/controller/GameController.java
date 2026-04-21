package com.kbo.baseball.controller;

import com.kbo.baseball.dto.GameSummaryResponse;
import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.service.GameService;
import com.kbo.baseball.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping(params = "!date")
    public ResponseEntity<List<GameSummaryResponse>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames().stream()
                .map(this::toSummaryResponse)
                .toList());
    }

    @GetMapping(params = "date")
    public ResponseEntity<List<GameSummaryResponse>> getGamesByDateQuery(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(getGamesForDate(date));
    }

    @GetMapping("/today")
    public ResponseEntity<List<GameSummaryResponse>> getTodayGames() {
        return ResponseEntity.ok(getGamesForDate(LocalDate.now()));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<GameSummaryResponse>> getRecentResults(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(gameService.getRecentResults(limit).stream()
                .map(this::toSummaryResponse)
                .toList());
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<GameSummaryResponse>> getGamesByTeam(@PathVariable Long teamId) {
        Team team = teamService.getTeamById(teamId);
        return ResponseEntity.ok(gameService.getGamesByTeam(team).stream()
                .map(this::toSummaryResponse)
                .toList());
    }

    private List<GameSummaryResponse> getGamesForDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        return gameService.getGamesByDateRange(start, end).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    private GameSummaryResponse toSummaryResponse(Game game) {
        return GameSummaryResponse.builder()
                .id(game.getId())
                .date(game.getDate() != null ? game.getDate().toString() : null)
                .homeTeamId(game.getHomeTeam().getId())
                .homeTeamName(game.getHomeTeam().getName())
                .awayTeamId(game.getAwayTeam().getId())
                .awayTeamName(game.getAwayTeam().getName())
                .homeScore(game.getHomeScore())
                .awayScore(game.getAwayScore())
                .status(game.getStatus() != null ? game.getStatus().name() : "scheduled")
                .stadium(game.getStadium())
                .updatedAt(game.getUpdatedAt() != null ? game.getUpdatedAt().toString() : null)
                .build();
    }
}
