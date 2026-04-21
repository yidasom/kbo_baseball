package com.kbo.baseball.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TeamInstagramResponse {
    private Long teamId;
    private String teamName;
    private String instagramUrl;
    private List<InstagramPostResponse> posts;
}
