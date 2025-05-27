package com.kbo.baseball.repository;

import com.kbo.baseball.model.Player;
import com.kbo.baseball.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeam(Team team);
    
    Optional<Player> findByNameAndTeam(String name, Team team);
    
    List<Player> findByPosition(String position);
    
    @Query("SELECT p FROM Player p WHERE p.position = '투수' ORDER BY p.era ASC")
    List<Player> findTopPitchersByEra();
    
    @Query("SELECT p FROM Player p WHERE p.position != '투수' ORDER BY p.battingAverage DESC")
    List<Player> findTopHittersByBattingAverage();
    
    @Query("SELECT p FROM Player p WHERE p.position != '투수' ORDER BY p.homeRuns DESC")
    List<Player> findTopHittersByHomeRuns();
} 