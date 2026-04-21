package com.kbo.baseball.repository;

import com.kbo.baseball.model.Standing;
import com.kbo.baseball.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StandingRepository extends JpaRepository<Standing, Long> {
    List<Standing> findAllByOrderByWinRateDesc();

    Optional<Standing> findByTeam(Team team);
}
