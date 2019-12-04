pub mod utils;

use wasm_bindgen::prelude::*;
use rand::prelude::*;

#[wasm_bindgen]
pub struct SimulationResult {
    generation_number: usize,
    score: f64,
    value: String
}

#[wasm_bindgen]
impl SimulationResult {
    pub fn new(generation_number: usize, score: f64, value: String) -> Self {
        SimulationResult { generation_number, score, value }
    }

    pub fn get_score(&self) -> f64 {
        self.score
    }

    pub fn get_value(&self) -> String {
        String::from(&self.value)
    }

    pub fn get_generation_number(&self) -> usize {
        self.generation_number
    }
}

#[wasm_bindgen]
pub struct GASimulation {
    target_colour: String,
    population_size: usize,
    mutation_rate: f32,
    _population: Vec<String>,
    _generation_number: usize,
    _generation_history: Vec<Vec<String>>,
}

#[wasm_bindgen]
impl GASimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(target_colour: String, population_size: usize, mutation_rate: f32) -> Self {
        // Initialise population
        let _population: Vec<String> = (0..population_size).map(|_| {
            utils::random_hexcode()
        }).collect();
        GASimulation {
            target_colour,
            population_size,
            mutation_rate,
            _population,
            _generation_number: 0,
            _generation_history: Vec::new(),
        }
    }

    // FIXME: Currently causing a panic when run in the JS
    pub fn simulate_generation(&mut self, fitness_func: &js_sys::Function) -> Result<SimulationResult, JsValue> {
        // Order the population
        utils::order_population(&mut self._population, fitness_func, &self.target_colour);
        // Append population to generation history
        self._generation_history.push(self._population.clone());
        // Increment generation number
        self._generation_number += 1;
        // Create simulation result
        let this = JsValue::NULL;
        let target = JsValue::from(&self.target_colour);
        let top_organism = JsValue::from(&self._population[0]);
        let top_organism_score = fitness_func.call2(&this, &top_organism, &target)?.as_f64().unwrap();
        let result = SimulationResult::new(
            self._generation_number,
            top_organism_score,
            String::from(&self._population[0])
        );
        // Cull bottom 50% of population
        self._population = self._population[0..self.population_size / 2].to_vec();
        // For new population
        let mut new_population: Vec<String> = Vec::with_capacity(self.population_size / 2);
        let mut random = rand::thread_rng();
        // Crossover and mutation to fill 45%
        let crossover_count = (self.population_size as f32 * 0.45) as usize;
        for _ in 0..crossover_count {
            let org_1 = &self._population[random.gen_range(0, crossover_count)];
            let org_2 = &self._population[random.gen_range(0, crossover_count)];
            let mut new_org = utils::crossover(org_1, org_2);
            // Mutate
            if rand::thread_rng().gen::<f32>() <= self.mutation_rate {
                new_org = utils::mutate(&new_org);
            }
            new_population.push(new_org);
        }
        // Fill remaining 5% with random organisms
        let remaining_count = (self.population_size as f32 * 0.05) as usize;
        for _ in 0..remaining_count {
            new_population.push(utils::random_hexcode());
        }
        // Append new population
        self._population.append(&mut new_population);
        // Return simulation result
        Ok(result)
    }

    pub fn get_generation_population(&self, generation: usize) -> Result<Vec<JsValue>, JsValue> {
        if generation > self._population.len() {
            return Err(JsValue::from("Invalid generation number!"));
        }
        Ok(self._generation_history[generation].iter().map(JsValue::from).collect())
    }
}
