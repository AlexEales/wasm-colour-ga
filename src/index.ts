import module from '../colour_ga/Cargo.toml';

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

const GENERATION_DISPLAY = document.querySelector('#generation-history-display');
const GENERATION_DISPLAY_CARD_ATTR = 'generation-display-card';
const GENERATION_DISPLAY_PLACEHOLDER = `
<div generation-display-card>
    <div>
        <h3>No results</h3>
        <p>Input your parameters and press start to begin!</p>
    </div>
</div>
`;

// FUNCTIONS
const updateColourDisplay = () => {
    // Update the colour display when input changes.
    let colour = FORM_ELEMENTS['TARGET_COLOUR'].input.value;
    if (!colour.startsWith('#')) {
        colour = '#' + colour;
    }
    FORM_ELEMENTS['TARGET_COLOUR'].display.style.backgroundColor = colour;
};

const createGenerationDisplayCard = (generation, colour, score) => `
<div ${GENERATION_DISPLAY_CARD_ATTR}>
    <div class="flex">
        <div class="w-12 h-12 rounded mr-4" style="background-color: #${colour}"></div>
        <div>
            <h3 class="font-bold capitalize">generation ${generation}</h3>
            <p class="uppercase text-gray-500">#${colour}</p>
        </div>
    </div>
    <p class="font-bold capitalize text-2xl text-gray-900">${score}</p>
</div>
`;

const clearGenerationDisplay = () => {
    // Remove all elements with the generation display card attribute and add the placeholder
    GENERATION_DISPLAY.querySelectorAll(`[${GENERATION_DISPLAY_CARD_ATTR}]`).forEach(
        elem => elem.parentNode.removeChild(elem)
    );
};

const resetGenerationDisplay = () => {
    // Clear the display and add the placeholder element
    clearGenerationDisplay();
    GENERATION_DISPLAY.insertAdjacentHTML('beforeend', GENERATION_DISPLAY_PLACEHOLDER);
}

// EVENT LISTENERS
FORM_ELEMENTS['TARGET_COLOUR'].input.addEventListener('change', updateColourDisplay);

RUN_BUTTON.addEventListener('click', () => {
    console.log('Starting simulation...');
});

STOP_BUTTON.addEventListener('click', () => {
    console.log('Stopping simulation...');
});

RESET_BUTTON.addEventListener('click', () => {
    console.log('Resetting simulation...');
    for (let key in FORM_ELEMENTS) {
        FORM_ELEMENTS[key].input.value = FORM_ELEMENTS[key].default;
    }
});

console.log(module.hello());

let simulation = new module.GASimulation('81e6d9', 1000, 0.2);
console.log(simulation);

let result = simulation.simulate_generation();
console.log(result.get_value());
console.log(result.get_score());
console.log(simulation.get_population_snapshot(0, 1000));

for (let i = 0; i < 50; i++) {
    result = simulation.simulate_generation();
}
console.log(result.get_value());
console.log(result.get_score());
console.log(simulation.get_population_snapshot(49, 1000));
