package com.Madhu.Trip.planner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "destinations")
@Setter
@Getter
@NoArgsConstructor
public class Destination {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	String name;
	String country;
	String description;
	Long tripId;

}
