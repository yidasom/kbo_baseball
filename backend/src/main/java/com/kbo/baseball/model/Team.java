package com.kbo.baseball.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String stadium;
    
    private String logoUrl;
    
    private String foundedYear;
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<Player> players = new ArrayList<>();
    
    // 팀 통계 정보
    private Integer games;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Double winningPercentage;
    private Integer consecutiveWins;
    private Integer consecutiveLosses;
    private Integer homeRuns;
    private Double teamBattingAverage;
    private Double teamEra;
} 