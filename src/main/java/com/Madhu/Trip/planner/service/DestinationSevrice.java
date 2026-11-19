package com.Madhu.Trip.planner.service;

import org.springframework.stereotype.Service;

import com.Madhu.Trip.planner.Repo.DestinationRepo;
import com.Madhu.Trip.planner.model.Destination;

import java.util.List;

@Service
public class DestinationSevrice {

	DestinationRepo repository;

	public DestinationSevrice(DestinationRepo repository) {
		this.repository = repository;
	}

	public Destination create(Destination destination) {
		return repository.save(destination);
	}

	public List<Destination> getAll() {
		return repository.findAll();
	}

	public Destination getById(Integer id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("Destination not found: " + id));
	}

	public Destination update(Integer id, Destination destination) {
		Destination existing = getById(id);
		existing.setName(destination.getName());
		existing.setCountry(destination.getCountry());
		existing.setDescription(destination.getDescription());
		existing.setTripId(destination.getTripId());
		return repository.save(existing);
	}

	public void delete(Integer id) {
		repository.delete(getById(id));
	}
}
