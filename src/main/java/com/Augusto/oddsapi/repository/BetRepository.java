package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Augusto.oddsapi.entity.BetEntity;

public interface BetRepository extends JpaRepository<BetEntity, Long> {
}