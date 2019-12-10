import { BASE_ATTR as DISPLAY_BASE_ATTR } from './GenerationDisplay';

export const BASE_ATTR = `${DISPLAY_BASE_ATTR}-card`;

/**
 * Custom element for a generation display card.
 */
export class GenerationDisplayCard {
    _expanded = false;
    _root: HTMLElement;
    _generationNumber: number;

    constructor(elem: HTMLElement) {
        console.log('Generation display card attached');
    }

    static attachTo(elem: HTMLElement) {
        return new GenerationDisplayCard(elem);
    }
}
