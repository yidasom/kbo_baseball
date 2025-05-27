package com.kbo.baseball.repository;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.InningScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InningScoreRepository extends JpaRepository<InningScore, Long> {
    List<InningScore> findByGame(Game game);
    
    List<InningScore> findByGameAndInningNumber(Game game, Integer inningNumber);
    
    @Query("SELECT SUM(is.score) FROM InningScore is WHERE is.game = ?1 AND is.isTopInning = true")
    Integer getTotalAwayScore(Game game);
    
    @Query("SELECT SUM(is.score) FROM InningScore is WHERE is.game = ?1 AND is.isTopInning = false")
    Integer getTotalHomeScore(Game game);
} 