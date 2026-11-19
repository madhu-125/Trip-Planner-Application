package com.Madhu.Trip.planner.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Madhu.Trip.planner.model.Trip;

@Repository
public interface TripRepo extends JpaRepository<Trip, Integer> {

}
