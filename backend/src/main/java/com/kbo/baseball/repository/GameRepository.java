package com.kbo.baseball.repository;

import com.kbo.baseball.model.Game;
import com.kbo.baseball.model.Team;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByDateBetweenOrderByDateAsc(LocalDateTime start, LocalDateTime end);

    List<Game> findByHomeTeamOrAwayTeamOrderByDateDesc(Team homeTeam, Team awayTeam);

    List<Game> findByStatusOrderByDateAsc(Game.GameStatus status);

    List<Game> findByStatusOrderByDateDesc(Game.GameStatus status, Pageable pageable);

    Optional<Game> findBySourceGameId(String sourceGameId);
}
