import module from '../colour_ga/Cargo.toml';

import {
    GenerationDisplay,
    BASE_ATTR as DISPLAY_BASE_ATTR,
    EVENTS as DISPLAY_EVENTS
} from './components/GenerationDisplay';
import { GenerationDisplayCard, BASE_ATTR as CARD_BASE_ATTR } from './components/GenerationDisplayCard';

// TODO: Add in form validation before running simulation

// CONSTANTS
const FORM_ELEMENT: HTMLFormElement = document.querySelector('#simulation-settings');
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

const GENERATION_DISPLAY = document.querySelector('#generation-container');
const GENERATION_HISTORY_DISPLAY = document.querySelector('generation-display');
const GENERATION_DISPLAY_CARD_ATTR = 'generation-display-card';

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

const createGenerationDisplayCard = (generation: number, colour: string, score: number) => `
<div ${GENERATION_DISPLAY_CARD_ATTR}>
    <div generation-display-card>
        <div class="w-12 h-12 rounded mr-4" style="background-color: #${colour}"></div>
        <div>
            <h3 class="font-bold capitalize">generation ${generation}</h3>
            <p class="uppercase text-gray-500">#${colour}</p>
        </div>
    </div>
    <p class="font-bold capitalize text-2xl text-gray-900">${score}</p>
</div>
`;

const addGenerationDisplayCard = (simulationResult: module.SimulationResult) => {
    // Add generation card to the display
    let generation = simulationResult.get_generation_number();
    let colour = simulationResult.get_value();
    let score = Math.round(simulationResult.get_score() * 100) / 100;
    let generationDisplayCard = createGenerationDisplayCard(generation, colour, score);
    GENERATION_HISTORY_DISPLAY.insertAdjacentHTML('afterbegin', generationDisplayCard);
    // Fix scroll to the top of the display
    GENERATION_DISPLAY.scrollTop = 0;
};

const clearGenerationDisplay = () => {
    // Remove all elements with the generation display card attribute and add the placeholder
    GENERATION_DISPLAY.querySelectorAll(`[${GENERATION_DISPLAY_CARD_ATTR}]`).forEach(
        elem => elem.parentNode.removeChild(elem)
    );
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
    // Create a new simulation, clear display, and start simulation loop
    createSimulation();
    clearGenerationDisplay();
    simLoopHandle = window.setInterval(() => {
        console.log('Running simulation...');
        let result = simulation.simulate_generation();
        addGenerationDisplayCard(result);
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
