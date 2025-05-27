package com.kbo.baseball.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "inning_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InningScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    private Integer inningNumber;
    
    private boolean isTopInning; // true: 초(원정팀 공격), false: 말(홈팀 공격)
    
    private Integer score;
    
    private Integer hits;
    
    private Integer errors;
    
    private Integer leftOnBase; // 잔루
} 