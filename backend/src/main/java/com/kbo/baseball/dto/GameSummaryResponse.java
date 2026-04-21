package com.kbo.baseball.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameSummaryResponse {
    private Long id;
    private String date;
    private Long homeTeamId;
    private String homeTeamName;
    private Long awayTeamId;
    private String awayTeamName;
    private Integer homeScore;
    private Integer awayScore;
    private String status;
    private String stadium;
    private String updatedAt;
}
