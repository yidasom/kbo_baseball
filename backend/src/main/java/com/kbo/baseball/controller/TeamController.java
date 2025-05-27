package com.kbo.baseball.controller;

import com.kbo.baseball.model.Team;
import com.kbo.baseball.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;
    
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }
    
    @GetMapping("/standings")
    public ResponseEntity<List<Team>> getTeamStandings() {
        List<Team> teams = teamService.getAllTeams();
        // 승률 순으로 정렬
        teams.sort((a, b) -> {
            if (a.getWinningPercentage() == null || b.getWinningPercentage() == null) {
                return 0;
            }
            return Double.compare(b.getWinningPercentage(), a.getWinningPercentage());
        });
        return ResponseEntity.ok(teams);
    }
} 