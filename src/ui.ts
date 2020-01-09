import {latte} from "./latte";

export namespace ui{

    import DateTime = latte.DateTime;
    import PropertyTarget = latte.PropertyTarget;
    import DidSet = latte.DidSet;
    import Any = latte.Any;
    import Optional = latte.Optional;
    import Side = latte.Side;
    import Color = latte.Color;
    import Rectangle = latte.Rectangle;
    import log = latte.log;
    import Point = latte.Point;

    /**
     * Specifies direction of flow of content
     */
    export enum LanguageDirection{
        AUTO,
        RTL,
        LTR
    }

    /**
     * Object that manages the UI lifespan of the mouse while a
     */
    export class ClickAndDragOperation extends PropertyTarget{

        //region Fields
        private readonly moveHandler: (e: MouseEvent) => void;
        private readonly upHandler: (e: MouseEvent) => void;
        //endregion

        /**
         * Creates the operation
         * @param e
         */
        constructor(e: MouseEvent){
            super();

            this.moveHandler = e => this.mouseMove(e);
            this.upHandler = e => this.mouseUp(e);

            window.addEventListener('mousemove', this.moveHandler,true);
            window.addEventListener('mouseup', this.upHandler, true);

            // TODO: support cancel on escape key
        }

        //region Private Methods
        private destroy(){
            window.removeEventListener('mousemove', this.moveHandler, true);
            window.removeEventListener('mouseup', this.upHandler, true);
            log(`ClickAndDragDestroyed`);
        }
        //endregion

        //region Methods
        mouseMove(e: MouseEvent){
            this.raise('mouseMove', e);
        }

        mouseUp(e: MouseEvent){
            this.raise('mouseUp', e);
            this.destroy();
        }
        //endregion


    }

    /**
     * Animation engine
     */
    export class Animation extends PropertyTarget{

        //region Static

        /**
         * Stack of active animations
         * @type {Array}
         */
        static stack: Animation[] = [];

        /**
         * Gets the requestAnimationRequest function, cross-browser
         */
        static get requestAnimationFrame(): any{
            return window.requestAnimationFrame || (function() {
                let timeLast = 0;

                return window['webkitRequestAnimationFrame'] || function(callback: (d: number) => any) {
                    let timeCurrent = (new Date()).getTime(), timeDelta: number;

                    /* Dynamically set the delay on a per-tick basis to more closely match 60fps. */
                    /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671. */
                    timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
                    timeLast = timeCurrent + timeDelta;

                    return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
                };
            })();
        }

        static loopActive:boolean = false;

        /**
         * Starts the animation loop.
         */
        static loop(){

            Animation.loopActive = true;

            let now = DateTime.now;
            let runningAnimations = 0;

            for (let i = 0; i < Animation.stack.length; i++) {

                // Get animation to attend
                let a = Animation.stack[i];

                // If animation no longer valid, continue
                if(!a || !a.running) continue;

                let value = a.currentValue;

                //log("Updating: %s-%s -> %s", a.startValue, a.endValue, a.currentValue)
                if(now.compareTo(a.endTime) > 0 || value >= a.endValue) {
                    a.setPropertyValue('running', false, Boolean);
                    a.raise('update', a.endValue);
                    a.raise('ended');
                }else {
                    a.raise('update', a.endValue);
                    runningAnimations++;
                }
            }

            if(runningAnimations > 0){
                let rq = Animation.requestAnimationFrame;
                //log("Relooping")
                rq(Animation.loop);
            }else{
                // Clear stack
                //log("Ending Loop")
                Animation.stack = [];
                Animation.loopActive = false;
            }

        }

        //endregion

        /**
         * Creates the animation
         * @param startValue
         * @param endValue
         * @param duration Duration of animation in seconds
         */
        constructor(startValue: number,
                    endValue: number,
                    duration: number,
                    updateHandler: (value?: number) => any = null,
                    endHandler: () => any = null) {

            super();

            this.setPropertyValues({
                duration: duration,
                startValue: startValue,
                endValue: endValue
            });

            if(updateHandler) {
                this.on('update', updateHandler);
            }

            if(endHandler) {
                this.on('ended', endHandler);
            }
        }

        //region Private Methods
        //endregion

        //region Methods
        /**
         * Gets the value of the animation for the specified second of the animation
         * @param f
         * @returns {number}
         */
        getValueForSecond(s: number){
            //if(this.startValue  + (this.speed * s) > 600) {
            //    debugger;
            //}
            return this.startValue + (this.speed * s);
        }

        /**
         * Starts the animation
         */
        start(){

            this.updateStartDate();

            Animation.stack.push(this);
            if(!Animation.loopActive)
                Animation.loop(); // Start the animation loop
        }

        /**
         * Updates the start date to now
         */
        updateStartDate(){
            this.setPropertyValue('startTime', this.nowSupplier(), DateTime);
        }

        //endregion

        //region Properties
        /**
         * Gets the current value of distance to the current frame
         *
         * @returns {number}
         */
        get currentValue():number {
            return this.getValueForSecond((this.nowSupplier()).subtractDate(this.startTime).totalSeconds);
        }

        /**
         * Gets the distance of the animation
         *
         * @returns {number}
         */
        get distance():number {
            return this.endValue - this.startValue;
        }

        /**
         * Gets the duration of the animation, in seconds
         */
        get duration(): number {
            return this.getPropertyValue('duration', Number, 0);
        }

        /**
         * Gets the final value of the animation
         */
        get endValue(): number {
            return this.getPropertyValue('endValue', Number, 0);
        }

        /**
         * Gets the end time of the animation
         *
         * @returns {number}
         */
        get endTime():DateTime {
            return this.startTime.addSeconds(this.duration);
        }

        /**
         * Gets or sets the function that supplies the -now- object for animation computation
         */
        get nowSupplier(): () => DateTime {
            return this.getPropertyValue('nowSupplier', Any, () => DateTime.now);
        }

        /**
         * Gets or sets the function that supplies the -now- object for animation computation
         *
         * @param {() => DateTime} value
         */
        set nowSupplier(value: () => DateTime) {
            this.setPropertyValue('nowSupplier', value, Any);
        }

        /**
         * Gets if the animation is currently running
         */
        get running(): boolean {
            return this.getPropertyValue('running', Boolean, false);
        }

        /**
         * Gets the start value of the animation
         */
        get startValue(): number {
            return this.getPropertyValue('startValue', Number, undefined);
        }

        /**
         * Gets or sets the initial time of the animation
         */
        get startTime(): DateTime {
            return this.getPropertyValue('startTime', DateTime, null);
        }

        /**
         * Gets or sets the initial time of the animation
         *
         * @param {DateTime} value
         */
        set startTime(value: DateTime) {
            this.setPropertyValue('startTime', value, DateTime);
        }

        /**
         * Gets the speed of the animation value, in distance per second
         *
         * @returns {number}
         */
        get speed():number {
            return this.distance / this.duration;
        }

        /**
         * Gets or sets some tag for the animation
         */
        get tag(): any {
            return this.getPropertyValue('tag', Any, undefined);
        }

        /**
         * Gets or sets some tag for the animation
         *
         * @param {any} value
         */
        set tag(value: any) {
            this.setPropertyValue('tag', value, Any);
        }

        //endregion
    }

    /**
     * Basic Element wrapper
     * Events:
     *  - attach: when the element is attached to the DOM
     *  - detach: when the element is detached from the DOM
     */
    export class Element<T extends HTMLElement> extends PropertyTarget{

        //region Static
        /**
         * Creates a new element by also creating the raw element.
         * @param {K} tagName
         * @returns {ui.Element<HTMLElementTagNameMap[K]>}
         */
        static of<K extends keyof HTMLElementTagNameMap>(tagName: K): Element<HTMLElementTagNameMap[K]>{
            let raw = document.createElement(tagName);
            return new Element<HTMLElementTagNameMap[K]>(raw);
        }

        //endregion

        //region Fields
        private animations: Animation[] = [];
        //endregion

        constructor(raw: T){
            super();

            if(!raw) {
                throw "HTMLElement Needed";
            }

            this.setPropertyValue('raw', raw, HTMLElement);
        }

        //region Private Methods

        /**
         * Converts the value in css format to a number
         *
         * @param property
         * @returns {number}
         */
        private getCssNumericValue(property: string): number{

            return parseFloat(this.raw.style[property as any] as any || '0');
        }

        /**
         * Converts the value to a value + px, depending on the property
         *
         * @param property
         * @param value
         */
        private setCssNumericValue(property: string, value: number){

            if(property == 'opacity') {
                this.raw.style[property] = String(value);
            }else {
                this.raw.style[property as any] = value + 'px';
            }

        }

        //endregion

        //region Methods

        /**
         * Adds class(es) to the element. Multiple classes might be separated by spaces.
         * @param {string} name
         */
        addClass(name: string): this{
            if(name.indexOf(' ') >= 0) {
                name.split(' ').forEach(token => {
                    if(token){
                        this.raw.classList.add(token)
                    }
                });
            }else{
                this.raw.classList.add(name);
            }
            return this;
        }

        /**
         * Adds the specified element to the child nodes
         * @param {ui.Element<T extends HTMLElement>} e
         * @returns {ui.Element<T extends HTMLElement>}
         */
        add(e: Element<HTMLElement> | Element<HTMLElement>[] | HTMLElement): this{

            if(e instanceof HTMLElement) {
                this.raw.appendChild(e);

            }else if(e instanceof Element) {
                this.add(e.raw);
                e.raise('attach');

            }else if(e instanceof Array) {
                e.forEach(piece => this.add(piece));
            }

            return this;
        }

        /**
         * Animates the element specified properties, by establishing the initial values for the properties to animate.
         *
         * @param startProperties
         * @param endProperties
         * @param duration Duration of the animation in seconds
         * @param callback
         */
        animateFrom(startProperties: any, endProperties: any, duration: number = 0.1, callback: () => void = null): this{

            let animations: Animation[] = [];

            let setValue = (p: any, value: number) => {
                if(!this.hasPropertyValue(p)) {
                    this.setCssNumericValue(p, value);
                }else {
                    this.setPropertyValue(p, value, Any);
                }
            };

            for(let p in startProperties){
                let a = new Animation(startProperties[p], endProperties[p], duration, null);
                a.tag = p;
                animations.push(a);
            }

            if(animations.length > 0) {
                let leader = animations[0];

                // Handle update
                leader.on('update', () => {
                    // Update all values
                    for (let i = 0; i < animations.length; i++) {
                        let a = animations[i];
                        setValue(a.tag, leader.running ? a.currentValue : a.endValue);
                    }
                });

                // Handle end of animations
                leader.on('ended',() => {
                    this.setPropertyValue('isBeingAnimated', false, Boolean);
                });

                // Handle end
                if (callback) {
                    leader.on('ended', callback);
                }

                this.setPropertyValue('isBeingAnimated', true, Boolean);

                leader.start();

                // Update start time of animations
                animations.forEach(
                    a => a.startTime = DateTime.now);

                return this;
            }

            this.animations = this.animations.concat(animations);

            // Clean animations array
            this.animations = this.animations.filter(
                a => a.running);
        }

        /**
         * Animates the element properties, by letting the code to infer the initial values of the properties
         *
         * @param properties
         * @param duration Duration of the animation in seconds
         * @param callback
         */
        animate(properties: any, duration: number = 0.1, callback: () => void = null): this{
            let starts: any = {};

            let getValue = (p: any): number => {
                if(!this.hasPropertyValue(p)) {
                    return this.getCssNumericValue(p);
                }else {
                    return this.getPropertyValue(p, Any, undefined);
                }
            };

            for(let p in properties){
                starts[p] = getValue(p);
            }

            this.animateFrom(starts, properties, duration, callback);

            return this;
        }

        /**
         * Appends this element to a HTML element
         * @param {HTMLElement} e
         * @returns {ui.Element<T extends HTMLElement>}
         */
        attachTo(e: HTMLElement | Element<HTMLElement>): this{
            if(e instanceof Element) {
                (e as AnyElement).raw.appendChild(this.raw);
            }else{
                (e as HTMLElement).appendChild(this.raw);
            }
            this.raise('attach');
            return this;
        }

        /**
         * Handles the specified event
         * @param {keyof HTMLElementEventMap} name
         * @param {(ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener
         * @returns {ui.Element<T extends HTMLElement>}
         */
        addEventListener(name: keyof HTMLElementEventMap, listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any): this {
            this.raw.addEventListener(name, listener);
            return this;
        }

        /**
         * Removes all contents of the element
         */
        clear(){
            while(this.raw.children.length > 0){
                this.raw.children[0].remove();
            }
        }

        /**
         * Makes sure the class is either present or not present in the element
         * @param {string} className
         * @param {boolean} present
         */
        ensureClass(className: string, present: boolean = true): this{
            if(present) {
                this.addClass(className);
            }else{
                this.removeClass(className);
            }
            return this;
        }

        /**
         * Gets the attribute of the element
         * @param {string} name
         * @returns {any}
         */
        getAtt(name: string): any{
            return this.raw.getAttribute(name);
        }

        /**
         * Returns a value indicating if the class is present in the element
         * @param {string} className
         * @returns {boolean}
         */
        hasClass(className: string): boolean{
            return this.raw.classList.contains(className);
        }

        /**
         * Sets the value of the specified attribute
         * @param {string} name
         * @param {string} value
         */
        setAtt(name: string, value: string): this{
            this.raw.setAttribute(name, value);
            return this;
        }

        /**
         * Sets the value of the specified attribute
         * @param {string} name
         * @param {string} value
         */
        setAtts(keyValueMap: {[string: string]: any}): this{
            for(let key in keyValueMap)
                this.setAtt(key, String(keyValueMap[key]));
            return this;
        }

        /**
         * Removes the specified class
         * @param {string} name
         * @returns {this}
         */
        removeClass(name: string): this{
            if(name.indexOf(' ') >= 0) {
                name.split(' ').forEach(token => {
                    if(token){
                        this.raw.classList.remove(token)
                    }
                });
            }else{
                this.raw.classList.remove(name);
            }
            return this;

        }

        /**
         * Removes the node from its parent
         */
        removeFromParent(){
            this.raw.remove();
            this.raise('detach');
        }

        //endregion

        //region Properties

        /**
         * Gets or sets the inner text(html) of the element
         */
        get html(): string{
            return this.raw.innerHTML;
        }

        /**
         * Gets or sets the inner text(html) of the element
         *
         * @param {string} value
         */
        set html(value: string){
            // Set value
            this.raw.innerHTML = value;
        }

        /**
         * Gets the raw HTML element
         */
        get raw(): T {
            return this.getPropertyValue('raw', HTMLElement, undefined);
        }

        /**
         * Gets a boolean indicating if the element is currently being animated
         */
        get isBeingAnimated(): boolean {
            return this.getPropertyValue('isBeingAnimated', Boolean, false);
        }

        /**
         * Gets sugar for this.raw.style
         *
         * @returns {CSSStyleDeclaration}
         */
        get style(): CSSStyleDeclaration {
            return this.raw.style;
        }

        //endregion

    }

    /**
     * Wildcard class
     */
    export class AnyElement extends Element<HTMLElement>{}

    /**
     * Base of Ui Constructs
     */
    export class UiElement<T extends HTMLElement> extends Element<T>{

        //region Methods

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'langDirection'){
                switch (this.langDirection) {
                    case LanguageDirection.AUTO: this.setAtt('dir', 'auto'); break;
                    case LanguageDirection.LTR: this.setAtt('dir', 'ltr'); break;
                    case LanguageDirection.RTL: this.setAtt('dir', 'rtl'); break;
                }
            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the direction of language
         */
        get langDirection(): LanguageDirection {
            return this.getPropertyValue('langDirection', Any, LanguageDirection.AUTO);
        }

        /**
         * Gets or sets the direction of language
         *
         * @param {LanguageDirection} value
         */
        set langDirection(value: LanguageDirection) {
            this.setPropertyValue('langDirection', value, Any);
        }

        //endregion


    }

    /**
     * Shorthand for UiElement<HTMLDivElement>
     */
    export class DivElement extends UiElement<HTMLDivElement>{

        static withClass(name: string): DivElement{
            let d = new DivElement();
            d.addClass(name);
            return d;
        }

        constructor(e: HTMLDivElement | string = null){
            super(e instanceof HTMLDivElement ? e : document.createElement('div'));

            if("string" === typeof e) {
                this.addClass(e);
            }
        }
    }

    /**
     * Shorthand for UiElement<HTMLInputElement>
     */
    export class InputElement extends UiElement<HTMLInputElement>{
        constructor(e: HTMLInputElement = null){
            super(e || document.createElement('input'));
        }
    }

    /**
     * Basic Item Pattern
     */
    export class Item extends DivElement{
        constructor(e: HTMLDivElement | string = null){
            super(e);

            this.addClass('item');

            this.setAtt('tabIndex', '0');
        }
    }

    /**
     * Icon class used around ui library.
     */
    export class IconItem extends Item{

        constructor(size: number = 16){
            super('icon');

            this.size = size;
        }

        //region Methods
        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'size'){
                this.raw.style.width = this.size.px;
                this.raw.style.height = this.size.px;
            }

        }


        //endregion

        //region Properties

        /**
         * Gets or sets the size of the icon
         */
        get size(): number {
            return this.getPropertyValue('size', Number, 16);
        }

        /**
         * Gets or sets the size of the icon
         *
         * @param {number} value
         */
        set size(value: number) {
            this.setPropertyValue('size', value, Number);
        }

        //endregion
    }

    /**
     * Basic label pattern
     */
    export class LabelItem extends Item{

        //region Fields
        private divText: DivElement;
        private divDesc: DivElement;
        private reassembleNeeded: boolean = false;
        //endregion

        constructor(text: string = null){
            super('label');

            if(text) {
                this.text = text;
            }
        }

        //region Private Methods

        private createIconElement(){
            this.setPropertyUnsafe('eIcon', Optional.of(new DivElement('icon-container')));
            this.reassembleNeeded = true;
        }

        private createDescriptionElement(){
            this.setPropertyUnsafe('eDescription', Optional.of(new DivElement('desc')));
            this.reassembleNeeded = true;
        }

        private createTextElement(){
            this.setPropertyUnsafe('eText', Optional.of(new DivElement('text')));
            this.reassembleNeeded = true;
        }

        private createGroupElement(){
            this.setPropertyUnsafe('eGroup', Optional.of(new DivElement('group')));
            this.reassembleNeeded = true;
        }

        private deleteIconElement(){
            this.eIcon.ifPresent(e => e.removeFromParent());
            this.setPropertyUnsafe('eIcon', Optional.empty());
            this.reassembleNeeded = true;
        }

        private deleteDescriptionElement(){
            this.eDescription.ifPresent(e => e.removeFromParent());
            this.setPropertyUnsafe('eDescription', Optional.empty());
            this.reassembleNeeded = true;
        }

        private deleteGroupElement(){
            this.eGroup.ifPresent(e => e.removeFromParent());
            this.setPropertyUnsafe('eGroup', Optional.empty());
            this.reassembleNeeded = true;
        }

        private deleteTextElement(){
            this.eText.ifPresent(e => e.removeFromParent());
            this.setPropertyUnsafe('eText', Optional.empty());
            this.reassembleNeeded = true;
        }

        /**
         * Detaches and re-attaches all elements according to presence of elements
         */
        private reassemble(){

            this.eText       .ifPresent( e => e.removeFromParent());
            this.eDescription.ifPresent( e => e.removeFromParent());
            this.eGroup      .ifPresent( e => e.removeFromParent());
            this.eIcon       .ifPresent( e => e.removeFromParent());

            if(this.eIcon.isPresent) {
                this.add(this.eIcon.orThrow());
            }

            this.eGroup.ifPresent(g => {

                this.add(g);
                this.eText.ifPresent(t => g.add(t));
                this.eDescription.ifPresent( d => {
                    g.add(d);
                });

            }).elseDo(() => {

                this.eDescription.ifPresent(d => {

                    this.eText.ifPresent(t => this.add(t));
                    this.add(d);

                }).elseDo(() => {

                    this.eText.ifPresent( t => {

                    }).elseDo(() => {

                        if(this.text) {
                            this.html = this.text
                        }
                    });


                });

            });

            this.reassembleNeeded = false;
        }

        /**
         * Updates the structure of the element.
         * Ensures that the internal structure is both optimal and updated.
         */
        private updateLayout(){

            // Ensure existence of elements according to icon property
            if(this.icon.isPresent) {

                if(!this.eIcon.isPresent) {
                    this.createIconElement();
                }

                // Assign icon
                this.eIcon.orThrow().add(this.icon.orThrow());

            }else{
                if(this.eIcon.isPresent) {
                    this.deleteIconElement();
                }
            }

            // Group element is necessary if there is both icon and text (or desc)
            if(this.icon.isPresent && (this.description.isPresent || this.text)) {

                if(!this.eGroup.isPresent) {
                    this.createGroupElement();
                }
            }else{

                if(this.eGroup.isPresent) {
                    this.deleteGroupElement();
                }

            }

            // Ensure existence of elements according to description property
            if(this.description.isPresent) {

                if(!this.eDescription.isPresent) {
                    this.createDescriptionElement();
                }

                // Assign description
                this.eDescription.orThrow().html = this.description.orThrow();
            }else{

                if(this.eDescription.isPresent) {
                    this.deleteDescriptionElement()
                }
            }


            if(this.text)
            if(this.icon.isPresent || this.description.isPresent) {

                // Text element needed
                if(!this.eText.isPresent) {
                    this.html = ''; // Delete current text
                    this.createTextElement();
                }

                // Assign text
                this.eText.orThrow().html = this.text;

            }else{

                if(this.eGroup.isPresent) {

                    if(!this.eText.isPresent) {
                        this.html = ''; // Delete current
                        this.createTextElement();
                    }
                }else{

                    // Text element not needed
                    if(this.eText.isPresent) {
                        this.deleteTextElement()
                    }

                    // Assign text to the HTML
                    this.html = this.text;

                }
            }

            if(this.reassembleNeeded) {
                this.reassemble();
            }

        }

        //endregion

        //region Methods

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'text' || e.property == 'description' || e.property == 'icon'){
                this.updateLayout();
                this.ensureClass('with-icon', this.eIcon.isPresent);
                this.ensureClass('with-desc', this.eDescription.isPresent);
                this.ensureClass('with-text', !!this.text);
            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the description of the label
         */
        get description(): Optional<string> {
            return this.getPropertyValue('description', Optional, Optional.empty());
        }

        /**
         * Gets or sets the description of the label
         *
         * @param {Optional<string>} value
         */
        set description(value: Optional<string>) {
            this.setPropertyValue('description', value, Optional);
        }

        /**
         * Gets or sets the icon of the element
         */
        get icon(): Optional<IconItem> {
            return this.getPropertyValue('icon', Optional, Optional.empty());
        }

        /**
         * Gets or sets the icon of the element
         *
         * @param {Optional<Icon>} value
         */
        set icon(value: Optional<IconItem>) {
            this.setPropertyValue('icon', value, Optional);
        }

        /**
         * Gets or sets the text of the label
         */
        get text(): string {
            return this.getPropertyValue('text', String,null);
        }

        /**
         * Gets or sets the text of the label
         *
         * @param {string} value
         */
        set text(value: string) {
            this.setPropertyValue('text', value, String);
        }

        //endregion

        //region Elements

        /**
         * Gets the description element
         */
        get eDescription(): Optional<DivElement> {
            return this.getPropertyValue('eDescription', Optional, Optional.empty());
        }

        /**
         * Gets the group element. Separates icon and text at some layouts
         */
        get eGroup(): Optional<DivElement> {
            return this.getPropertyValue('eGroup', Optional, Optional.empty());
        }

        /**
         * Gets the icon element
         */
        get eIcon(): Optional<DivElement> {
            return this.getPropertyValue('eIcon', Optional, Optional.empty());
        }

        /**
         * Gets the text element
         */
        get eText(): Optional<DivElement> {
            return this.getPropertyValue('eText', Optional, Optional.empty());
        }

        //endregion

    }

    /**
     * Basic clickable pattern
     */
    export class Clickable extends Item{

        constructor(){
            super();

            this.addEventListener('click', e => this.raise('click', e));
        }

    }

    /**
     * Clickable button
     */
    export class ButtonItem extends Clickable{

        //region Elements
        /**
         * Gets the label of the item
         */
        get label(): LabelItem {
            return this.getLazyProperty('label', LabelItem, () => {
                return new LabelItem();
            });
        }

        //endregion

    }

    /**
     * Basic selectable pattern
     */
    export class Selectable extends DivElement{

        constructor(){
            super('selectable');
        }

        //region Properties
        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'selected'){
                this.ensureClass('selected', this.selected);
            }

        }
        //endregion

        //region Properties

        /**
         * Gets or sets a flag indicating if the item is selected
         */
        get selected(): boolean {
            return this.getPropertyValue('selected', Boolean,null);
        }

        /**
         * Gets or sets a flag indicating if the item is selected
         *
         * @param {boolean} value
         */
        set selected(value: boolean) {
            this.setPropertyValue('selected', value, Boolean);
        }

        //endregion

        //region Elements

        /**
         * Gets the label
         */
        get divLabel(): LabelItem {
            return this.getLazyProperty('divLabel', LabelItem, () => {
                return new LabelItem();
            });
        }

        //endregion

    }

    /**
     * Basic View Pattern
     */
    export class View extends DivElement{

        constructor(className: string = ''){
            super(className + ' view');
        }

        //region Methods
        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'view'){

                if(e.oldValue) {
                    (e.oldValue as Optional<View>).ifPresent(v => v.removeFromParent());
                }

                this.container.clear();
                this.view.ifPresent(v => this.container.add(v));
            }

        }

        /**
         * Override.
         * @param name
         */
        onEvent(name: string, args: any[]){
            super.onEvent(name, args);

            if(name == 'attach') {
                this.add(this.container);
            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the inner view of this view
         */
        get view(): Optional<View> {
            return this.getPropertyValue('view', Optional, undefined);
        }

        /**
         * Gets or sets the inner view of this view
         *
         * @param {Optional<View>} value
         */
        set view(value: Optional<View>) {
            this.setPropertyValue('view', value, Optional);
        }

        //endregion

        //region Elements
        /**
         * Gets the div element
         */
        get container(): DivElement {
            return this.getLazyProperty('container', DivElement, () => {
                return new DivElement('container');
            });
        }

        //endregion

    }

    /**
     * Singleton abstracting concept of a Main View
     */
    export class MainView extends PropertyTarget{

        private static instances = 0;
        public static instance: MainView = new MainView();

        constructor(){
            super();
            if(++MainView.instances > 1) {
                throw "This class is a singleton";
            }
        }

        //region Methods

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'view'){

                if(e.oldValue) {
                    (e.oldValue as Optional<View>).ifPresent(v => v.removeFromParent());
                }

                this.view.ifPresent(v => {
                    document.body.appendChild(v.raw);
                    v.raise('attach');
                });

            }

        }

        //endregion

        //region Properties
        /**
         * Gets or sets the main view of the vieport
         */
        get view(): Optional<View> {
            return this.getPropertyValue('view', Optional, Optional.empty());
        }

        /**
         * Gets or sets the main view of the vieport
         *
         * @param {Optional<View>} value
         */
        set view(value: Optional<View>) {
            this.setPropertyValue('view', value, Optional);
        }
        //endregion

    }

    export class AnchorView extends View{

        constructor(className: string){
            super(className + ' anchor');
        }

        //region Private Methods
        protected updateUi(){
           let top: string     = null;
           let left: string    = null;
           let right: string   = null;
           let bottom: string  = null;
           let size = this.wide.px;

            switch(this.side){
                case Side.TOP: top = size; break;
                case Side.LEFT: left = size; break;
                case Side.RIGHT: right = size; break;
                case Side.BOTTOM: bottom = size; break;
            }

            this.container.style.top = top;
            this.container.style.left = left;
            this.container.style.right = right;
            this.container.style.bottom = bottom;

            this.ensureClass('side-top', this.side == Side.TOP);
            this.ensureClass('side-left', this.side == Side.LEFT);
            this.ensureClass('side-right', this.side == Side.RIGHT);
            this.ensureClass('side-bottom', this.side == Side.BOTTOM);

        }
        //endregion

        //region Methods

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'side' || e.property == 'wide'){
                this.updateUi();
            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the side of the anchored element.
         */
        get side(): Side {
            return this.getPropertyValue('side', Side, Side.TOP);
        }

        /**
         * Gets or sets the side of the anchored element.
         *
         * @param {Side} value
         */
        set side(value: Side) {
            this.setPropertyValue('side', value, Number);
        }

        /**
         * Gets or sets the wide of the anchor space
         */
        get wide(): number {
            return this.getPropertyValue('wide', Number, 20);
        }

        /**
         * Gets or sets the wide of the anchor space
         *
         * @param {number} value
         */
        set wide(value: number) {
            this.setPropertyValue('wide', value, Number);
        }
        //endregion

    }

    /**
     * Anchor view that allows specifying a view inside of the anchored part.
     */
    export class SplitView extends AnchorView{

        constructor(){
            super('split');
        }

        //region Private Methods
        protected splitter_MouseDown(e: any){
            let me = e as MouseEvent;
            let d = new ClickAndDragOperation(me);
            let start = new Point(me.clientX, me.clientY);
            let startWide = this.wide;


            d.on('mouseMove', e => {
                let me = e as MouseEvent;
                let diff = 0;

                if(this.side == Side.TOP) {
                    diff = me.clientY - start.y;
                }else if(this.side == Side.BOTTOM){
                    diff = -me.clientY + start.y;
                }else if(this.side == Side.LEFT){
                    diff = me.clientX - start.x;
                }else if(this.side == Side.RIGHT) {
                    diff = -me.clientX + start.x;
                }
                this.wide = startWide + diff;
            });

            d.on('mouseUp', e => {
                // log(`MouseUp`);
            })
        };

        protected updateUi(){
            super.updateUi();

            let container: any = {
                top: null,
                left: null,
                right: null,
                bottom: null,
                width: null,
                height: null
            };
            let sideBar: any = {
                top: null,
                left: null,
                right: null,
                bottom: null,
                width: null,
                height: null
            };
            let spt: any = {
                top: null,
                left: null,
                right: null,
                bottom: null,
                width: null,
                height: null
            };

            let size = this.wide.px;
            let vertical = this.side == Side.LEFT || this.side == Side.RIGHT;

            switch (this.side) {
                case Side.TOP:
                    sideBar.bottom = 'auto';
                    sideBar.height = size;
                    container.top = size;
                    spt.top = size;
                    break;
                case Side.LEFT:
                    sideBar.right = 'auto';
                    sideBar.width = size;
                    container.left = size;
                    spt.left = size;
                    break;
                case Side.RIGHT:
                    sideBar.left = 'auto';
                    sideBar.width = size;
                    container.right = size;
                    spt.right = size;
                    break;
                case Side.BOTTOM:
                    sideBar.top = 'auto';
                    sideBar.height = size;
                    container.bottom = size;
                    spt.bottom = size;
                    break;
            }

            for(let p in container) this.container.style[p as any] = container[p];
            for(let p in sideBar) this.sideContainer.style[p as any] = sideBar[p];
            for(let p in spt) this.splitter.style[p as any] = spt[p];

            this.splitter.ensureClass('vertical', vertical);

        }
        //endregion

        //region Methods

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'sideView'){
                if(e.oldValue) {
                    (e.oldValue as Optional<View>).ifPresent(v => v.removeFromParent());
                }

                this.sideContainer.clear();
                this.sideView.ifPresent(v => this.sideContainer.add(v));

            }
        }

        /**
         * Override.
         * @param name
         */
        onEvent(name: string, args: any[]){
            super.onEvent(name, args);

            if(name == 'attach') {
                this.add(this.sideContainer);
                this.add(this.splitter);
                this.splitter.addEventListener('mousedown', e => this.splitter_MouseDown(e));

            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the side view of this split view
         */
        get sideView(): Optional<View> {
            return this.getPropertyValue('sideView', Optional, undefined);
        }

        /**
         * Gets or sets the side view of this split view
         *
         * @param {Optional<View>} value
         */
        set sideView(value: Optional<View>) {
            this.setPropertyValue('sideView', value, Optional);
        }

        /**
         * Gets or sets the wide of the splitter
         */
        get splitterWide(): number {
            return this.getPropertyValue('splitterWide', Number, 5);
        }

        /**
         * Gets or sets the wide of the splitter
         *
         * @param {number} value
         */
        set splitterWide(value: number) {
            this.setPropertyValue('splitterWide', value, Number);
        }

        //endregion

        //region Elements

        /**
         * Gets the side container
         */
        get sideContainer(): DivElement {
            return this.getLazyProperty('sideContainer', DivElement, () => {
                return new DivElement('side-container');
            });
        }

        /**
         * Gets the splitter
         */
        get splitter(): DivElement {
            return this.getLazyProperty('splitter', DivElement, () => {
                return new DivElement('splitter');
            });
        }


        //endregion
    }

    export class ColorView extends View{

        static fromString(s: string): ColorView{
            return new ColorView(Color.fromHex(s));
        }

        constructor(c: Color){
            super();
            this.raw.style.backgroundColor = c.toString();
        }
    }

    /**
     * ListView Pattern
     */
    export class ListView extends DivElement{

        constructor(){
            super('list');
        }

    }

    /**
     * Basic Overlay Pattern
     */
    export class Overlay extends DivElement{

    }


}