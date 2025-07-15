package com.kbo.baseball.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class KboScheduleResponse {
    
    @JsonProperty("d")
    private String data;
    
    // API에서 JSON 문자열로 받아온 실제 스케줄 데이터
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ScheduleData {
        
        @JsonProperty("rows")
        private List<GameRow> rows;
        
        @JsonProperty("totcnt")
        private int totalCount;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GameRow {
        
        @JsonProperty("GDATE")
        private String gameDate;          // 경기 날짜 (예: "20250103")
        
        @JsonProperty("GTIME")
        private String gameTime;          // 경기 시간 (예: "1800")
        
        @JsonProperty("GMKEY")
        private String gameKey;           // 경기 고유 키
        
        @JsonProperty("STADIUM")
        private String stadium;           // 경기장
        
        @JsonProperty("HTEAM")
        private String homeTeam;          // 홈팀
        
        @JsonProperty("ATEAM")
        private String awayTeam;          // 원정팀
        
        @JsonProperty("HNAME")
        private String homeTeamName;      // 홈팀 이름
        
        @JsonProperty("ANAME")
        private String awayTeamName;      // 원정팀 이름
        
        @JsonProperty("HSCORE")
        private String homeScore;         // 홈팀 점수
        
        @JsonProperty("ASCORE")
        private String awayScore;         // 원정팀 점수
        
        @JsonProperty("STATUS")
        private String status;            // 경기 상태 (예: "예정", "진행중", "종료")
        
        @JsonProperty("CANCEL_FLAG")
        private String cancelFlag;        // 취소 여부 플래그
        
        @JsonProperty("POSTPON_FLAG")
        private String postponeFlag;      // 연기 여부 플래그
        
        @JsonProperty("INNING")
        private String inning;            // 현재 이닝 정보
        
        @JsonProperty("TOPBTM")
        private String topBottom;         // 초/말 구분
        
        @JsonProperty("BROADCAST")
        private String broadcast;         // 중계 정보
    }
} 