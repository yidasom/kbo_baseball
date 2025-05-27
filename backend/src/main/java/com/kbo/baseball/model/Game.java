package com.kbo.baseball.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "home_team_id", nullable = false)
    private Team homeTeam;
    
    @ManyToOne
    @JoinColumn(name = "away_team_id", nullable = false)
    private Team awayTeam;
    
    private LocalDateTime gameDate;
    
    private String stadium;
    
    private Integer homeScore;
    
    private Integer awayScore;
    
    @Enumerated(EnumType.STRING)
    private GameStatus status; // SCHEDULED, IN_PROGRESS, COMPLETED, POSTPONED, CANCELED
    
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<InningScore> inningScores = new ArrayList<>();
    
    public enum GameStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, POSTPONED, CANCELED
    }
} 