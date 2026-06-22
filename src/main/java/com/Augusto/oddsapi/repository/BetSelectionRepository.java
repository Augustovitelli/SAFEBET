package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Augusto.oddsapi.entity.BetSelectionEntity;
import java.util.List;

public interface BetSelectionRepository extends JpaRepository<BetSelectionEntity, Long> {

    @Query("SELECT s FROM BetSelectionEntity s WHERE s.game.footballDataId = :footballDataId AND s.bet.status = 'OPEN' AND (s.result IS NULL OR s.result = 'OPEN')")
    List<BetSelectionEntity> findOpenByGameFootballDataId(@Param("footballDataId") String footballDataId);
}