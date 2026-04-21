package com.kbo.baseball.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InstagramPostResponse {
    private Long id;
    private String postUrl;
    private String mediaUrl;
    private String caption;
    private String publishedAt;
}
