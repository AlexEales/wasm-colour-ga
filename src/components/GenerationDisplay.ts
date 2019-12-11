export const BASE_ATTR = 'generation-display';
export const CARD_BASE_ATTR = `${BASE_ATTR}-card`;

export const ATTRS = {
    'HEADER': `${BASE_ATTR}-header`,
    'CLEAR_BTN': `${BASE_ATTR}-clear-btn`,
    'HISTORY_DISPLAY': `generation-history-display`
};

export const EVENTS = {
    'UPDATE': `update-${BASE_ATTR}`,
    'RESET': `reset-${BASE_ATTR}`,
    'CLEAR': `clear-${BASE_ATTR}`
};

export const STYLES = {
    'HEADER': 'flex flex-row align-middle justify-between'
};

const GENERATION_HISTORY_DISPLAY_PLACEHOLDER = `
<div generation-display-card>
    <div>
        <h3>No results</h3>
        <p>Input your parameters and press start to begin!</p>
    </div>
</div>
`;

const GENERATION_DISPLAY_CARD_TEMPLATE = (generation: number, colour: string, score: number) => `
<div ${CARD_BASE_ATTR}>
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

/**
 * Component for the generation display.
 */
export class GenerationDisplay {
    _root: HTMLElement;
    _header: HTMLElement;
    _clearBtn: HTMLElement;
    _historyDisplay: HTMLElement;

    constructor(elem: HTMLElement) {
        // GET ELEMENTS
        this._root = elem;
        this._header = this._root.querySelector(`[${ATTRS.HEADER}]`);;
        this._clearBtn = this._root.querySelector(`[${ATTRS.CLEAR_BTN}]`);
        this._historyDisplay = this._root.querySelector(`[${ATTRS.HISTORY_DISPLAY}]`);
        // BIND FUNCTIONS
        this.clear = this.clear.bind(this);
        this.reset = this.reset.bind(this);
        this.addCard = this.addCard.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        // ADD EVENT LISTENERS
        this._clearBtn.addEventListener('click', this.reset);
        window.addEventListener(EVENTS.RESET, this.reset);
        window.addEventListener(EVENTS.CLEAR, this.clear);
        window.addEventListener(EVENTS.UPDATE, this.updateHandler);
    }

    /**
     * Attaches an instance of this component to the provided element
     *
     * @param elem Element to attach this component to
     *
     * @returns The created generation display instance
     */
    static attachTo(elem: HTMLElement): GenerationDisplay {
        return new GenerationDisplay(elem);
    }

    /**
     * Handler for the update event which adds a card to the display if correct information is provided
     *
     * @param e Custom event containing the generation number, top scoring colour, and top score of a generation
     */
    updateHandler(e: CustomEvent) {
        // If the event doesn't contain the correct information ignore it
        if (e.detail['generation'] === undefined || !e.detail['colour'] || e.detail['score'] === undefined) {
            return;
        }
        // Otherwise add a new generation card to the display
        this.addCard(e.detail['generation'], e.detail['colour'], e.detail['score']);
    }

    /**
     * Creates a new generation display card and appends it to the display
     *
     * @param generation The number of the generation this card refers to
     * @param colour The best scoring colour of this generation
     * @param score The top score of this generation
     */
    addCard(generation: number, colour: string, score: number) {
        // Create the HTML template and append it
        const template = GENERATION_DISPLAY_CARD_TEMPLATE(generation, colour, score);
        this._historyDisplay.insertAdjacentHTML('afterbegin', template);
        // Set the scroll to top
        this._historyDisplay.scrollTop = 0;
    }

    /**
     * Removes all generation display cards from history display
     */
    clear() {
        this._historyDisplay.querySelectorAll(`[${CARD_BASE_ATTR}]`).forEach(elem => {
            elem.parentNode.removeChild(elem);
        });
    }

    /**
     * Clears the display and then appends the helper card onto the display
     */
    reset() {
        this.clear();
        this._historyDisplay.insertAdjacentHTML('beforeend', GENERATION_HISTORY_DISPLAY_PLACEHOLDER);
    }
}
