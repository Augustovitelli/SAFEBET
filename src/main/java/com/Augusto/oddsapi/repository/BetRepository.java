package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Augusto.oddsapi.entity.BetEntity;
import java.util.List;

public interface BetRepository extends JpaRepository<BetEntity, Long> {
    List<BetEntity> findByUserId(Long userId);
}