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

// FUNCTIONS
const updateColourDisplay = () => {
    // Update the colour display when input changes.
    let colour = FORM_ELEMENTS['TARGET_COLOUR'].input.value;
    if (!colour.startsWith('#')) {
        colour = '#' + colour;
    }
    FORM_ELEMENTS['TARGET_COLOUR'].display.style.backgroundColor = colour;
};

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
