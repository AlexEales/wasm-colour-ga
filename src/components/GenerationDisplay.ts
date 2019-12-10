export const BASE_ATTR = 'generation-display';

export const ATTRS = {
    'HEADER': 'generation-display-header',
    'CLEAR_BTN': 'generation-display-clear-btn',
    'HISTORY_DISPLAY': 'generation-history-display'
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
        console.log('Generation display attached');
    }

    static attachTo(elem: HTMLElement) {
        return new GenerationDisplay(elem);
    }
}
