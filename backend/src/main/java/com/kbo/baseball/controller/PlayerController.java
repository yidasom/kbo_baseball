package com.kbo.baseball.controller;

import com.kbo.baseball.model.Player;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.service.PlayerService;
import com.kbo.baseball.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerService playerService;
    private final TeamService teamService;
    
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);
        return ResponseEntity.ok(player);
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Player>> getPlayersByTeam(@PathVariable Long teamId) {
        Team team = teamService.getTeamById(teamId);
        List<Player> players = playerService.getPlayersByTeam(team);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/position/{position}")
    public ResponseEntity<List<Player>> getPlayersByPosition(@PathVariable String position) {
        List<Player> players = playerService.getPlayersByPosition(position);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/top-pitchers")
    public ResponseEntity<List<Player>> getTopPitchers() {
        List<Player> pitchers = playerService.getTopPitchers();
        return ResponseEntity.ok(pitchers);
    }
    
    @GetMapping("/top-hitters/average")
    public ResponseEntity<List<Player>> getTopHittersByAverage() {
        List<Player> hitters = playerService.getTopHittersByAverage();
        return ResponseEntity.ok(hitters);
    }
    
    @GetMapping("/top-hitters/home-runs")
    public ResponseEntity<List<Player>> getTopHittersByHomeRuns() {
        List<Player> hitters = playerService.getTopHittersByHomeRuns();
        return ResponseEntity.ok(hitters);
    }
} 