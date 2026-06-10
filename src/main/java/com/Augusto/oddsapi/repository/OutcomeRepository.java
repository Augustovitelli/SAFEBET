package com.Augusto.oddsapi.repository;

import com.Augusto.oddsapi.entity.OutcomeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutcomeRepository extends JpaRepository<OutcomeEntity, Long> {

    List<OutcomeEntity> findByName(String name);

    List<OutcomeEntity> findByMarketId(Long marketId);

}