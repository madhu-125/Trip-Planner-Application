package com.Madhu.Trip.planner.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Madhu.Trip.planner.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer>{

	List<User> findAll();

}
