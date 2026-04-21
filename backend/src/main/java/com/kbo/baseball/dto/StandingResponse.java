package com.kbo.baseball.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StandingResponse {
    private Long teamId;
    private String teamName;
    private Integer games;
    private Integer wins;
    private Integer losses;
    private Double winRate;
    private List<String> recentForm;
    private String updatedAt;
}
