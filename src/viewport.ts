import {ui} from "./ui";
import {latte} from "./latte";

export namespace viewport{

    import AnyElement = ui.AnyElement;
    import Rectangle = latte.Rectangle;

    /**
     * Gets a rectangle with the size of the viewport
     */
    export function rectangle(): Rectangle{
        return new Rectangle(0, 0, window.innerWidth, window.innerHeight);
    }

    /**
     * Handles resize of viewport
     * @param {ui.AnyElement} e
     * @param {(e: Event) => void} callback
     */
    export function onResize(e: AnyElement, callback: (e: Event) => void){

        // Register resize event
        window.addEventListener('resize', callback);

        // Remove window listener when detached
        e.on('detach', () => window.removeEventListener('resize', callback));

    }

}