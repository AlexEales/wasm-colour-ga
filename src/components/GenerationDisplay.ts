import { BASE_ATTR as CARD_BASE_ATTR } from './GenerationDisplayCard';

export const BASE_ATTR = 'generation-display';

export const ATTRS = {
    'HEADER': `${BASE_ATTR}-header`,
    'CLEAR_BTN': `${BASE_ATTR}-clear-btn`,
    'HISTORY_DISPLAY': `generation-history-display`
};

export const EVENTS = {
    'UPDATE': `update-${BASE_ATTR}`,
    'RESET': `reset-${BASE_ATTR}`,
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

/**
 * Custom element for the generation display.
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
        this.resetEventHandler = this.resetEventHandler.bind(this);
        // ADD EVENT LISTENERS
        this._clearBtn.addEventListener('click', this.reset);
        this._clearBtn.addEventListener(EVENTS.RESET, this.resetEventHandler);
    }

    static attachTo(elem: HTMLElement) {
        return new GenerationDisplay(elem);
    }

    /**
     * Handles any reset events emitted and if meant for this instance resets display
     * @param e Custom event containing the id of the generation display to reset
     */
    resetEventHandler(e: CustomEvent) {
        if (e.detail['id'] === this._root.id) {
            this.reset();
        }
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
