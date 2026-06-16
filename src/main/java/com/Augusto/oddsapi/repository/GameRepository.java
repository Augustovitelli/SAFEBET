package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Augusto.oddsapi.entity.GameEntity;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<GameEntity, Long> {
    Optional<GameEntity> findByFootballDataId(String footballDataId);
    Optional<GameEntity> findByHomeTeamAndAwayTeam(String homeTeam, String awayTeam);
    List<GameEntity> findByCommenceTimeAfter(OffsetDateTime dateTime);
    List<GameEntity> findByCommenceTimeBeforeAndFootballDataIdNotNull(OffsetDateTime dateTime);
}