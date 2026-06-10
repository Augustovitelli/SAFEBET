package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Augusto.oddsapi.entity.BetSelectionEntity;

public interface BetSelectionRepository extends JpaRepository<BetSelectionEntity, Long> {
}