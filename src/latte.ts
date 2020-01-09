
declare global{
    interface Number {
        px: string;
    }

    interface NumberConstructor {
        readonly MAX_SAFE_INTEGER: number;
        readonly MIN_SAFE_INTEGER: number;
        readonly MAX_VALUE: number;
        readonly MIN_VALUE: number;
        isSafeInteger(n: number): boolean;
    }
}



Object.defineProperty((Number as any).prototype, "px", {
    get: function () {
        return this + 'px';
    },
    enumerable: false,
    configurable: true
});
// alert("implanting");

export namespace latte{

    //region Declarations

    // declare interface NumberConstructor {
    //     MAX_SAFE_INTEGER: number;
    //     MIN_SAFE_INTEGER: number;
    //     MAX_VALUE: number;
    //     MIN_VALUE: number;
    // }

    // export declare interface INumber{
    //     MAX_SAFE_INTEGER: number;
    //     MIN_SAFE_INTEGER: number;
    //     MAX_VALUE: number;
    //     MIN_VALUE: number;
    //     px: string;
    //     isSafeInteger(n: number): boolean;
    // }
    //
    // export declare var Number: INumber;
    //endregion

    //region Global Methods

    /**
     * Returns the camel case of the passed string
     * @param {string} s
     * @returns {string}
     * @private
     */
    export function _camelCase(s: string): string{

        let nextUpper = true;
        let result = "";
        let skip = false;


        if(s == null) {
            s = '';
        }

        s = String(s);

        if(s.length == 0) {
            return s;
        }

        for(let i = 0; i < s.length; i++){
            if(skip) {
                skip = false;
                nextUpper = true;
                continue;
            }else if(nextUpper) {
                nextUpper = false;
                result += s.charAt(i).toUpperCase();
                continue;
            }else{
                result += s.charAt(i);
            }

            if(i < s.length - 1) {
                let chr = s.charAt(i + 1);

                if(chr == ' ' || chr == '_') {
                    skip = true;
                }
            }

        }

        return result;
    }

    /**
     * Returns a value indicating if the parameter is an Array, optionally specifies
     * the minimum length required to return a true value
     *
     * @returns {boolean}
     */
    export function _isArray(param: any, minLength = 0){ return (param instanceof Array) && param.length >= minLength; }

    /**
     * Returns a value indicating if the parameter is a boolean
     *
     * @returns {boolean}
     */
    export function _isBoolean(param: any){ return typeof param == 'boolean'; }

    /**
     * Returns a value indicating if the parameter is a number
     *
     * @returns {boolean}
     */
    export function _isNumber(param: any){ return typeof param == 'number'; }

    /**
     * Returns a value indicating if the parameter is of numeric nature, i.e. can be parsed into a number
     * @param param
     * @returns {boolean}
     * @private
     */
    export function _isNumeric(param: any){
        let allowed = "1234567890.";

        if(!_isString(param))
            param = String(param);

        if(param.length == 0){
            return false;
        }else{
            for(let i = 0; i < param.length; i++)
                if (allowed.indexOf(param.charAt(i)) < 0)
                    return false;

            return true;
        }
    }

    /**
     * Returns a value indicating if the parameter is a string
     *
     * @returns {boolean}
     */
    export function _isString(param: any){ return typeof param == 'string'; }

    /**
     * Returns a value indicating if the parameter is undefined
     *
     * @returns {boolean}
     */
    export function _undef(param: any){ return typeof param == 'undefined'; }

    /**
     * Repeats something n times
     * @param {number} times
     * @param {() => any} callback
     * @private
     */
    export function _repeat(times: number, callback: () => any){
        for(let i = 0; i < times; i++){
            callback();
        }
    }

    /**
     * Prepends a zero to the number if lower than 10
     **/
    export function _zeroPad(n: number): string{

        n = n || 0;

        return n <= 9 ? '0' + n.toString() : n.toString();

    }

    /**
     * Zero fills the number
     * @param {number} n
     * @returns {string}
     * @private
     */
    export function _zeroFill(positions: number = 2,n: number,  chr: string = '0'): string{
        let s = String(n);
        let zeros = positions - s.length; if(zeros < 0) zeros = 0;
        let acc = '';
        _repeat(zeros, () => acc += '0');
        return acc + s;
    }

    /**
     * Logs the specified data if there's a console.
     */
    export function log(...any: any[]){
        if(!_undef(console) && !_undef(console.log)){
            if(arguments['length'] == 1){
                console.log(arguments[0]);
            }else{
                console.log(sprintf.apply(this, arguments));
            }
        }
    }

    /**
     * sprintf for only %s strings
     */
    export function sprintf(...any: any[]){
        let arg = 1, format = arguments[0], cur, next, result = [];

        for(let i = 0; i < format.length; i++){

            cur = format.substr(i, 1);
            next = i == format.length - 1 ? '' : format.substr(i + 1, 1);

            if (cur == '%' && next == 's'){
                result.push(arguments[arg++]);
                i++;
            }else{
                result.push(cur);
            }
        }

        return result.join('');
    }

    //endregion

    export type EventHandler = (...any: any[]) => any;

    export enum Side{
        TOP,
        RIGHT,
        BOTTOM,
        LEFT
    }

    export enum Orientation{
        VERTICAL,
        HORIZONTAL
    }

    /**
     * Base object who supports events
     */
    export class Eventable{

        //region Fields
        private eventHandlers: {[name: string]: EventHandler[]} = {};
        //endregion

        //region Methods

        /**
         * Handles an event
         * @param {string} eventName
         * @param {(...any: any[]) => any} handler
         */
        on(eventName: string, handler: EventHandler): this{

            if(!(eventName in this.eventHandlers)) {
                this.eventHandlers[eventName] = [];
            }

            this.eventHandlers[eventName].push(handler);

            return this;
        }

        /**
         * Override this method to catch events on the current class, before the
         * event chain has been raised.
         * @param eventName
         * @param params
         */
        onBeforeEvent(eventName: string, params: any[]){

        }

        /**
         * Override this method to catch events on the current class, once the
         * event chain has been raised.
         * @param eventName
         * @param params
         */
        onEvent(eventName: string, params: any[]){

        }

        /**
         * Raises an event
         * @param {string} eventName
         * @param params
         */
        raise(eventName: string, ...params: any[]){

            this.onBeforeEvent(eventName, params);

            if(eventName in this.eventHandlers) {
                for(let name in this.eventHandlers) {
                    this.eventHandlers[name].forEach( f => f.apply(this, params));
                }
            }

            this.onEvent(eventName, params);

        }

        //endregion

    }

    /**
     * Data passed on the didSet (property value) events
     */
    export interface DidSet{
        property: string;
        oldValue: any;
        newValue: any;
    }

    /**
     * Data passed on the willSet (property value) events
     */
    export interface WillSet extends DidSet{}

    /**
     * Options that may be applied to the <c>setPropertyValue</c> method
     */
    export interface SetPropertyOptions{
        silent?: boolean;
    }

    export type PropertyValueType = any;// (...any: any[]) => any | Function;

    export class Any{}// (...any: any[]) => any | Function;

    /**
     * Gives an object property capabilities
     */
    export class PropertyTarget extends Eventable{

        //region Static

        private static staticProperties: PropertyTarget;

        private static getStaticObject(eventObj: any): PropertyTarget{
            if(!('staticProperties' in eventObj)) {
                eventObj.staticProperties = new PropertyTarget();
            }
            return eventObj.staticProperties;
        }

        static getStaticPropertyValue(classObj: any, name: string, validator: PropertyValueType, withDefault: any = undefined): any{
            return PropertyTarget.getStaticObject(classObj).getPropertyValue(name, validator, withDefault);
        }

        static hasStaticPropertyValue(className: any, name: string): boolean{
            return PropertyTarget.getStaticObject(className).hasPropertyValue(name);
        }

        static setStaticPropertyValue<T>(className: any, name: string, validator: PropertyValueType, value: T, options: SetPropertyOptions = {}): T{
            return PropertyTarget.getStaticObject(className).setPropertyValue(name, value, validator, options);
        }

        static getStaticLazyProperty<T>(className: any, name: string, validator: PropertyValueType, creator: () => T): T{
            return PropertyTarget.getStaticObject(className).getLazyProperty(name, validator, creator);
        }

        //endregion

        //region Private
        private propertyValues: {[name: string]: any} = {};
        //endregion

        //region Protected Methods

        /**
         * Called before changing the value of a property
         * @param {latte.WillSet} e
         */
        protected willSet(e: WillSet){
            this.raise('willSet' + _camelCase(e.property), e);
        }

        /**
         * Called after chaning the value of a property
         * @param {latte.DidSet} e
         */
        protected didSet(e: DidSet){
            this.raise('didSet' + _camelCase(e.property), e);
        }

        protected valid<T>(value: T, validator: PropertyValueType): boolean{

            if(validator === null) {
                // HACK: this should not be possible.
                return true;
            }

            if(validator === (Number as any)) {
                return _isNumber(value);

            }else if(validator === Boolean) {
                return _isBoolean(value);

            }else if(validator === String) {
                return _isString(value);

            }else if(validator === Any){
                return true;

            }else{
                return value instanceof validator;
            }


            return true;
        }

        //endregion

        //region Methods

        /**
         * Deletes any value related to the property as it never was registered.
         * @param {string} name
         */
        protected deleteProperty(name: string){
            if(name in this.propertyValues) {
                delete this.propertyValues[name];
            }
        }

        /**
         * Gets the value of a property
         * @param {string} name
         * @param withDefault
         * @returns {any}
         */
        protected getPropertyValue(name: string, validator: PropertyValueType, withDefault: any):any{
            if(!(name in this.propertyValues)) {
                this.propertyValues[name] = withDefault;
            }
            return this.propertyValues[name];
        }

        /**
         * Gets a property in a lazy fashion
         * @param {string} name
         * @param {() => T} creator
         * @returns {T}
         */
        protected getLazyProperty<T>(name: string, validator: PropertyValueType, creator: () => T): T{
            if(!(name in this.propertyValues)) {
                this.propertyValues[name] = creator();
            }
            return this.getPropertyValue(name, validator, undefined);
        }

        /**
         * Returns a value indicating if there is a value for the specified property
         * @param {string} name
         * @returns {boolean}
         */
        protected hasPropertyValue(name: string): boolean{
            return name in this.propertyValues;
        }

        /**
         * Sets the value of a property
         * @param {string} name
         * @param value
         */
        protected setPropertyValue<T>(name: string, value: T, validator: PropertyValueType,
                                      options: SetPropertyOptions = {}): T{

            let oldValue = this.getPropertyValue(name, validator, undefined);
            let data = {
                property: name,
                oldValue: oldValue,
                newValue: value
            };

            // Let people know this will change
            this.willSet(data);

            // Check if a true change was done
            let changed = oldValue !== data.newValue;

            if(!this.valid(data.newValue, validator)){
                throw "Invalid property value";
            }

            // Only change if different value
            if(changed) {

                // Actually change the value
                this.propertyValues[name] = data.newValue;

                // Let people know
                if(options.silent !== true) {
                    this.didSet(data);
                }
            }

            return value;
        }
        protected setPropertyUnsafe<T>(name: string, value: T): T{
            this.propertyValues[name] = value;
            return value;
        }

        /**
         * Sets the values of more than one property
         * @param {{[name: string]: any}} values
         * @returns {this}
         */
        protected setPropertyValues(values: {[name: string]: any}): this{
            for(let i in values){
                this.setPropertyValue(i, values[i], null);
            }
            return this;
        }

        //endregion

    }

    /**
     * Inspired in Java's Optional
     */
    export class Optional<T> extends PropertyTarget{

        //region Static

        /**
         * Returns an optional with no value
         * @returns {latte.Optional<V>}
         */
        static empty<V>(): Optional<V>{
            return new Optional<V>(null);
        }

        /**
         * Returns an optional of specified value
         * @param {V} value
         * @returns {latte.Optional<V>}
         */
        static of<V>(value: V): Optional<V>{
            return new Optional(value);
        }
        //endregion

        //region Fields
        private readonly value: T;
        //endregion

        constructor(value: T){
            super();
            this.value = value;
        }

        //region Methods

        /**
         * Executes the callback if there is no value present
         * @param {() => void} callback
         */
        elseDo(callback: () => void): this{
            if(!this.isPresent) {
                callback();
            }
            return this;
        }

        /**
         * Executes the callback if a value is present
         * @param {(result: T) => void} callback
         */
        ifPresent(callback: (result: T) => void): this{
            if(this.isPresent) {
                callback(this.value);
            }
            return this;
        }

        /**
         * Returns the value (if present), specified value if not.
         * @param {T} value
         * @returns {T}
         */
        orElse(value: T): T{
            if(this.isPresent) {
                return this.value;
            }else{
                return value;
            }
        }

        /**
         * Throws the specified object if no value present
         * @param ex
         */
        orThrow(ex: any = "Value Needed"): T{
            if(!this.isPresent) {
                throw ex;
            }
            return this.value;
        }

        //endregion

        //region Properties

        /**
         * Gets a value indicating if there is a value present
         *
         * @returns {boolean}
         */
        get isPresent(): boolean {
            return this.value !== null;
        }

        //endregion

    }

    /**
     * Represents a color
     **/
    export class Color extends PropertyTarget{

        //region Static

        /**
         * Returns a combination of the specified colors
         * @param {latte.Color} colors
         * @returns {latte.Color}
         */
        static combine(...colors: Color[]): Color{
            let avg = (nums: number[]): number => Math.round(nums.reduce((acc, cur) => cur + acc) / nums.length);
            return new Color(
                avg(colors.map(c => c.r)),
                avg(colors.map(c => c.g)),
                avg(colors.map(c => c.b)),
            );
        }

        /**
         * Creates a color from the hexadecimal value.
         * It may contain the <c>#</c> symbol at the beginning of the string.
         **/
        static fromHex(hexColor: string): Color{

            // Check is string
            if(!_isString(hexColor) || hexColor.length == 0) throw "Invalid Hex: " + hexColor;

            // Remove #
            if(hexColor.charAt(0) == '#') hexColor = hexColor.substr(1);

            // Check length
            if(!(hexColor.length == 3 || hexColor.length == 6 || hexColor.length == 8)) throw "Invalid Hex: " + hexColor;

            let c = new latte.Color();

            let toDecimal = function(hex: any){ return parseInt(hex, 16); };

            // If three digits
            if(hexColor.length == 3){
                c.r = (toDecimal(hexColor.charAt(0) + hexColor.charAt(0)));
                c.g = (toDecimal(hexColor.charAt(1) + hexColor.charAt(1)));
                c.b = (toDecimal(hexColor.charAt(2) + hexColor.charAt(2)));
            }else{
                c.r = (toDecimal(hexColor.charAt(0) + hexColor.charAt(1)));
                c.g = (toDecimal(hexColor.charAt(2) + hexColor.charAt(3)));
                c.b = (toDecimal(hexColor.charAt(4) + hexColor.charAt(5)));

                if(hexColor.length == 8)
                    c.a = (toDecimal(hexColor.charAt(6) + hexColor.charAt(7)));
            }

            return c;

        }

        /**
         * Gets the color from the specifed 32 byte based integer
         * @param {number} n
         * @returns {latte.Color}
         */
        static fromInt32(n: number): Color{
            return new Color(
                n & 0xff,
                (n & 0xff00) >>> 8,
                (n & 0xff0000) >>> 16,
                (n & 0xFF000000) >>> 24
            );
        }

        /**
         * Gets the RGB (Red, Green, Blue) components from a CMYK namespace
         * @param c
         * @param m
         * @param y
         * @param k
         * @returns number[]
         */
        static cmykToRgb(c: number, m: number, y: number, k: number): number[]{
            return [
                Math.round(255 * (1 - c) * (1 - k)),
                Math.round(255 * (1 - m) * (1 - k)),
                Math.round(255 * (1 - y) * (1 - k))
            ]
        }

        /**
         * HSV to RGB color conversion
         *
         * H runs from 0 to 360 degrees
         * S and V run from 0 to 1
         *
         * Ported from the excellent java algorithm by Eugene Vishnevsky at:
         * http://www.cs.rit.edu/~ncs/color/t_convert.html
         */
        static hsvToRgb(h: number, s: number, v: number): number[] {
            let r, g, b;
            let i;
            let f, p, q, t;

            // Make sure our arguments stay in-range
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));

            if(s == 0) {
                // Achromatic (grey)
                r = g = b = v;
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }

            h /= 60; // sector 0 to 5
            i = Math.floor(h);
            f = h - i; // factorial part of h
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));

            switch(i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
                default: // case 5:
                    r = v;
                    g = p;
                    b = q;
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        /**
         * Gets the CMYK (Cyan, Magenta, Yellow and Key Black) components from a RGB namespace
         * @param red
         * @param green
         * @param blue
         * @returns {number[]}
         */
        static rgbToCmyk(red: number, green: number, blue: number): number[]{
            var r = red / 255;
            var g = green / 255;
            var b = blue / 255;
            var k = 1 - Math.max(r, g, b);
            var ck = 1 - k;
            return [
                (1 - r - k) / ck,
                (1 - g - k) / ck,
                (1 - b - k) / ck,
                k
            ]
        }

        /**
         * Gets the HSV (Hue, Saturation, Value) components from a RGB namespace
         * @param red
         * @param green
         * @param blue
         * @returns {number[]}
         */
        static rgbToHsv(red: number, green: number, blue: number): number[]{
            let rr, gg, bb;
            let r = red / 255;
            let g = green / 255;
            let b = blue / 255;
            let h = 0;
            let s = 0;
            let v = Math.max(r, g, b);
            let diff = v - Math.min(r, g, b);
            let diffc = (c: number) => { return (v - c) / 6 / diff + 1 / 2 };

            if(diff == 0) {
                h = s = 0;
            }else {
                s = diff / v;
                rr = diffc(r);
                gg = diffc(g);
                bb = diffc(b);

                if(r === v) {
                    h = bb - gg;
                }else if(g === v) {
                    h = (1 / 3) + rr - bb;
                }else if(b === v) {
                    h = (2 / 3) + gg - rr;
                }
            }

            if(h < 0) {
                h += 1;
            }else if(h > 1) {
                h -= 1;
            }

            return [
                Math.round(h * 360),
                Math.round(s),
                Math.round(v)
            ];
        }

        /**
         * Gets the black color
         */
        static get black(): Color {
            return PropertyTarget.getStaticLazyProperty(Color, 'black', Color, () => {
                return new Color(0,0,0);
            });
        }

        /**
         * Gets the white color
         */
        static get white(): Color {
            return PropertyTarget.getStaticLazyProperty(Color, 'white', Color, () => {
                return new Color(255, 255, 255);
            });
        }

        /**
         * Gets the red color
         */
        static get red(): Color {
            return PropertyTarget.getStaticLazyProperty(Color, 'red', Color,() => {
                return new Color(255, 0, 0);
            });
        }

        /**
         * Gets the green color
         */
        static get green(): Color {
            return PropertyTarget.getStaticLazyProperty(Color, 'green', Color,() => {
                return new Color(0, 128, 0);
            });
        }

        /**
         * Gets the blue color
         */
        static get blue(): Color {
            return PropertyTarget.getStaticLazyProperty(Color, 'blue', Color, () => {
                return new Color(0, 0, 255);
            });
        }

        /**
         * Gets the transparent color
         */
        static get transparent(): Color {
            return PropertyTarget.getStaticLazyProperty(Color, 'transparent', Color, () => {
                return new Color(0,0,0,0);
            });
        }

        //endregion

        /**
         * Creates the color from the specified RGB and Aplha components.
         **/
        constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255){
            super();
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        //region Methods

        /**
         * Returns a value indicating if the color is equals to the one specified by the parameter
         * @param {latte.Color} c
         * @returns {boolean}
         */
        equals(c: Color): boolean{
            return c.a == this.a && c.r === this.r && c.g === this.g && c.b === this.b;
        }

        /**
         * Returns a copy of the color with the specified alpha between 0 and 255.
         *
         * @param alpha
         */
        fade(alpha: number): Color{
            return new Color(this.r, this.g, this.b, alpha);
        }

        /**
         * Returns a copy of the color with the specified alpha between 0 and 1.
         *
         * @param alphaFloat
         */
        fadeFloat(alphaFloat: number): Color{
            return new Color(this.r, this.g, this.b, alphaFloat * 255);
        }

        /**
         * Returns the color as a hex string
         **/
        toHexString(): string{

            var d = function(s: string){ if(s.length == 1) return '0' + s; return s; };

            if(this.a != 255){
                return '#' + d(this.r.toString(16)) + d(this.g.toString(16)) + d(this.b.toString(16))+ d(this.a.toString(16));
            }else{
                return '#' + d(this.r.toString(16)) + d(this.g.toString(16)) + d(this.b.toString(16));
            }

        }

        /**
         * Returns the color as an int32 representation
         * @returns {number}
         */
        toInt32(): number{
            return (this.a << 24)	|	// alpha
                (this.b  << 16)	|	// blue
                (this.g  <<  8)	|	// green
                this.r;			    // red
        }

        /**
         * Returns the color in the format: rgba(0, 0, 0, 255)
         * @returns {string}
         */
        toRgbString(): string{
            return sprintf('rgba(%s, %s, %s, %s)', this.r, this.g, this.b, this.a);
        }

        /**
         * Returns the color as a string
         **/
        toString(): string{

            if(this.isTransparent){
                return 'transparent';

            }else if(this.a != 255){
                return this.toRgbString();

            }else{
                return this.toHexString();
            }

        }

        //endregion

        //region Properties

        /**
         * Gets or sets the alpha component (0 to 255)
         */
        get a(): number {
            return this.getPropertyValue('a', Number,255);
        }

        /**
         * Gets or sets the alpha component (0 to 255)
         *
         * @param {number} value
         */
        set a(value: number) {
            this.setPropertyValue('a', value, Number);
        }

        /**
         * Gets or sets the blue component (0 to 255)
         */
        get b(): number {
            return this.getPropertyValue('b', Number, 0);
        }

        /**
         * Gets or sets the blue component (0 to 255)
         *
         * @param {number} value
         */
        set b(value: number) {
            this.setPropertyValue('b', value, Number);
        }

        /**
         * Gets or sets the Cyan component of the CMKYK namespace
         *
         * @returns {number}
         */
        get c():number {
            return (1 - (this.r / 255) - this.k) / (1 - this.k);
        }

        /**
         * Gets or sets the green component of the color (0 to 255)
         */
        get g(): number {
            return this.getPropertyValue('g', Number, 0);
        }

        /**
         * Gets or sets the green component of the color (0 to 255)
         *
         * @param {number} value
         */
        set g(value: number) {
            this.setPropertyValue('g', value, Number);
        }

        /**
         * Gets the K (Black Key) component of the CMKYK namespace
         *
         * @returns {number}
         */
        get k():number {
            return 1 - Math.max(this.r / 255, this.g / 255, this.b / 255);
        }

        /**
         * Gets the Magenta component of the CMYK namespace
         *
         * @returns {number}
         */
        get m():number{
            return (1 - (this.g / 255) - this.k) / (1 - this.k);
        }

        /**
         * Gets the Yellow component of the CMYK namespace
         *
         * @returns {number}
         */
        get y():number {
            return (1 - (this.b / 255) - this.k) / (1 - this.k);
        }

        /**
         * Gets a value indicating if the color is a dark color, by checking its perceived luminosity
         *
         * @returns {boolean}
         */
        get isDark(): boolean{
            return this.perceivedLuminosity > 0.5;
        }

        /**
         * Gets a value indicating if the color is a light color, by checking its perceived luminosity
         *
         * @returns {boolean}
         */
        get isLight(): boolean{
            return this.perceivedLuminosity <= 0.5;
        }

        /**
         * Gets a value indicating if the color is transparent.
         **/
        get isTransparent(): boolean{
            return this.a === 0;
        }

        /**
         * Returns the perceived luminosity (https://en.wikipedia.org/wiki/Luminous_intensity)
         *
         *
         * @returns {number}
         */
        get perceivedLuminosity(): number{
            // Preceived Luminosity
            let a = 1 - (this.r * 0.299 + this.g * 0.587 + this.b * 0.114) / 255;

            return a;

        }

        /**
         * Gets or sets the red component of the color (0 to 255)
         */
        get r(): number {
            return this.getPropertyValue('r', Number, 0);
        }

        /**
         * Gets or sets the red component of the color (0 to 255)
         *
         * @param {number} value
         */
        set r(value: number) {
            this.setPropertyValue('r', value, Number);
        }
        //endregion
    }

    /**
     * Represents a time interval.
     **/
    export class TimeSpan extends PropertyTarget{

        millis: number = 0;

        /**
         * Gets the maximum representable TimeSpan
         */
        static get MAX_VALUE(): TimeSpan {
            return PropertyTarget.getStaticLazyProperty(TimeSpan, 'MAX_VALUE', TimeSpan, () => {
                return TimeSpan.fromMilliseconds(Number.MAX_SAFE_INTEGER);
            });
        }

        /**
         * Gets the minimum representable TimeSpan
         */
        static get MIN_VALUE(): TimeSpan {
            return PropertyTarget.getStaticLazyProperty(TimeSpan, 'MIN_VALUE', TimeSpan, () => {
                return TimeSpan.fromMilliseconds(Number.MIN_SAFE_INTEGER * -1).negate();
            });
        }

        /**
         * Creates a TimeSpan from the specified amount of days
         **/
        static fromDays(days: number): TimeSpan{

            let negate = days < 0;
            let result = new TimeSpan(Math.abs(days));

            if(negate) {
                result.negate();
            }

            return result;

        }

        /**
         * Creates a TimeSpan from the specified amount of hours
         **/
        static fromHours(hours: number): TimeSpan{

            let negate = hours < 0;
            let result = new TimeSpan(0, Math.abs(hours));

            if(negate) {
                result.negate();
            }

            return result;

        }

        /**
         * Creates a TimeSpan from the specified amount of milliseconds
         **/
        static fromMilliseconds(milliseconds: number): TimeSpan{

            let negate = milliseconds < 0;
            let t = new TimeSpan(0,0,0,0, Math.abs(milliseconds));

            if(negate) {
                t.negate();
            }

            return t;

        }

        /**
         * Creates a TimeSpan from the specified amount of minutes
         **/
        static fromMinutes(minutes: number): TimeSpan{

            let negate = minutes < 0;
            let result = new TimeSpan(0,0, Math.abs(minutes));

            if(negate) {
                result.negate();
            }

            return result;

        }

        /**
         * Creates a TimeSpan from the specified amount of seconds
         **/
        static fromSeconds(seconds: number): TimeSpan{

            let negate = seconds < 0;
            let result = new TimeSpan(0, 0, 0, Math.abs(seconds));

            if(negate) {
                result.negate();
            }

            return result
        }

        /**
         * Creates a TimeSpan object from the specified string.
         String should be in the format <c>hh:mm:ss</c>
         **/
        static fromString(timeString: string): TimeSpan{

            let parts = timeString.split(':');

            if(parts.length !== 3) {
                throw "Wrong format: [D] hh:mm:ss[.millis]"
            }

            let negate = timeString.trim().indexOf('-') === 0;


            let first = parts[0];
            let middle = parts[1];
            let last = parts[2];

            let days = 0;
            let hours = 0;
            let minutes = parseInt(middle, 10);
            let seconds = 0;
            let milliseconds = 0;

            if(first.indexOf(' ') >= 0) {
                let firstParts = first.split(' ');

                if(firstParts.length != 2 ) throw "Invalid format of first part: Days + space + hours";

                days = parseInt(firstParts[0], 10);
                hours = parseInt(firstParts[1], 10)
            }else{

                hours = parseInt(first, 10);
            }

            if(last.indexOf('.') >= 0) {
                let lastParts = last.split('.');
                if(lastParts.length != 2 ) throw "Invalid format of last part: Seconds + dot + milliseconds";
                seconds = parseInt(lastParts[0], 10);
                milliseconds= parseInt(lastParts[1], 10) * 100;

            }else{
                seconds = parseInt(last, 10);
            }

            let result = new TimeSpan(days, hours, minutes, seconds, milliseconds);

            if(negate) {
                result.negate();
            }

            return result;

        }

        /**
         * Gets a timespan with the time passed since the specified date and time
         * @param d
         */
        static timeSince(d: DateTime): TimeSpan{
            return DateTime.now.subtractDate(d);
        }

        /**
         * Creates the TimeSpan with the specified parameters. Parameters not specified will be asumed to be zero.
         **/
        constructor(days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0){

            super();

            if(days < 0 || hours < 0 || minutes < 0 || seconds < 0 || milliseconds < 0) {
                throw "Parameters on constructor can't be negative";
            }

            this.millis = (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;

            if(!Number.isSafeInteger(this.millis)) {
                throw "Total milliseconds must be a safe integer";
            }

        }

        /**
         * Makes math rounding depending on the sign of the milliseconds
         **/
        private _rounder(number: number){

            if(this.millis < 0)
                return Math.ceil(number);

            return Math.floor(number);

        }

        /**
         * Prepends a zero to the number if lower than 10
         **/
        private _zeroPad(n: number): string{
            return n <= 9 ? '0' + n.toString() : n.toString();
        }

        /**
         * Returns the result of adding the specified timespan to this timespan
         **/
        add(timespan: TimeSpan): TimeSpan{
            return TimeSpan.fromMilliseconds(this.millis + timespan.millis);
        }

        /**
         * Returns the result of adding the specified amount of hours to this timespan
         **/
        addHours(hours: number): TimeSpan{

            return this.add(new TimeSpan(0, hours));

        }

        /**
         * Returns the result of adding the specified amount of minutes to this timespan
         **/
        addMinutes(minutes: number): TimeSpan{

            return this.add(new TimeSpan(0, 0, minutes));

        }

        /**
         * Returns the result of adding the specified amount of seconds to this timespan
         **/
        addSeconds(seconds: number): TimeSpan{

            return this.add(new TimeSpan(0, 0, 0, seconds));

        }

        /**
         * Returns the result of comparing this timespan against the provided timespan
         **/
        compareTo(timespan: TimeSpan): number{
            return this.millis - timespan.millis;
        }

        /**
         * Returns a value indicating if this timespan represents the same than the specified timespan
         **/
        equals(timespan: TimeSpan): boolean{
            return this.millis == timespan.millis;
        }

        /**
         * Negates the timespan duration
         **/
        negate(): this{
            this.millis *= -1;
            return this;
        }

        /**
         * Returns the result of subtracting the specified timespan to this timespan
         **/
        subtract(timespan: TimeSpan): TimeSpan{
            return TimeSpan.fromMilliseconds(this.millis - timespan.millis);
        }

        /**
         * Returns this timespan as a string
         **/
        toString(includeMilliseconds: boolean = false): string{

            return  (this.millis < 0 ? '-' : '') +
                (this.days ? Math.abs(this.days) + ' ' : '') +
                this._zeroPad(Math.abs(this.hours)) + ":" +
                this._zeroPad(Math.abs(this.minutes)) + ':' +
                this._zeroPad(Math.abs(this.seconds)) +
                (includeMilliseconds ? '.' + _zeroFill(3, Math.abs(this.milliseconds)) : '');

        }

        /**
         * Gets the timespan as a number
         * @returns {number}
         */
        valueOf(): number{
            return this.millis;
        }

        /**
         * Gets the days component of the time interval represented by this object
         **/
        get days(): number{
            return this._rounder(this.millis / 86400000 );
        }

        /**
         * Gets the hours component of the time interval represented by this object
         **/
        get hours(): number{

            return this._rounder( (this.millis % (24 * 3600 * 1000)) / (3600 * 1000));

        }

        /**
         * Gets a value indicating if the total time this timespan represents is zero
         **/
        get isEmpty(): boolean{

            return this.millis == 0;

        }

        /**
         * Gets the milliseconds component of the time interval represented by this object
         **/
        get milliseconds(): number{

            return this._rounder(this.millis % 1000);

        }

        /**
         * Gets the minutes component of the time interval represented by this object
         **/
        get minutes(): number{

            return this._rounder( (this.millis % (3600 * 1000)) / (60 * 1000));

        }

        /**
         * Gets the seconds component of the time interval represented by this object
         **/
        get seconds(): number{

            return this._rounder((this.millis % 60000) / 1000);

        }

        /**
         * Gets the value of this timespan expressed in whole and fractional days
         **/
        get totalDays(): number{

            //                     86400000
            return this.millis / (86400000);

        }

        /**
         * Gets the value of this timespan expressed in whole and fractional hours
         **/
        get totalHours(): number{

            return this.millis / (3600000);

        }

        /**
         * Gets the value of this timespan expressed in milliseconds
         **/
        get totalMilliseconds(): number{

            return this.millis;

        }

        /**
         * Gets the value of this timespan expressed in whole and fractional minutes
         **/
        get totalMinutes(): number{
            return this.millis / (60 * 1000);
        }

        /**
         * Gets the value of this timespan expressed in whole and fractional seconds
         **/
        get totalSeconds(): number{

            return this.millis / 1000;

        }
    }

    /**
     * Represents a specific date and time
     **/
    export class DateTime extends PropertyTarget{

        //region Static

        /**
         * Gets the maximum representable date
         */
        static get MAX_VALUE(): DateTime {
            return PropertyTarget.getStaticLazyProperty(DateTime, 'MAX_VALUE', DateTime,() => {
                return DateTime.fromMilliseconds(Number.MAX_SAFE_INTEGER);
            });
        }

        /**
         * Gets the minimum representable date
         */
        static get MIN_VALUE(): DateTime {
            return PropertyTarget.getStaticLazyProperty(DateTime, 'MIN_VALUE', DateTime, () => {
                return new DateTime(1, 1, 1);
            });
        }


        /**
         * Amount of days in months of a non-leap year
         **/
        static monthDays: Array<number> = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        /**
         * Amount of days in months of leap year
         **/
        static monthDaysLeapYear: Array<number> = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        /**
         * Returns the absolute number of days on the specified day-month-year
         **/
        static absoluteDays(year: number, month: number, day: number): number{

            let div = function(a: number, b: number) { return Math.floor(a / b); };
            let arr = DateTime.isLeapYear(year) ?
                [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366] :
                [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
            let num = year - 1;
            return ((((((num * 365) + div(num, 4)) - div(num, 100)) + div(num,400)) + arr[month - 1]) + day) - 1;

        }

        /**
         * Returns the amount of days in the specified month of the specified year
         **/
        static daysInMonth(year: number, month: number): number{

            if(DateTime.isLeapYear(year)){
                return DateTime.monthDaysLeapYear[month];
            }else{
                return DateTime.monthDays[month];
            }

        }

        /**
         * Returns a DateTime object from the specifed date and time components
         **/
        static fromDateAndTime(date: DateTime, time: TimeSpan): DateTime{
            return new DateTime(date.year, date.month, date.day,
                time.hours, time.minutes, time.seconds, time.milliseconds);
        }

        /**
         * Returns a DateTime object from the specified amount of milliseconds
         **/
        static fromMilliseconds(milliseconds: number): DateTime{

            let d = new DateTime();
            d._span = TimeSpan.fromMilliseconds(milliseconds);
            return d;

        }

        /**
         * Creates a DateTime object from the specified string.
         String should be in the format <c>yyyy-mm-dd hh:mm:ss</c>
         **/
        static fromString(dateTimeString: string): DateTime{

            if(dateTimeString.length === 0)
                throw "Invalid date format";

            let year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;
            let parts = dateTimeString.split(' ');
            let dateParts = parts.length > 0 ? parts[0].split('-') : [];
            let timeOfDay = parts.length > 1 ? TimeSpan.fromString(parts[1]) : new TimeSpan();

            if(dateParts.length === 3){
                year = parseInt(dateParts[0], 10);
                month = parseInt(dateParts[1], 10);
                day = parseInt(dateParts[2], 10);

                if(isNaN(year) || isNaN(month) || isNaN(day)){
                    throw "Date has invalid numbers";
                }

            }else{
                throw "Invalid date format";
            }

            hour = timeOfDay.hours;
            minute = timeOfDay.minutes;
            second = timeOfDay.seconds;

            if(year <= 0 || month <= 0 || day < 0)
                throw "Date components can't be lower than one.";

            return new DateTime(year, month, day, hour, minute, second);

        }

        /**
         * Returns a value indicating if the specified year is leap year
         **/
        static isLeapYear(year: number): boolean{

            if (( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0)){
                return true;
            }

            return false;

        }

        /**
         * Gets a DateTime representing the current millisecond
         **/
        static get now(): DateTime{
            let d = new Date(); // Native Js Object
            return new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());

        }

        /**
         * Gets a DateTime representing the current day without time component
         **/
        static get today(): DateTime{

            let d = new Date();
            return new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate());

        }

        /**
         * Gets a DateTime representing the day of tomorrow without time component
         **/
        static get tomorrow(): DateTime{

            let d = new Date();
            return (new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate())).addDays(1);

        }

        /**
         * Gets the unix epoch
         * @returns {latte.DateTime}
         */
        static get epoch(): DateTime{
            return new DateTime(1970, 1, 1);
        }

        /**
         * Gets a DateTime representing the day of yesterday without time component
         **/
        static get yesterday(): DateTime{

            let d = new Date();
            return (new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate())).addDays(-1);

        }
        //endregion
        //region Fields
        _span: TimeSpan;
        //endregion
        /**
         * Creates the DateTime object
         **/
        constructor(year: number = 1, month: number = 1, day: number = 1, hour: number = 0, minute: number = null, second: number = null, millisecond: number = null){

            super();

            if(year <= 0 || month <= 0 || day <= 0) {
                throw "No argument can be <= 0";
            }

            // Calculate days
            let days = DateTime.absoluteDays(year, month, day);

            // Calculate TimeSpan
            this._span = new TimeSpan(days, hour, minute, second, millisecond);

        }

        //region Private Methods

        /**
         * Returns the specified element of date.
         Possible values for <c>what</c> are: <c>year</c> | <c>month</c> | <c>dayyear</c> | <c>day</c>
         **/
        private fromTimeSpan(what: 'year' | 'dayyear' | 'month' |'day'): number{


            let div = function(a: number, b: number){ return Math.floor(a/b); };
            let num2: number = this._span.days;
            let num3: number = div(num2, 146097);

            num2 -= num3 * 146097;

            let num4 = div(num2, 36524);

            if(num4 == 4){
                num4 = 3;
            }

            num2 -= num4 * 36524;

            let num5 = div(num2, 1461);

            num2 -= num5 * 1461;

            let num6 = div(num2, 365);

            if(num6 == 4){
                num6 = 3;
            }

            if(what=="year"){
                return (((((num3 * 400) + (num4 * 100)) + (num5 * 4)) + num6) + 1);
            }

            num2 -= num6 *365;

            if(what=="dayyear"){
                return (num2 + 1);
            }

            let arr = ((num6 == 3) && ((num5 != 24) || (num4 ==3))) ?
                [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366] :
                [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

            let index = num2 >> 6;

            while(num2 >= arr[index]){
                index++;
            }

            if(what=="month"){
                return index;
            }

            return ((num2 - arr[index -1]) + 1);


        }
        //endregion
        //region Methods

        /**
         * Returns the result of adding the specified timespan to this date
         **/
        add(timespan: TimeSpan): DateTime{

            return DateTime.fromMilliseconds(this._span.millis + timespan.millis);

        }

        /**
         * Returns the result of adding the specified amount of days to this date
         **/
        addDays(days: number): DateTime{

            return DateTime.fromMilliseconds(this._span.millis + days * 86400000);

        }

        /**
         * Returns the result of adding the specified amount of hours to this date
         **/
        addHours(hours: number): DateTime{

            return DateTime.fromMilliseconds(this._span.millis + hours * 3600000);

        }

        /**
         * Returns the result of adding the specified amount of milliseconds to this date
         **/
        addMilliseconds(milliseconds: number): DateTime{

            return DateTime.fromMilliseconds(this._span.millis + milliseconds);

        }

        /**
         * Returns the result of adding the specified amount of minutes to this date
         **/
        addMinutes(minutes: number): DateTime{

            return DateTime.fromMilliseconds(this._span.millis + minutes * 60000);

        }

        /**
         * Returns the result of adding the specified amount of months to this date
         **/
        addMonths(months: number): DateTime{


            let year = this.year;
            let month = this.month;
            let day = this.day;
            let newMonth = month - 1 + months;

            if(newMonth < 0){
                month = 12 + (newMonth + 1) % 12;
                year += Math.ceil((newMonth - 11) / 12);
            }else{
                month = newMonth % 12 + 1;
                year += Math.floor(newMonth / 12);
            }

            if(year < 1 || year > 9999){
                throw "Invalid 'months'";
            }else{

                let daysInMonth = DateTime.daysInMonth(year, month);

                if(day > daysInMonth) day = daysInMonth;

                return new DateTime(year, month, day);
            }

        }

        /**
         * Returns the result of adding the specified amount of seconds to this date
         **/
        addSeconds(seconds: number): DateTime{

            return  DateTime.fromMilliseconds(this._span.millis + seconds * 1000);

        }

        /**
         * Returns the result of adding the specified amount of years to this date
         **/
        addYears(years: number): DateTime{

            return this.addMonths(years * 12);

        }

        /**
         * Returns the result of comparing this datetime to the specified datetime
         **/
        compareTo(datetime: DateTime): number{

            return this._span.compareTo(datetime._span);

        }

        /**
         * Gets a value indicating if the specified datetime is equals to this datetime
         **/
        equals(datetime: DateTime): boolean{

            return this._span.equals(datetime._span);

        }

        /**
         * Returns a value indicating if the date is contained in the range specified by the arguments
         **/
        onRange(start: DateTime, end: DateTime): boolean{

            return this.compareTo(start) >= 0 && this.compareTo(end) <= 0;

        }

        /**
         * Returns the result of subtracting the specified datetime to this datetime
         **/
        subtractDate(datetime: DateTime): TimeSpan{
            return TimeSpan.fromMilliseconds(this._span.millis - datetime._span.millis);
        }

        /**
         * Returns the result of subtracting the specified timespan to this datetime
         **/
        subtractTime(timespan: TimeSpan): DateTime{
            return DateTime.fromMilliseconds(this._span.millis - timespan.millis);

        }

        /**
         * Gets the Date as an absolute measure of milliseconds
         * @returns {number}
         */
        toMilliseconds(): number{
            return this._span.totalMilliseconds;
        }

        /**
         * Gets the DateTime as a string
         **/
        toString(includeTime = true): string{


            if(isNaN(this.year)) return '';

            let t = this.timeOfDay;
            let r = this.year + '-' + _zeroPad(this.month) + '-' + _zeroPad(this.day);

            if(includeTime){
                r += ' ' + _zeroPad(t.hours) + ":" + _zeroPad(t.minutes) + ':'
                    + _zeroPad(t.seconds);
            }

            return r;

        }

        /**
         * Gets a value of the object
         * @returns {number}
         */
        valueOf(): number{
            if(!this.thisEpoch) {
                return 0;
            }else {
                return this._span.millis;
            }
        }
        //endregion
        //region Properties

        /**
         * Gets the day of this datetime
         **/
        get day(): number{
            return this.fromTimeSpan("day");
        }

        /**
         * Gets the day of week this datetime. Sunday is 0 and Saturday is 6.
         **/
        get dayOfWeek(): number{

            return (this._span.days + 1) % 7;

        }

        /**
         * Gets the day of year datetime
         **/
        get dayOfYear(): number{

            return this.fromTimeSpan("dayyear");

        }

        /**
         * Returns just the date component of this datetime
         **/
        get date(): DateTime{

            return new DateTime(this.year, this.month, this.day);

        }

        /**
         * Gets the hour of the datetime
         **/
        get hour(): number{

            return this._span.hours;

        }

        /**
         * Gets the millisecond of the date
         **/
        get millisecond(): number{

            return this._span.milliseconds;

        }

        /**
         * Gets the minute of the time
         **/
        get minute(): number{

            return this._span.minutes;

        }

        /**
         * Gets the month of the date
         **/
        get month(): number{

            return this.fromTimeSpan("month");

        }

        /**
         * Gets the second of the date
         **/
        get second(): number{

            return this._span.seconds;

        }

        /**
         * Gets the time component of this datetime
         **/
        get timeOfDay(): TimeSpan{

            return TimeSpan.fromMilliseconds(this._span.millis % 86400000);

        }

        /**
         * Gets a value indicating if the date is after the unix epoch
         *
         * @returns {boolean}
         */
        get thisEpoch(): boolean {
            return this.compareTo(new DateTime(2, 1, 1)) > 0;
        }

        /**
         * Gets the week number of date. First week of year is 1
         **/
        get weekOfYear(): number{


            let oneJan = new DateTime(this.year, 1, 1);

            return Math.ceil((this.dayOfYear + oneJan.dayOfWeek) / 7);

        }

        /**
         * Gets the year of the date
         **/
        get year(): number{

            return this.fromTimeSpan("year");

        }
        //endregion
    }

    class OldEventHandler{
        constructor(public handler: any, public context: any){}
    }

    /**
     * Manages events and event handlers
     */
    export class LatteEvent_deprecated{

        public handlers: Array<OldEventHandler> = [];

        /**
         * Raised when a handler is added to the event
         */
        public _handlerAdded: LatteEvent_deprecated;

        /**
         *
         * @param context Context where
         */
        constructor(public context: any){

        }

        /**
         * Gets the event for handler adding
         *
         * @returns {LatteEvent_deprecated}
         */
        get handlerAdded(): LatteEvent_deprecated{
            if(!this._handlerAdded){
                this._handlerAdded = new LatteEvent_deprecated(this);
            }
            return this._handlerAdded;
        }

        /**
         * Adds a handler to the event
         * @param handler
         */
        add(handler: Function, context: any = null){

//            var c = context === null ? this.context : context;
            this.handlers.push(new OldEventHandler(handler, context));

            this.onHandlerAdded(handler);
        }

        /**
         * Raises the <c>handlerAdded</c> event
         * @param handler
         */
        onHandlerAdded(handler: Function){
            this.handlerAdded.raise(handler);
        }

        /**
         * Raises the actual event handlers.
         * @param parameter
         * @returns {*}
         */
        raise(...parameter: any[]): any{

            var args = arguments;

            // Call each handler
            for(var i = 0; i < this.handlers.length; i++){

                var evh = this.handlers[i];

                if(!evh.handler) continue;

                var result: any = evh.handler.apply(evh.context || this.context, args);

                if(typeof result == 'boolean'){
                    return result;
                }
            }
        }

        /**
         * Removes the specified handler
         * @param {Function} handler
         */
        remove(handler: Function){

            let index = -1;

            this.handlers.forEach((h, i) => {
                if(h.handler == handler){
                    index = i;
                }
            });

            if(index >= 0) {
                this.handlers.splice(index, 1);
            }
        }

    }

    /**
     * Represents a inmmutable point
     */
    export class Point extends PropertyTarget{

        //region Static

        /**
         * Gets the distance between two points
         * @param a
         * @param b
         */
        static distance(a: Point, b: Point): number{
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y , 2));
        }

        /**
         * Gets an empty point
         */
        static get origin(): Point {
            return PropertyTarget.getStaticLazyProperty(Point, 'origin', Point, () => {
                return new Point(0, 0);
            });
        }


        //endregion

        /**
         * Creates a new point, optionally
         */
        constructor(x: number = null, y: number = null) {
            super();

            this.setPropertyValue('x', x, Number);
            this.setPropertyValue('y', y, Number);
        }

        //region Methods

        /**
         * Gets the distance to the specified point
         * @param {latte.Point} p
         * @returns {number}
         */
        distanceTo(p: Point): number{
            return Point.distance(this, p);
        }

        /**
         * Gets a value indicating if the passed point is equals to this one
         * @param {latte.Point} p
         * @returns {boolean}
         */
        equals(p: Point): boolean{
            return this.x == p.x && p.y == this.y;
        }

        /**
         * Returns the offset operation of the point
         *
         * @param x
         * @param y
         * @returns {latte.Point}
         */
        offset(x: number, y: number): Point{
            return new Point(this.x + x, this.y + y);
        }

        /**
         * Returns a Point with rounded components
         * @returns {latte.Point}
         */
        round(): Point{
            return new Point(Math.round(this.x), Math.round(this.y));
        }

        /**
         * Gets string representation of the point
         * @returns {string}
         */
        toString(): string{
            return sprintf("(%s, %s)", this.x, this.y);
        }

        //endregion

        //region Properties

        /**
         * Gets a value indicating if the Point is the origin
         *
         * @returns {boolean}
         */
        get isOrigin(): boolean {
            return this.x === 0 && this.y === 0;
        }


        /**
         * Gets the x component of the point
         */
        get x(): number {
            return this.getPropertyValue('x', Number, null);
        }

        /**
         * Gets the y component of the point
         */
        get y(): number {
            return this.getPropertyValue('y', Number, null);
        }

        //endregion
    }

    /**
     * Represents a size vector
     */
    export class Size extends PropertyTarget {

        //region Static
        /**
         * Gets the default empty size
         */
        static get empty(): Size {
            return PropertyTarget.getStaticLazyProperty(Size, 'empty', Size, () => {
                return new Size(0, 0);
            });
        }

        //endregion

        /**
         * Creates a new Size, optionally sets its Width and Height components
         */
        constructor(width: number = 0, height: number = 0) {
            super();
            this.setPropertyValue('width', width, Number);
            this.setPropertyValue( 'height', height, Number);
        }

        //region Methods
        /**
         * Gets a value indicating if the size contains the specified size.
         * @param size
         */
        contains(size: Size): boolean{
            return this.width >= size.width && this.height >= size.height;
        }

        /**
         * Returns a value indicating if the size is
         * @param {latte.Size} s
         * @returns {boolean}
         */
        equals(s: Size): boolean{
            return this.width == s.width && this.height == s.height;
        }

        /**
         * Inflates the size on the specified width and height
         *
         * @param width
         * @param height
         * @returns {latte.Size}
         */
        inflate(width: number, height: number): Size{
            return new Size(this.width + width, this.height + height);
        }

        /**
         * Inflates the size uniformly
         * @param wide
         */
        inflateUniform(wide: number){
            return new Size(this.width + wide, this.height + wide);
        }

        /**
         * Returns a new size with rounded dimensions
         * @returns {latte.Size}
         */
        round(): Size{
            return new Size(Math.round(this.width), Math.round(this.height));
        }

        /**
         * Gets a scaled Size that fits in the specified target.
         * @param target
         */
        scaleToFit(target: Size): Size {
            let dh = target.width * this.height / this.width;

            if(dh > target.height) {
                return new Size( target.height * this.width / this.height, target.height);
            }

            return new Size(target.width, dh);
        }

        /**
         * Gets a scaled Size that fills the specified target.
         * @param target
         */
        scaleToFill(target: Size): Size{
            let dh = target.width * this.height / this.width;

            if(dh <= target.height) {
                return new Size( target.height * this.width / this.height, target.height);
            }

            return new Size(target.width, dh);
        }

        /**
         * Gets string representation of the size
         * @returns {string}
         */
        toString(): string{
            return sprintf("(%s, %s)", this.width, this.height);
        }
        //endregion

        //region Properties
        /**
         * Gets the area represented by the size
         *
         * @returns {number}
         */
        get area():number {
            return this.width * this.height;
        }

        /**
         * Gets a value indicating if the size has no compnents assigned or initialized
         *
         * @returns {boolean}
         */
        public get isEmpty():boolean {
            return this.width === 0 || this.height === 0;
        }

        /**
         * Gets a value indicating if the size is horizontal
         *
         * @returns {boolean}
         */
        get isHorizontal(): boolean {
            return this.width > this.height;
        }

        /**
         * Gets a value indicating if the size is a square
         *
         * @returns {boolean}
         */
        get isSquare(): boolean {
            return this.width == this.height;
        }

        /**
         * Gets a value indicating if the size is vertical
         *
         * @returns {boolean}
         */
        get isVertical(): boolean {
            return this.height > this.width;
        }

        /**
         * Gets the height of the size
         */
        get height(): number {
            return this.getPropertyValue('height', Number, null);
        }

        /**
         * Gets the width of the size
         */
        get width(): number {
            return this.getPropertyValue('width', Number, null);
        }


        //endregion
    }

    /**
     * Reprsents a Rectangle
     **/
    export class Rectangle extends PropertyTarget{

        //region Static

        /**
         * Returns a rectangle at (0,0) of 0 dimensions
         * @returns {latte.Rectangle}
         */
        static get zero(): Rectangle{
            return new Rectangle();
        }

        /**
         * Creates a rectangle with the specified left, right, top and bottom.
         **/
        static fromLRTB(left: number, right: number, top: number, bottom: number): Rectangle{
            return  new Rectangle(left, top, right - left, bottom - top)
        }

        /**
         * Creates a rectangle from the specified object (top, left, width, height)
         * @param obj
         */
        static fromObject(obj: any): Rectangle{

            'left,top,width,height'.split(',').forEach(p => {
                if(!(p in obj)) {
                    throw "Missing " + p + " property"
                }
            });

            return new Rectangle(obj.left, obj.top, obj.width, obj.height);
        }

        /**
         * Creates a rectangle from the specified object (top, left, width, height)
         * @param obj
         */
        static fromObjectLRTB(obj: any): Rectangle{

            'left,right,top,bottom'.split(',').forEach(p => {
                if(!(p in obj)) {
                    throw "Missing " + p + " property"
                }
            });

            return Rectangle.fromLRTB(obj.left, obj.right, obj.top, obj.bottom);
        }

        /**
         * Creates a rectangle of the specified rectangle
         * @param {HTMLElement} e
         * @returns {latte.Rectangle}
         */
        static fromElement(e: HTMLElement): Rectangle{
            return Rectangle.fromObject(e.getBoundingClientRect());
        }

        //endregion

        /**
         * Creates a rectangle with the specified left, top, width and height.
         **/
        constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0){
            super();
            this.setPropertyValue('top', top, Number);
            this.setPropertyValue('left', left, Number);
            this.setPropertyValue('width', width, Number);
            this.setPropertyValue('height', height, Number);

        }

        //region Methods

        /**
         * Returns a rectangle of positive width and height, by changing its coordinates and preserving width and height
         */
        absolute(): Rectangle{
            let width = Math.abs(this.width);
            let height = Math.abs(this.height);
            let left = this.width < 0 ? this.right : this.left;
            let top = this.height < 0 ? this.bottom : this.top;
            return new Rectangle(left, top, width, height);
        }

        /**
         * Returns a rectangle with ceiling coordinates
         * @returns {latte.Rectangle}
         */
        ceil(): Rectangle{
            let r = Math.ceil;
            return new Rectangle(r(this.left), r(this.top), r(this.width), r(this.height));
        }

        /**
         * Returns the result of centering this into the specified container
         **/
        centerOn(container: Rectangle): Rectangle{
            return new Rectangle( container.left + (container.width - this.width) / 2,
                container.top + (container.height - this.height) / 2, this.width, this.height );
        }

        /**
         *
         * @returns {latte.Rectangle}
         */
        clone(): Rectangle{
            return new Rectangle(this.left, this.top, this.width, this.height);
        }

        /**
         * Gets a value indicating if the specified point is contained
         **/
        contains(x: number, y: number): boolean{

            return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;

        }

        /**
         * Returns a value indicating if the rectangle contains the specified point
         * @param {latte.Point} point
         * @returns {boolean}
         */
        containsPoint(point: Point){
            return this.contains(point.x, point.y);
        }

        /**
         * Gets a value indicating if the rectangle is contained inside this rectangle
         **/
        containsRectangle(rectangle: Rectangle): boolean{

            return this.contains( rectangle.left, rectangle.top) && this.contains( rectangle.right, rectangle.bottom);

        }

        /**
         * Compares this rectangle with the specified rectangle and returns the result
         * @param r
         * @returns {boolean}
         */
        equals(r: Rectangle): boolean{
            if(!r) return false;
            return this.left === r.left && this.top === this.top && this.width === r.width && this.height === r.height;
        }

        /**
         * Returns a rectangle with floor coordinates
         * @returns {latte.Rectangle}
         */
        floor(): Rectangle{
            let r = Math.floor;
            return new Rectangle(r(this.left), r(this.top), r(this.width), r(this.height));
        }

        /**
         * Returns the result of inflating the rectangle vertically and horizontally on each edge.
         **/
        inflate(horizontal: number, vertical: number): Rectangle{
            return Rectangle.fromLRTB(this.left - horizontal, this.right + horizontal,
                this.top - vertical, this.bottom + vertical);

        }

        /**
         * Returns the rectangle result of intersecting this with passed rectangle
         **/
        intersection(rectangle: Rectangle): Rectangle{

            let a = this;
            let b = rectangle;
            let x1: number = Math.max(a.left, b.left);
            let x2: number = Math.min(a.right, b.right);
            let y1: number = Math.max(a.top, b.top);
            let y2: number = Math.min(a.bottom, b.bottom);

            if(x2 >= x1 && y2 >= y1) {
                return new Rectangle(x1, y1, x2 - x1, y2 - y1);
            }

            return Rectangle.zero;

        }

        /**
         * Gets a value indicating if the rectangle intersects specified rectangle
         **/
        intersects(rectangle: Rectangle): boolean{
            let thisX = this.left;
            let thisY = this.top;
            let thisW = this.width;
            let thisH = this.height;
            let rectX = rectangle.left;
            let rectY = rectangle.top;
            let rectW = rectangle.width;
            let rectH = rectangle.height;
            return (rectX < thisX + thisW) && (thisX < (rectX + rectW)) && (rectY < thisY + thisH) && (thisY < rectY + rectH);
        }

        /**
         * Returns a new rectangle on specified location of same size
         * @param {latte.Point} location
         */
        ofLocation(location: Point){
            return new Rectangle(location.x, location.y, this.width, this.height);
        }

        /**
         * Returns a new rectangle with same location, specified size
         * @param {latte.Size} size
         * @returns {latte.Rectangle}
         */
        ofSize(size: Size): Rectangle{
            return new Rectangle(this.left, this.top, size.width, size.height);
        }

        /**
         * Returns a rectangle with rounded coordinates
         * @returns {latte.Rectangle}
         */
        round(): Rectangle{
            let r = Math.round;
            return new Rectangle(r(this.left), r(this.top), r(this.width), r(this.height));
        }

        /**
         * Returns a new rectangle that could fill the specified size
         * @param {latte.Size} size
         * @returns {latte.Rectangle}
         */
        scaleToFill(size: Size): Rectangle{
            return this.ofSize(this.size.scaleToFill(size));
        }

        /**
         * Scales the rectangle to fit the specified size.
         * @param {latte.Size} size
         * @returns {latte.Rectangle}
         */
        scaleToFit(size: Size): Rectangle{
            return this.ofSize(this.size.scaleToFit(size));

        }

        /**
         * Returns a scaled rectangle
         * @param width
         */
        scaleToHeight(height: number): Rectangle{
            return new Rectangle(this.left, this.top, height * this.width / this.height, height);
        }

        /**
         * Returns a scaled rectangle
         * @param width
         */
        scaleToWidth(width: number): Rectangle{
            return new Rectangle(this.left, this.top, width, width * this.height / this.width);
        }

        /**
         * Returns a string describing the rectangle
         **/
        toString(): string{
            return "Rectangle: " + [this.left, this.top, this.width, this.height].join(', ');

        }

        /**
         * Gets a rectangle representing the union of this rectangle and the passed one
         **/
        union(rectangle: Rectangle): Rectangle{

            return Rectangle.fromLRTB(
                Math.min(this.left, rectangle.left),
                Math.max(this.right, rectangle.right),
                Math.min(this.top, rectangle.top),
                Math.max(this.bottom, rectangle.bottom)
            );

        }

        //endregion

        //region Properties

        /**
         * Gets the area of the rectangle
         *
         * @returns {number}
         */
        get area(): number {
            return this.size.area;
        }

        /**
         * Gets the aspect ratio of the rectangle
         *
         * @returns {number}
         */
        get aspectRatio():number {
            return this.width / this.height;
        }

        /**
         * Gets or sets the right side of the rectangle
         **/
        get bottom(): number{
            return this.top + this.height;
        }

        /**
         * Gets or sets the center of the rectangle
         * @returns {latte.Point}
         */
        get center(): Point{
            return new Point(this.left + this.width / 2, this.top + this.height / 2);
        }

        /**
         * Gets the height of the rectangle
         */
        get height(): number {
            return this.getPropertyValue('height', Number, null);
        }

        /**
         * Gets a value indicating if the rectangle is empty
         *
         * @returns {boolean}
         */
        get isZero(): boolean {
            return this.size.isEmpty && this.location.isOrigin;
        }

        /**
         * Gets a value indicating if the rectangle is horizontal
         *
         * @returns {boolean}
         */
        get isHorizontal(): boolean {
            return this.width > this.height;
        }

        /**
         * Gets a value indicating if the rectangle is a square
         *
         * @returns {boolean}
         */
        get isSquare(): boolean {
            return this.width == this.height;
        }

        /**
         * Gets a value indicating if the rectangle is vertical
         *
         * @returns {boolean}
         */
        get isVertical(): boolean {
            return this.height > this.width;
        }

        /**
         * Gets the left of the rectangle
         */
        get left(): number {
            return this.getPropertyValue('left', Number, null);
        }

        /**
         * Gets the location of the rectangle
         *
         * @returns {Point}
         */
        get location(): Point {
            return new Point(this.left, this.top);
        }

        /**
         * Gets or sets the right side of the rectangle
         **/
        get right(): number{
            return this.left + this.width;
        }

        /**
         * Gets the size of the rectangle
         *
         * @returns {Size}
         */
        get size():Size {
            return new Size(this.width, this.height);
        }

        /**
         * Gets or sets the tag of the rectangle
         */
        get tag(): any {
            return this.getPropertyValue('tag', Any, null);
        }

        /**
         * Gets or sets the tag of the rectangle
         *
         * @param {any} value
         */
        set tag(value: any) {
            this.setPropertyValue('tag', value, Any);
        }

        /**
         * Gets the top of the rectangle
         */
        get top(): number {
            return this.getPropertyValue('top', Number, null);
        }

        /**
         * Gets the width of the rectangle
         */
        get width(): number {
            return this.getPropertyValue('width', Number, null);
        }

        //endregion

    }

}