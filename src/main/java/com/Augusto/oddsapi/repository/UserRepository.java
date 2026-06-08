package com.Augusto.oddsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Augusto.oddsapi.entity.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @Query("SELECT u FROM UserEntity u WHERE u.email = :email")
    UserEntity findByEmail(@Param("email") String email);

}