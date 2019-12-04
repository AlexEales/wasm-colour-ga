use rand::prelude::*;
use std::{char, u8, f64};

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
