package com.kbo.baseball.controller;

import com.kbo.baseball.dto.InstagramPostResponse;
import com.kbo.baseball.dto.TeamInstagramResponse;
import com.kbo.baseball.model.SocialPost;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/instagram")
    public ResponseEntity<List<TeamInstagramResponse>> getTeamInstagramFeeds() {
        return ResponseEntity.ok(teamService.getAllTeams().stream()
                .map(this::toInstagramResponse)
                .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    private TeamInstagramResponse toInstagramResponse(Team team) {
        return TeamInstagramResponse.builder()
                .teamId(team.getId())
                .teamName(team.getName())
                .instagramUrl(team.getInstagramUrl())
                .posts(teamService.getLatestInstagramPosts(team).stream()
                        .map(this::toPostResponse)
                        .toList())
                .build();
    }

    private InstagramPostResponse toPostResponse(SocialPost post) {
        return InstagramPostResponse.builder()
                .id(post.getId())
                .postUrl(post.getPostUrl())
                .mediaUrl(post.getMediaUrl())
                .caption(post.getCaption())
                .publishedAt(post.getPublishedAt() != null ? post.getPublishedAt().toString() : null)
                .build();
    }
}
