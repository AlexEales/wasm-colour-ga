export const BASE_ATTR = `generation-display-card`;

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
