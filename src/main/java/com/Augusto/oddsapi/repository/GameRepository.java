package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Augusto.oddsapi.entity.GameEntity;

public interface GameRepository extends JpaRepository<GameEntity, Long> {

}