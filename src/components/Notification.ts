export const BASE_ATTR = 'notification';

export const ATTRS = {
    'ACTIVE': `${BASE_ATTR}-active`
};

export const EVENTS = {
    'TRIGGER': `trigger-${BASE_ATTR}`
};

/**
 * Component for notifications
 */
export class Notification {
    _root: HTMLElement;
    _visible = false;
    _timeoutHandle: number;

    constructor(elem: HTMLElement) {
        // GET ELEMENTS
        this._root = elem;
        // BIND FUNCTIONS
        this.display = this.display.bind(this);
        this.handleTrigger = this.handleTrigger.bind(this);
        // ADD EVENT LISTENERS
        window.addEventListener(EVENTS.TRIGGER, this.handleTrigger);
    }

    /**
     * Attaches an instance of this component to an element in the DOM
     *
     * @param elem Element to bind the component to
     *
     * @returns The created instance attached to the element
     */
    static attachTo(elem: HTMLElement): Notification {
        return new Notification(elem);
    }

    handleTrigger(e: CustomEvent) {
        // If the event is intended for this notification instance then display the notification
        if (e.detail['notification'] !== this._root.getAttribute(BASE_ATTR)) {
            return;
        }
        this.display();
    }

    display() {
        // If the notification is already displayed then do nothing
        if (this._visible) {
            return;
        }
        // Otherwise show notification and set timeout to close notification in 5s
        this._root.setAttribute(ATTRS.ACTIVE, "");
        this._timeoutHandle = setTimeout(() => {
            this._root.removeAttribute(ATTRS.ACTIVE);
        }, 5000);
        this._visible = true;
    }
}
