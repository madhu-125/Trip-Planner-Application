package com.Madhu.Trip.planner.service;

import org.springframework.stereotype.Service;

import com.Madhu.Trip.planner.Repo.ActivityRepo;
import com.Madhu.Trip.planner.model.Activity;

import java.util.List;

@Service
public class ActivitySevrice {

	ActivityRepo repository;

	public ActivitySevrice(ActivityRepo repository) {
		this.repository = repository;
	}

	public Activity create(Activity activity) {
		return repository.save(activity);
	}

	public List<Activity> getAll() {
		return repository.findAll();
	}

	public Activity getById(Integer id) {
		return repository.findById(id).orElseThrow(() -> new RuntimeException("Activity not found: " + id));
	}

	public Activity update(Integer id, Activity activity) {
		Activity existing = getById(id);
		existing.setName(activity.getName());
		existing.setDescription(activity.getDescription());
		existing.setScheduledAt(activity.getScheduledAt());
		existing.setTripId(activity.getTripId());
		return repository.save(existing);
	}

	public void delete(Integer id) {
		repository.delete(getById(id));
	}
}
