pub mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SimulationResult {
    score: f64,
    value: String
}

#[wasm_bindgen]
impl SimulationResult {
    pub fn new(score: f64, value: String) -> Self {
        SimulationResult { score, value }
    }

    pub fn get_score(&self) -> f64 {
        self.score
    }

    pub fn get_value(&self) -> String {
        String::from(&self.value)
    }
}

#[wasm_bindgen]
pub struct GASimulation {
    target_colour: String,
    population_size: usize,
    mutation_rate: f32,
    _population_history: Vec<Vec<String>>,
    _population: Vec<String>,
    _running: bool,
}

#[wasm_bindgen]
impl GASimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(target_colour: String, population_size: usize, mutation_rate: f32) -> Self {
        GASimulation {
            target_colour,
            population_size,
            mutation_rate,
            _population_history: Vec::new(),
            _population: Vec::with_capacity(population_size),
            _running: false
        }
    }

    pub fn simulate_generation(&mut self, fitness_func: &js_sys::Function) -> Result<SimulationResult, JsValue> {
        // Order the population
        utils::order_population(&mut self._population, fitness_func, &self.target_colour);
        Ok(SimulationResult::new(0.0, "ffffff".to_owned()))
    }

    pub fn get_generation_population(&self, generation: usize) -> Result<Vec<JsValue>, JsValue> {
        if generation > self._population.len() {
            return Err(JsValue::from("Invalid generation number!"));
        }
        Ok(self._population_history[generation].iter().map(JsValue::from).collect())
    }
}
