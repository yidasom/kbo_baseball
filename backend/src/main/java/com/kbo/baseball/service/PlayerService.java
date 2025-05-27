package com.kbo.baseball.service;

import com.kbo.baseball.model.Player;
import com.kbo.baseball.model.Team;
import com.kbo.baseball.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    
    @Transactional(readOnly = true)
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Player getPlayerById(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("선수를 찾을 수 없습니다: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Player> getPlayersByTeam(Team team) {
        return playerRepository.findByTeam(team);
    }
    
    @Transactional(readOnly = true)
    public List<Player> getPlayersByPosition(String position) {
        return playerRepository.findByPosition(position);
    }
    
    @Transactional(readOnly = true)
    public List<Player> getTopPitchers() {
        return playerRepository.findTopPitchersByEra();
    }
    
    @Transactional(readOnly = true)
    public List<Player> getTopHittersByAverage() {
        return playerRepository.findTopHittersByBattingAverage();
    }
    
    @Transactional(readOnly = true)
    public List<Player> getTopHittersByHomeRuns() {
        return playerRepository.findTopHittersByHomeRuns();
    }
    
    @Transactional
    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }
    
    @Transactional
    public void updatePlayerStats(Player player) {
        playerRepository.save(player);
    }
} 