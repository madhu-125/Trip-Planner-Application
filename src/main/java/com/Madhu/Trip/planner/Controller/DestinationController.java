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

import com.Madhu.Trip.planner.model.Destination;
import com.Madhu.Trip.planner.service.DestinationSevrice;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {
	
	DestinationSevrice service;

     DestinationController(DestinationSevrice service) {
        this.service = service;
    }

    @PostMapping
     Destination create(@RequestBody Destination destination) {
        return service.create(destination);
    }

    @GetMapping
     List<Destination> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
     Destination getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
     Destination update(@PathVariable Integer id,
                              @RequestBody Destination destination) {
        return service.update(id, destination);
    }

    @DeleteMapping("/{id}")
     String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Destination deleted successfully";
    }
}
