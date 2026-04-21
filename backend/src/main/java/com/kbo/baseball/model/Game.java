package com.kbo.baseball.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private LocalDateTime date;
    
    private String stadium;
    
    private Integer homeScore;
    
    private Integer awayScore;
    
    @Enumerated(EnumType.STRING)
    private GameStatus status; // scheduled, live, finished, postponed, canceled

    @Column(unique = true)
    private String sourceGameId;

    private LocalDateTime updatedAt;

    public enum GameStatus {
        scheduled, live, finished, postponed, canceled
    }
}
