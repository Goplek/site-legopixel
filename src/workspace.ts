import { ui } from './ui'
import {viewport} from "./viewport";
import {latte} from "./latte";
import {icon} from "./icon";
import {imageutil} from "./imageutil";
import {linearicon} from "./linearicon";

export namespace workspace{

    import Color = latte.Color;
    import Size = latte.Size;
    import PropertyTarget = latte.PropertyTarget;
    import DidSet = latte.DidSet;
    import DivElement = ui.DivElement;
    import Icon = icon.Icon;
    import InputElement = ui.InputElement;
    import ImageFit = imageutil.ImageFit;
    import Label = ui.LabelItem;
    import Optional = latte.Optional;
    import IconItem = ui.IconItem;
    import LinearIcon = linearicon.LinearIcon;
    import MainView = ui.MainView;
    import View = ui.View;
    import SplitView = ui.SplitView;
    import Side = latte.Side;
    import ColorView = ui.ColorView;

    /**
     * Mouse related events
     */
    export enum Mouse{
        UP,
        DOWN,
        MOVE
    }

    /**
     * Drag & Drop related events
     */
    export enum Drag{
        OVER,
        LEAVE,
        DROP
    }

    /**
     * Keyboard related events
     */
    export enum Keyboard{
        UP,
        DOWN,
        PRESS
    }

    /**
     * Base actuator with common behavior receptors for canvas pieces
     */
    export class CanvasActuator extends PropertyTarget{

        /**
         * Recieves drag & drop events
         * @param {workspace.Drag} drag
         * @param {DragEvent} e
         */
        onDragEvent(drag: Drag, e: DragEvent){}

        /**
         * Recieves mouse events
         * @param {workspace.Mouse} mouse
         * @param {MouseEvent} e
         */
        onMouseEvent(mouse: Mouse, e: MouseEvent){}

        /**
         * Recieves
         *
         * @param {workspace.Keyboard} key
         * @param {KeyboardEvent} e
         */
        onKeyboardEvent(key: Keyboard, e: KeyboardEvent){}

    }

    /**
     * Base actuator with common behavior for illustrator pieces
     */
    export class IllustratorActuator<T extends Illustrator> extends CanvasActuator{

        //region Methods



        //endregion

        //region Properties
        /**
         * Gets or sets the illustrator component
         */
        get illustrator(): T {
            return this.getPropertyValue('illustrator', Illustrator,null);
        }

        /**
         * Gets or sets the illustrator component
         *
         * @param {T} value
         */
        set illustrator(value: T) {
            this.setPropertyValue('illustrator', value, Illustrator);
        }
        //endregion

    }

    /**
     * Represents tools that can be activated one at a time in the Illustrator
     */
    export class Tool<T extends Illustrator> extends IllustratorActuator<T>{

        //region Methods
        //endregion

        //region Properties

        /**
         * Gets or sets a boolean indicating if the tool is currently active
         */
        get active(): boolean {
            return this.getPropertyValue('active', Boolean,false);
        }

        /**
         * Gets or sets a boolean indicating if the tool is currently active
         *
         * @param {boolean} value
         */
        set active(value: boolean) {
            this.setPropertyValue('active', value, Boolean);
        }

        //endregion

    }

    /**
     * Functionallity for Illustrator that can be present simultaneously
     */
    export class Plugin<T extends Illustrator> extends IllustratorActuator<T>{

        constructor(ill: T){
            super();

            if(!ill) throw "Illustrator at constructor is required";

            this.illustrator = ill;
        }

        //region Methods

        //endregion

        //region EVents

        //endregion

        //region Properties
        /**
         * Gets or sets a value indicating if the plug-in is currently enabled
         */
        get enabled(): boolean {
            return this.getPropertyValue('enabled', Boolean,true);
        }

        /**
         * Gets or sets a value indicating if the plug-in is currently enabled
         *
         * @param {boolean} value
         */
        set enabled(value: boolean) {
            this.setPropertyValue('enabled', value, Boolean);
        }
        //endregion

    }

    /**
     * Handles the behavior of the canvas.
     * From an image editor to a vector editor to a icon editor, illustrator is the specialization
     * that makes the canvas behave as we want.
     */
    export class Illustrator extends CanvasActuator{

        //endregion
        //region Fields

        //region Methods
        /**
         * Takes the chance to draw
         */
        draw(){}

        /**
         * Override.
         * @param {workspace.Drag} drag
         * @param {DragEvent} e
         */
        onDragEvent(drag: Drag, e: DragEvent){
            super.onDragEvent(drag, e);

            if(this.tool) {
                this.tool.onDragEvent(drag, e);
            }

            this.plugins.forEach( p => {
                if(p.enabled) {
                    p.onDragEvent(drag, e);
                }
            });
        }

        /**
         * Recieves mouse events
         * @param {workspace.Mouse} mouse
         * @param {MouseEvent} e
         */
        onMouseEvent(mouse: Mouse, e: MouseEvent){
            super.onMouseEvent(mouse, e);

            if(this.tool) {
                this.tool.onMouseEvent(mouse, e);
            }

            this.plugins.forEach(p => {
                if(p.enabled) {
                    p.onMouseEvent(mouse, e);
                }
            });

        }

        /**
         * Recieves
         *
         * @param {workspace.Keyboard} key
         * @param {KeyboardEvent} e
         */
        onKeyboardEvent(key: Keyboard, e: KeyboardEvent){
            super.onKeyboardEvent(key, e);

            if(this.tool) {
                this.tool.onKeyboardEvent(key, e);
            }

            this.plugins.forEach(p => {
                if(p.enabled) {
                    p.onKeyboardEvent(key, e);
                }
            });

        }

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'tool'){
                if(e.oldValue) {
                    e.oldValue.active = false;
                }

                if(this.tool) {
                    this.tool.illustrator = this;
                    this.tool.active = true;
                }

            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the canvas
         */
        get canvas(): Canvas {
            return this.getPropertyValue('canvas', Canvas,null);
        }

        /**
         * Gets or sets the canvas
         *
         * @param {Canvas} value
         */
        set canvas(value: Canvas) {
            this.setPropertyValue('canvas', value, Canvas);
        }

        /**
         * Property field
         */
        private _plugins: Plugin<Illustrator>[] = [];

        /**
         * Gets the plugins of the illustrator
         *
         * @returns {Plugin[]}
         */
        get plugins(): Plugin<Illustrator>[] {
            return this._plugins;
        }

        /**
         * Gets or sets the active tool of the illustrator
         */
        get tool(): Tool<Illustrator> {
            return this.getPropertyValue('tool', Tool,null);
        }

        /**
         * Gets or sets the active tool of the illustrator
         *
         * @param {Tool<Illustrator>} value
         */
        set tool(value: Tool<Illustrator>) {
            this.setPropertyValue('tool', value, Tool);
        }

        //endregion

    }

    /**
     *
     */
    export class CanvasTheme{
        static gridColor: Color = Color.fromHex('#f0f0f0');
    }

    /**
     * Actual Canvas element
     */
    export class Canvas extends ui.UiElement<HTMLCanvasElement>{

        /**
         * Creates the canvas with specified drawable
         * @param {T} drawable
         */
        constructor(illustrator: Illustrator){
            super(document.createElement('canvas'));

            this.illustrator = illustrator;

            this.raw.addEventListener('mouseup', e => this.illustrator.onMouseEvent(Mouse.UP, e));
            this.raw.addEventListener('mousemove', e => this.illustrator.onMouseEvent(Mouse.MOVE, e));
            this.raw.addEventListener('mousedown', e => this.illustrator.onMouseEvent(Mouse.DOWN, e));

            this.raw.addEventListener('dragover', e => this.illustrator.onDragEvent(Drag.OVER, e));
            this.raw.addEventListener('dragleave', e => this.illustrator.onDragEvent(Drag.LEAVE, e));
            this.raw.addEventListener('drop', e => this.illustrator.onDragEvent(Drag.DROP, e));

            this.raw.addEventListener('keyup', e => this.illustrator.onKeyboardEvent(Keyboard.UP, e));
            this.raw.addEventListener('keydown', e => this.illustrator.onKeyboardEvent(Keyboard.DOWN, e));
            this.raw.addEventListener('keypress', e => this.illustrator.onKeyboardEvent(Keyboard.PRESS, e));

        }

        //region Private Methods

        private backingScale(context: CanvasRenderingContext2D): number {
            if ('devicePixelRatio' in window) {
                if (window.devicePixelRatio > 1) {
                    return window.devicePixelRatio;
                }
            }
            return 1;
        }

        /**
         * Updates the size of the canvas
         */
        private updateSize(){

            let scaleFactor = this.backingScale(this.context);

            let desiredWidth = window.innerWidth - 300;
            let desiredHeight = window.innerHeight;

            if (scaleFactor > 1) {

                this.raw.width = desiredWidth * scaleFactor;
                this.raw.height = desiredHeight * scaleFactor;
                this.raw.style.width = String(desiredWidth) + 'px';
                this.raw.style.height = String(desiredHeight) + 'px';
                this.setPropertyValue('context', this.raw.getContext('2d'), CanvasRenderingContext2D);
                this.context.scale(scaleFactor, scaleFactor);
            }else{
                this.raw.width = desiredWidth;
                this.raw.height = desiredHeight;
            }

            this.setPropertyValues({
                width: desiredWidth,
                height: desiredHeight
            });

        }

        //endregion

        //region Methods

        /**
         * Draws the canvas
         */
        draw(){

            this.context.clearRect(0,0, this.width, this.height);

            if(this.illustrator) {
                this.illustrator.draw();
            }
        }

        /**
         * Ends the draw() loop
         */
        endLoop(){
            this.setPropertyValue('looping', false, Boolean);
        }

        /**
         * Starts the draw() loop
         */
        startLoop(){

            let start = Date.now();
            let frames = 0;

            let loop = () => {

                let now = Date.now();

                if((now - start) >= 1000) {
                    this.setPropertyValue('fps', frames, Number);
                    start = now;
                    frames = 0;
                }

                this.draw();
                frames++;

                if(this.looping) {
                    window.requestAnimationFrame(loop);
                }
            };

            this.setPropertyValue('looping', true, Boolean);

            window.requestAnimationFrame(loop);

        }

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'illustrator' && this.illustrator){
                this.illustrator.canvas = this;

            }

        }

        /**
         * Override
         * @param {string} eventName
         * @param args
         */
        raise(eventName: string, ...args: any[]){
            super.raise(eventName, args);

            if(eventName == 'attach') {

                // Update size
                this.updateSize();

                // Also when window updated
                viewport.onResize(this, e => this.updateSize());

                // Start Drawing loop
                this.startLoop();

            }else if(eventName == 'detach') {
                this.endLoop();
            }
        }

        //endregion

        //region Properties

        /**
         * Gets the context of the canvas
         */
        get context(): CanvasRenderingContext2D {
            return this.getLazyProperty('context', CanvasRenderingContext2D, () => {
                return this.raw.getContext('2d');
            });
        }

        /**
         * Gets the current Frames per second rate
         */
        get fps(): number {
            return this.getPropertyValue('fps', Number,0);
        }

        /**
         * Gets the height of the canvas
         */
        get height(): number {
            return this.getPropertyValue('height', Number, 0);
        }

        /**
         * Gets or sets the illustrator of the canvas
         */
        get illustrator(): Illustrator {
            return this.getPropertyValue('illustrator', Illustrator,null);
        }

        /**
         * Gets or sets the illustrator of the canvas
         *
         * @param {Illustrator} value
         */
        set illustrator(value: Illustrator) {
            this.setPropertyValue('illustrator', value, Illustrator);
        }

        /**
         * Gets a value indicating if the draw loop is active
         */
        get looping(): boolean {
            return this.getPropertyValue('looping', Boolean,true);
        }

        /**
         * Gets or sets the canvas theme
         */
        get theme(): CanvasTheme {
            return this.getPropertyValue('theme', CanvasTheme, new CanvasTheme());
        }

        /**
         * Gets or sets the canvas theme
         *
         * @param {CanvasTheme} value
         */
        set theme(value: CanvasTheme) {
            this.setPropertyValue('theme', value, CanvasTheme);
        }

        /**
         * Gets the width of the canvas
         */
        get width(): number {
            return this.getPropertyValue('width', Number,0);
        }


        //endregion

    }

    class Slider extends DivElement{

        constructor(text: string = ''){
            super('slider');

            this.text = text;
        }

        //region Methods

        /**
         * Initializes the range bar
         * @param {number} min
         * @param {number} max
         * @param {number} step
         * @param {number} value
         */
        initRange(min: number, max: number, step: number, value: number): this{
            this.inpRange.setAtts({
                min:    min,
                max:    max,
                step:   step,
                value:  value
            });
            this.setPropertyValue('value', String(value), String, {silent: true});
            this.divValue.html = String(value);
            return this;
        }

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){

            super.didSet(e);

            if(e.property == 'text') {
                this.divText.html = this.text;

            }else if(e.property == 'value') {
                this.divValue.html = this.value;
            }
        }

        /**
         * Override
         * @param {string} eventName
         * @param args
         */
        raise(eventName: string, ...args: any[]){
            super.raise(eventName, args);

            if(eventName == 'attach') {
                this.add([
                    this.divText,
                    this.inpRange,
                    this.divValue
                ]);
            }
        }

        //endregion

        //region Events
        //endregion

        //region Properties

        /**
         * Gets or sets the text of the element
         */
        get text(): string {
            return this.getPropertyValue('text', String,null);
        }

        /**
         * Gets or sets the text of the element
         *
         * @param {string} value
         */
        set text(value: string) {
            this.setPropertyValue('text', value, String);
        }

        /**
         * Gets or sets the value of the element
         */
        get value(): string {
            return this.getPropertyValue('value', String,null);
        }

        /**
         * Gets or sets the value of the element
         *
         * @param {string} value
         */
        set value(value: string) {
            this.setPropertyValue('value', value, String);
        }

        //endregion

        //region Elements

        /**
         * Gets the range element
         */
        get inpRange(): InputElement {
            return this.getLazyProperty('inpRange', InputElement, () => {
                return new InputElement()
                    .setAtts({type: 'range'})
                    .addEventListener('input', () => this.value = this.inpRange.raw.value)
                    .addEventListener('change', () => this.raise('rangeChange'));
            });
        }

        /**
         * Gets the text element
         */
        get divText(): DivElement {
            return this.getLazyProperty('divText', DivElement,() => {
                return new DivElement().addClass('text');
            });
        }

        /**
         * Gets the value element
         */
        get divValue(): DivElement {
            return this.getLazyProperty('divValue', DivElement,() => {
                return new DivElement().addClass('value');
            });
        }


        //endregion

    }

    export class Workspace extends DivElement{

        static START_SIZE = 64;

        /**
         * Creates the workspace
         * @param {workspace.Illustrator} illustrator
         */
        constructor(illustrator: Illustrator){
            super('workspace');

            this.setPropertyValue('illustrator', illustrator, Illustrator);
        }

        //region Methods

        /**
         * Override
         * @param {string} eventName
         * @param args
         */
        raise(eventName: string, ...args: any[]){
            super.raise(eventName, args);

            if(eventName == 'attach') {
                this.add([
                    this.canvas,
                    this.sidebar,
                    this.divFps
                ]);

                this.sidebar.add([
                    this.brightnessSlider,
                    this.contrastSlider,
                    this.sizeSlider,
                    this.widthSlider,
                    this.heightSlider,
                    this.colorSlider,
                    this.testLabel
                ]);

                // this.testLabel.description = Optional.of("desc");
                this.testLabel.icon = Optional.of(LinearIcon.cross);

                let a = new SplitView();
                a.side = Side.LEFT;
                a.wide = 100;
                a.sideView = Optional.of(ColorView.fromString('f00'));


                let b = new SplitView();
                b.side = Side.TOP;
                b.wide = 100;
                //b.sideView = Optional.of(ColorView.fromString('ff0'));

                let c = new SplitView();
                c.side = Side.LEFT;
                c.wide = 100;
                c.sideView = Optional.of(ColorView.fromString('0f0'));

                let d = new SplitView();
                d.side = Side.RIGHT;
                d.wide = 100;
                d.view = Optional.of(ColorView.fromString('f0f'));
                d.sideView = Optional.of(ColorView.fromString('0ff'));

                a.view = Optional.of(b);
                b.view = Optional.of(c);
                b.sideView = Optional.of(d);
                c.view = Optional.of(ColorView.fromString('00f'));
                MainView.instance.view = Optional.of(a);

                // Update fps every half second
                setInterval(() => this.divFps.html = `${this.canvas.fps}fps`, 500);
            }
        }

        //endregion

        //region Properties

        /**
         * Gets the brightness slider
         */
        get brightnessSlider(): Slider {
            return this.getLazyProperty('brightnessSlider', Slider, () => {
                return new Slider("Brightness")
                    .attachTo(this.sidebar);
            });
        }

        /**
         * Gets the canvas
         */
        get canvas(): Canvas {
            return this.getLazyProperty('canvas', Canvas,() => {
                return new Canvas(this.illustrator);
            });
        }

        /**
         * Gets the contrast slider
         */
        get contrastSlider(): Slider {
            return this.getLazyProperty('contrastSlider', Slider,() => {
                return new Slider("Contrast")
                    .attachTo(this.sidebar);
            });
        }

        /**
         * Gets the Fps element
         */
        get divFps(): DivElement {
            return this.getLazyProperty('divFps', DivElement,() => {
                return new DivElement('fps');
            });
        }

        /**
         * Gets the illustrator
         */
        get illustrator(): Illustrator {
            return this.getPropertyValue('illustrator', Illustrator,undefined);
        }

        /**
         * Gets the sidebar
         */
        get sidebar(): DivElement {
            return this.getLazyProperty('sidebar', DivElement, () => {
                return new DivElement('sidebar');
            });
        }

        /**
         * Gets the size slider
         */
        get sizeSlider(): Slider {
            return this.getLazyProperty('sizeSlider', Slider,() => {
                return new Slider("Size");
            });
        }

        /**
         * Gets the height slider
         */
        get heightSlider(): Slider {
            return this.getLazyProperty('heightSlider', Slider,() => {
                return new Slider("Height");
            });
        }

        /**
         * Gets the width of the icon
         */
        get widthSlider(): Slider {
            return this.getLazyProperty('widthSlider', Slider,() => {
                return new Slider("Width");
            });
        }

        /**
         * Gets the colors slider
         */
        get colorSlider(): Slider {
            return this.getLazyProperty('colorSlider', Slider, () => {
                return new Slider("Palette");
            });
        }

        /**
         * Gets the test label
         */
        get testLabel(): Label {
            return this.getLazyProperty('testLabel', Label, () => {
                return new Label('Some Text');
            });
        }

        //endregion

    }

}