package com.Madhu.Trip.planner.Controller;

import org.springframework.web.bind.annotation.*;

import com.Madhu.Trip.planner.model.User;
import com.Madhu.Trip.planner.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return service.create(user);
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Integer id,
                       @RequestBody User user) {
        return service.update(id, user);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "User deleted successfully";
    }
}
