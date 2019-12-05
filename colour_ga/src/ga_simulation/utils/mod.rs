use rand::prelude::*;
use std::{char, u8, f64};

pub fn order_population(population: &mut Vec<String>, fitness_func: &dyn Fn(&String, &String) -> f64, target: &String) {
    population.sort_by(|a, b| {
        let a_score = fitness_func(&a, &target);
        let b_score = fitness_func(&b, &target);
        a_score.partial_cmp(&b_score).unwrap()
    });
}

pub fn random_hexcode() -> String {
    // Generate 6 random numbers between 0-15 and convert them to base 16
    (0..6).map(|_| {
        char::from_digit(rand::thread_rng().gen_range(0, 16), 16).unwrap()
    }).collect()
}

pub fn hex_to_rgb(hexcode: &str) -> [u8; 3] {
    [
        u8::from_str_radix(&hexcode[0..2], 16).unwrap(), // R
        u8::from_str_radix(&hexcode[2..4], 16).unwrap(), // G
        u8::from_str_radix(&hexcode[4..6], 16).unwrap(), // B
    ]
}

pub fn colour_dist_fitness_func(organism: &String, target: &String) -> f64 {
    hex_to_rgb(&organism)
        .iter() // Convert array to iterator
        .zip(hex_to_rgb(&target).iter()) // Zip with target iterator
        .map(|(org_val, target_val)| f64::powf((target_val - org_val) as f64, 2.0)) // Square contents
        .sum::<f64>() // Sum resulting vec
        .sqrt() // Square root result
}

pub fn crossover(org_1: &str, org_2: &str) -> String {
    let split_idx = rand::thread_rng().gen_range(1, 6); // Generate number between 1-4 inclusive
    format!("{}{}", &org_1[..split_idx], &org_2[split_idx..]) // Split organisms at index and connect the 2 slices together
}

pub fn mutate(organism: &str) -> String {
    let mutate_idx = rand::thread_rng().gen_range(1, 5); // Generate number between 1-4 inclusive
    let mutation = char::from_digit(rand::thread_rng().gen_range(0, 16), 16).unwrap_or('f'); // Attempt to generate hex number, or default to f
    // Return new organism.
    format!("{}{}{}",
        &organism[..mutate_idx],
        mutation,
        &organism[(mutate_idx + 1)..]
    )
}
