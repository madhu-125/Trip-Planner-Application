package com.Madhu.Trip.planner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "trips")
@Setter
@Getter
@NoArgsConstructor
public class Trip {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	String title;
	String description;
	String startingLocation;
	LocalDate startDate;
	LocalDate endDate;
	Long userId;

}
