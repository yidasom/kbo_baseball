package com.kbo.baseball.repository;

import com.kbo.baseball.model.SocialPost;
import com.kbo.baseball.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialPostRepository extends JpaRepository<SocialPost, Long> {
    List<SocialPost> findTop3ByTeamOrderByPublishedAtDesc(Team team);
}
