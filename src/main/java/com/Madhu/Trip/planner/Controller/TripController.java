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

import com.Madhu.Trip.planner.model.Trip;
import com.Madhu.Trip.planner.service.TripService;

@RestController
@RequestMapping("/api/trips")
public class TripController {

	TripService service;

	TripController(TripService service) {
		this.service = service;
	}

	@PostMapping
	Trip create(@RequestBody Trip trip) {
		return service.create(trip);
	}

	@GetMapping
	List<Trip> getAll() {
		return service.getAll();
	}

	@GetMapping("/{id}")
	Trip getById(@PathVariable Integer id) {
		return service.getById(id);
	}

	@PutMapping("/{id}")
	Trip update(@PathVariable Integer id, @RequestBody Trip trip) {
		return service.update(id, trip);
	}

	@DeleteMapping("/{id}")
	String delete(@PathVariable Integer id) {
		service.delete(id);
		return "Trip deleted successfully";
	}
}
