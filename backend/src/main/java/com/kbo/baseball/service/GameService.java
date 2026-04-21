package com.kbo.baseball.service;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    @Transactional(readOnly = true)
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Game getGameById(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("경기를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public List<Game> getGamesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return gameRepository.findByDateBetweenOrderByDateAsc(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Game> getGamesByTeam(Team team) {
        return gameRepository.findByHomeTeamOrAwayTeamOrderByDateDesc(team, team);
    }

    @Transactional(readOnly = true)
    public List<Game> getGamesByStatus(Game.GameStatus status) {
        return gameRepository.findByStatusOrderByDateAsc(status);
    }

    @Transactional(readOnly = true)
    public List<Game> getRecentResults(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 20));
        return gameRepository.findByStatusOrderByDateDesc(
                Game.GameStatus.finished,
                PageRequest.of(0, safeLimit));
    }

    @Transactional(readOnly = true)
    public Optional<Game> getGameBySourceGameId(String sourceGameId) {
        return gameRepository.findBySourceGameId(sourceGameId);
    }

    @Transactional
    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }
}
