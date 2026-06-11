package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Augusto.oddsapi.entity.GameEntity;
import java.util.Optional;

public interface GameRepository extends JpaRepository<GameEntity, Long> {
    Optional<GameEntity> findByFootballDataId(String footballDataId);
}