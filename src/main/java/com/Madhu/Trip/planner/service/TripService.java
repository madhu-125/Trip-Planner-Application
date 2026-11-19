package com.Madhu.Trip.planner.service;

import org.springframework.stereotype.Service;

import com.Madhu.Trip.planner.Repo.TripRepo;
import com.Madhu.Trip.planner.model.Trip;

import java.util.List;

@Service
public class TripService {

	TripRepo repository;

	public TripService(TripRepo repository) {
		this.repository = repository;
	}

	public Trip create(Trip trip) {
		return repository.save(trip);
	}

	public List<Trip> getAll() {
		return repository.findAll();
	}

	public Trip getById(Integer id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found: " + id));
	}

	public Trip update(Integer id, Trip trip) {
		Trip existing = getById(id);
		existing.setTitle(trip.getTitle());
		existing.setDescription(trip.getDescription());
		existing.setStartingLocation(trip.getStartingLocation());
		existing.setStartDate(trip.getStartDate());
		existing.setEndDate(trip.getEndDate());
		existing.setUserId(trip.getUserId());
		return repository.save(existing);
	}

	public void delete(Integer id) {
		repository.delete(getById(id));
	}
}
