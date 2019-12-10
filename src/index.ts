import module from '../colour_ga/Cargo.toml';

import {
    GenerationDisplay,
    BASE_ATTR as DISPLAY_BASE_ATTR,
    EVENTS as DISPLAY_EVENTS
} from './components/GenerationDisplay';
import { GenerationDisplayCard, BASE_ATTR as CARD_BASE_ATTR } from './components/GenerationDisplayCard';

// TODO: Add in form validation before running simulation

// CONSTANTS
const FORM_ELEMENTS: object = {
    'TARGET_COLOUR': {
        'input': document.querySelector('#target-colour-input') as HTMLFormElement,
        'display': document.querySelector('#target-colour-display') as HTMLElement,
        'default': '#81E6D9'
    },
    'POPULATION_SIZE': {
        'input': document.querySelector('#population-size-input') as HTMLFormElement,
        'default': '1000'
    },
    'MUTATION_RATE': {
        'input': document.querySelector('#mutation-rate-input') as HTMLFormElement,
        'default': '0.2'
    }
};

const RUN_BUTTON = document.querySelector('#run-button');
const STOP_BUTTON = document.querySelector('#stop-button');
const RESET_BUTTON = document.querySelector('#reset-button');

// GLOBAL VARIABLES
let simulation: module.GASimulation;
let simLoopHandle: number;

// FUNCTIONS
const updateColourDisplay = () => {
    // Update the colour display when input changes.
    let colour = FORM_ELEMENTS['TARGET_COLOUR']['input'].value;
    if (!colour.startsWith('#')) {
        colour = '#' + colour;
    }
    FORM_ELEMENTS['TARGET_COLOUR']['display'].style.backgroundColor = colour;
};

const resetSimulationParams = () => {
    // Set form values back to default
    for (let key in FORM_ELEMENTS) {
        FORM_ELEMENTS[key].input.value = FORM_ELEMENTS[key].default;
    }
    // Update the target colour display
    updateColourDisplay();
};

const updateGenerationDisplay = (simulationResult: module.SimulationResult) => {
    // Add generation card to the display
    let generation = simulationResult.get_generation_number();
    let colour = simulationResult.get_value();
    let score = Math.round(simulationResult.get_score() * 100) / 100;
    // Dispatch an update event to the display to create a new card
    window.dispatchEvent(new CustomEvent(DISPLAY_EVENTS.UPDATE, { detail: {
        'generation': generation,
        'colour': colour,
        'score': score
    }}));
};

const createSimulation = () => {
    // Create simulation instance using form input
    let targetColour: string = FORM_ELEMENTS['TARGET_COLOUR']['input'].value.substring(1);
    let populationSize: number = FORM_ELEMENTS['POPULATION_SIZE']['input'].value;
    let mutationRate: number = FORM_ELEMENTS['MUTATION_RATE']['input'].value;
    simulation = new module.GASimulation(targetColour, populationSize, mutationRate);
};

const runSimulation = () => {
    console.log('Starting simulation...');
    // Clear the simulation display
    window.dispatchEvent(new CustomEvent(DISPLAY_EVENTS.RESET));
    // Create a new simulation, clear display, and start simulation loop
    createSimulation();
    simLoopHandle = window.setInterval(() => {
        console.log('Running simulation...');
        let result = simulation.simulate_generation();
        updateGenerationDisplay(result);
        // If score is 0 then terminate the simulation
        if (result.get_score() === 0) {
            stopSimulation();
        }
    }, 500)
};

const stopSimulation = () => {
    console.log('Stopping simulation...');
    // Stop the interval running the simulation
    clearInterval(simLoopHandle);
}

const resetSimulation = () => {
    console.log('Resetting simulation params...');
    // Reset simulation params form
    resetSimulationParams();
}

// ADD EVENT LISTENERS WHEN DOM CONTENT LOADED
FORM_ELEMENTS['TARGET_COLOUR'].input.addEventListener('change', updateColourDisplay);

RUN_BUTTON.addEventListener('click', runSimulation);

STOP_BUTTON.addEventListener('click', stopSimulation);

RESET_BUTTON.addEventListener('click', resetSimulation);

// ATTACH COMPONENTS
document.querySelectorAll(`[${DISPLAY_BASE_ATTR}]`).forEach(GenerationDisplay.attachTo);
document.querySelectorAll(`[${CARD_BASE_ATTR}]`).forEach(GenerationDisplayCard.attachTo);

// LIL' WASM TEST FUNCTION CALL
console.log(module.hello());
