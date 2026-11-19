package com.Madhu.Trip.planner.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Madhu.Trip.planner.model.Activity;
import com.Madhu.Trip.planner.service.ActivitySevrice;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

	ActivitySevrice service;

	ActivityController(ActivitySevrice service) {
		this.service = service;
	}

	@PostMapping
	Activity create(@RequestBody Activity activity) {
		return service.create(activity);
	}

	@GetMapping
	List<Activity> getAll() {
		return service.getAll();
	}

	@GetMapping("/{id}")
	Activity getById(@PathVariable Integer id) {
		return service.getById(id);
	}

	@PutMapping("/{id}")
	Activity update(@PathVariable Integer id, @RequestBody Activity activity) {
		return service.update(id, activity);
	}

	@DeleteMapping("/{id}")
	String delete(@PathVariable Integer id) {
		service.delete(id);
		return "Activity deleted successfully";
	}
}
