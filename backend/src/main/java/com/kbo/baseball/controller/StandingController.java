package com.kbo.baseball.controller;

import com.kbo.baseball.dto.StandingResponse;
import com.kbo.baseball.model.Standing;
import com.kbo.baseball.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/standings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StandingController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<List<StandingResponse>> getStandings() {
        return ResponseEntity.ok(teamService.getStandings().stream()
                .map(this::toResponse)
                .toList());
    }

    private StandingResponse toResponse(Standing standing) {
        return StandingResponse.builder()
                .teamId(standing.getTeam().getId())
                .teamName(standing.getTeam().getName())
                .games(standing.getGames())
                .wins(standing.getWins())
                .losses(standing.getLosses())
                .winRate(standing.getWinRate())
                .recentForm(parseRecentForm(standing.getRecentForm()))
                .updatedAt(standing.getUpdatedAt() != null ? standing.getUpdatedAt().toString() : null)
                .build();
    }

    private List<String> parseRecentForm(String recentForm) {
        if (recentForm == null || recentForm.isBlank()) {
            return List.of();
        }

        return Arrays.stream(recentForm.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .toList();
    }
}
