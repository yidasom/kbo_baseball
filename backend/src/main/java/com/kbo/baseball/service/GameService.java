package com.kbo.baseball.service;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.InningScore;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.repository.GameRepository;
import com.kbo.baseball.repository.InningScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final InningScoreRepository inningScoreRepository;
    
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
        return gameRepository.findByGameDateBetween(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public List<Game> getGamesByTeam(Team team) {
        return gameRepository.findByHomeTeamOrAwayTeam(team, team);
    }
    
    @Transactional(readOnly = true)
    public List<Game> getUpcomingGames() {
        return gameRepository.findUpcomingGames();
    }
    
    @Transactional(readOnly = true)
    public List<Game> getGamesByStatus(Game.GameStatus status) {
        return gameRepository.findByStatus(status);
    }
    
    @Transactional(readOnly = true)
    public Optional<Game> getGameByKboKey(String kboGameKey) {
        return gameRepository.findByKboGameKey(kboGameKey);
    }
    
    @Transactional
    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }
    
    @Transactional
    public void updateGameScore(Game game, List<InningScore> inningScores) {
        for (InningScore inningScore : inningScores) {
            inningScoreRepository.save(inningScore);
        }
        
        // 총 점수 계산
        Integer homeScore = inningScoreRepository.getTotalHomeScore(game);
        Integer awayScore = inningScoreRepository.getTotalAwayScore(game);
        
        game.setHomeScore(homeScore != null ? homeScore : 0);
        game.setAwayScore(awayScore != null ? awayScore : 0);
        
        gameRepository.save(game);
    }
    
    @Transactional(readOnly = true)
    public List<InningScore> getInningScoresByGame(Game game) {
        return inningScoreRepository.findByGame(game);
    }
} 