package com.Madhu.Trip.planner.service;

import org.springframework.stereotype.Service;

import com.Madhu.Trip.planner.Repo.UserRepo;
import com.Madhu.Trip.planner.model.User;

import java.util.List;

@Service
public class UserService {

	UserRepo repository;

	UserService(UserRepo repository) {
		this.repository = repository;
	}

	public User create(User user) {
		return repository.save(user);
	}

	public List<User> getAll() {
		return repository.findAll();
	}

	public User getById(Integer id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("User not found: " + id));
	}

	public User update(Integer id, User user) {
		User existing = getById(id);
		existing.setName(user.getName());
		existing.setEmail(user.getEmail());
		existing.setPassword(user.getPassword());
		return repository.save(existing);
	}

	public void delete(Integer id) {
		User existing = getById(id);
		repository.delete(existing);
	}
}
