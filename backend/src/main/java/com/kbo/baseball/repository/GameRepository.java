package com.kbo.baseball.repository;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByGameDateBetween(LocalDateTime start, LocalDateTime end);
    
    List<Game> findByHomeTeamOrAwayTeam(Team homeTeam, Team awayTeam);
    
    List<Game> findByStatus(Game.GameStatus status);
    
    @Query("SELECT g FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team) AND g.gameDate BETWEEN :startDate AND :endDate")
    List<Game> findTeamGamesByDateRange(@Param("team") Team team, 
                                       @Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
                                       
    @Query("SELECT g FROM Game g WHERE g.gameDate >= CURRENT_DATE ORDER BY g.gameDate ASC")
    List<Game> findUpcomingGames();
} 