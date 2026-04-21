package com.kbo.baseball.service;

import com.kbo.baseball.model.Standing;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.model.SocialPost;
import com.kbo.baseball.repository.StandingRepository;
import com.kbo.baseball.repository.SocialPostRepository;
import com.kbo.baseball.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final StandingRepository standingRepository;
    private final SocialPostRepository socialPostRepository;

    @Transactional(readOnly = true)
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("팀을 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<Team> getTeamByName(String name) {
        return teamRepository.findByName(name);
    }

    @Transactional(readOnly = true)
    public List<Standing> getStandings() {
        return standingRepository.findAllByOrderByWinRateDesc();
    }

    @Transactional(readOnly = true)
    public List<SocialPost> getLatestInstagramPosts(Team team) {
        return socialPostRepository.findTop3ByTeamOrderByPublishedAtDesc(team);
    }

    @Transactional
    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }
}
