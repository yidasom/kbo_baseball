package com.kbo.baseball.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String position; // 투수, 포수, 내야수, 외야수
    
    private Integer number; // 등번호
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
    
    private String birthDate;
    
    private Integer height;
    
    private Integer weight;
    
    private String profileImageUrl;
    
    // 타자 통계
    private Integer games;
    private Integer atBats;
    private Integer hits;
    private Integer homeRuns;
    private Integer rbi;
    private Integer runs;
    private Integer stolenBases;
    private Double battingAverage;
    private Double onBasePercentage;
    private Double sluggingPercentage;
    private Double ops; // On-base Plus Slugging
    
    // 투수 통계
    private Integer wins;
    private Integer losses;
    private Double era;
    private Integer inningsPitched;
    private Integer strikeouts;
    private Integer walks;
    private Integer saves;
    private Integer holds;
    private Integer qualityStarts;
    private Integer completeGames;
} 