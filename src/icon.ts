import {latte} from "./latte";
import {workspace} from "./workspace";
import {imageutil} from "./imageutil";


export namespace icon{

    import Color = latte.Color;
    import Rectangle = latte.Rectangle;
    import Illustrator = workspace.Illustrator;
    import CanvasTheme = workspace.CanvasTheme;
    import Canvas = workspace.Canvas;
    import Size = latte.Size;
    import log = latte.log;
    import Tool = workspace.Tool;
    import Mouse = workspace.Mouse;
    import Keyboard = workspace.Keyboard;
    import Point = latte.Point;
    import Plugin = workspace.Plugin;
    import Drag = workspace.Drag;
    import ImageFit = imageutil.ImageFit;
    import ImageStream = imageutil.ImageStream;
    import _zeroFill = latte._zeroFill;
    import PropertyTarget = latte.PropertyTarget;
    import DidSet = latte.DidSet;
    import Optional = latte.Optional;

    /**
     * Represents a pixel by extending color
     */
    export class Pixel extends Color{

        //region Methods

        /**
         * Changes the brightness according to the delta.
         * Delta should be between -128 and 128.
         * @param {number} delta
         */
        brightness(delta: number){
            let t = (n: number) => {
                if (n < 0) return 0;
                if (n > 255) return 255;
                return n;
            };
            this.r = t(this.r + delta);
            this.g = t(this.g + delta);
            this.b = t(this.b + delta);
        }

        /**
         * Changes the contrast of the pixel according to the delta.
         * Delta should be between -128 and 128.
         * @param {number} contrast
         */
        contrast(delta: number){
            /**
             factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
             colour = GetPixelColour(x, y)
             newRed   = Truncate(factor * (Red(colour)   - 128) + 128)
             newGreen = Truncate(factor * (Green(colour) - 128) + 128)
             newBlue  = Truncate(factor * (Blue(colour)  - 128) + 128)
             PutPixelColour(x, y) = RGB(newRed, newGreen, newBlue)
             */
            let t = (n: number) => {
                if (n < 0) return 0;
                if (n > 255) return 255;
                return Math.round(n);
            };
            let factor = (259 * (delta + 255)) / (255 * (259 - delta));

            this.r = t(factor * (this.r - 128) + 128);
            this.g = t(factor * (this.g - 128) + 128);
            this.b = t(factor * (this.b - 128) + 128);
        }

        /**
         * Gets distance between two colors
         * @param {latte.Color} color
         * @returns {number}
         */
        distanceTo(color: Color): number{
            let x0 = this.r;
            let x1 = color.r;
            let y0 = this.g;
            let y1 = color.g;
            let z0 = this.b;
            let z1 = color.b;
            return Math.sqrt(
                Math.pow(x1 - x0, 2) +
                Math.pow(y1 - y0, 2) +
                Math.pow(z1 - z0, 2)
            );
        }

        /**
         * Sets the color
         * @param {latte.Color} c
         */
        setColor(c: Color){
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;
            this.a = c.a;
        }

        /**
         * Gets the nearest color in the specified palette
         * @param {latte.Color[]} palette
         * @returns {latte.Color}
         */
        nearest(palette: Color[]){
            let min = Number.MAX_VALUE;
            let minIndex = -1;
            palette.forEach((c, i) => {
                let d = this.distanceTo(c);
                min = Math.min(min, d);
                if(min === d) {
                    minIndex = i;
                }
            });
            return palette[minIndex];
        }

        /**
         * Snaps the pixel to the specified palette
         * @param {latte.Color[]} palette
         */
        snapToPalette(palette: Color[]){
            /**
             * BIG to do
             * Look for color quantization techniques
             * @type {number}
             */
            let nearest = this.nearest(palette);
            this.r = nearest.r;
            this.g = nearest.g;
            this.b = nearest.b;
        }

        //endregion

    }

    /**
     * Represents an icon by a linear array of pixels
     */
    export class Icon extends PropertyTarget{

        //region Static

        static fromStream(s: ImageStream): Icon{
            let icon = new Icon(s.canvas.width, s.canvas.height);

            let x = s.canvas.getContext('2d');
            let data = x.getImageData(0, 0, s.canvas.width, s.canvas.height).data;
            let p = 0;

            for(let i = 0; i < data.length; i+=4){
                icon.pixels[p++] = new Pixel(
                    data[i],
                    data[i + 1],
                    data[i + 2],
                    data[i + 3]
                );
            }

            return icon;
        }

        static legoPalette(): Color[]{
            let pal = [
                Color.white,
                Color.red,
                Color.blue,
                Color.fromHex('ff0'),
                Color.black,
                Color.fromHex('2bc114'), //green
                Color.fromHex('d9c285'), //sand
                Color.fromHex('1b3c71'), //navy
                Color.fromHex('555'),
                Color.fromHex('bbb'),
                Color.fromHex('51311a'), //brown
                Color.fromHex('fd9330'), //orange
                Color.combine(Color.fromHex('ccc'), Color.red),
                Color.combine(Color.fromHex('ccc'), Color.blue),
                Color.combine(Color.fromHex('ccc'), Color.fromHex('ff0')),
                Color.combine(Color.fromHex('ccc'), Color.fromHex('2bc114')),
                Color.combine(Color.fromHex('ccc'), Color.fromHex('fd9330')),
            ];
            log(pal.map(c => c.toHexString()));
            return pal;
        }

        static legoPalette_TooLarge(): Color[]{
            return [
                new Color(217, 187, 123),
                new Color(214, 114, 64),
                new Color(255, 0, 0),
                new Color(0, 0, 255),
                new Color(255, 255, 0),
                new Color(0, 0, 0),
                new Color(0, 153, 0),
                new Color(0, 204, 0),
                new Color(168, 61, 21),
                new Color(71, 140, 198),
                new Color(255, 102, 0),
                new Color(5, 157, 158),
                new Color(149, 185, 11),
                new Color(153, 0, 102),
                new Color(94, 116, 140),
                new Color(141, 116, 82),
                new Color(0, 37, 65),
                new Color(0, 51, 0),
                new Color(95, 130, 101),
                new Color(128, 8, 27),
                new Color(244, 155, 0),
                new Color(91, 28, 12),
                new Color(156, 146, 145),
                new Color(76, 81, 86),
                new Color(228, 228, 218),
                new Color(135, 192, 234),
                new Color(222, 55, 139),
                new Color(238, 157, 195),
                new Color(255, 255, 153),
                new Color(44, 21, 119),
                new Color(245, 193, 137),
                new Color(48, 15, 6),
                new Color(170, 125, 85),
                new Color(70, 155, 195),
                new Color(104, 195, 226),
                new Color(211, 242, 234),
                new Color(160, 110, 185),
                new Color(205, 164, 222),
                new Color(245, 243, 215),
                new Color(226, 249, 154),
                new Color(119, 119, 78),
                new Color(150, 185, 59),
            ]
        }

        //endregion

        /**
         * Creates the icon
         * @param {number} width
         * @param {number} height
         */
        constructor(width: number, height: number){
            super();
            this.setPropertyValues({
                width: width,
                height: height
            });

        }

        //region Private Methods
        colorStatistics(p: Color[]): {[color: string]: number}{

            let zero = (color: Color):string => {
                return _zeroFill(3, color.r) + _zeroFill(3, color.g) + _zeroFill(3, color.b)
            };
            let pal = p.map(c => zero(c));
            let result: {[color: string]: number} = {};


            this.pixels.forEach(p => {
                let code = zero(p);
                let count = (code in result) ? result[code] : 0;
                // if(pal.filter( cc => cc == code).length == 0){
                //     log(`code ${code} not found`);
                // }
                result[code] = count + 1;
            });

            let colors = 0;
            for(let code in result) colors++;
            log(`colors: ${colors}`);

            return result;

        }
        //endregion

        //region Methods

        /**
         * Sets the contrast
         * @param {number} delta
         */
        bright(delta: number){
            this.pixels.forEach(p => p.brightness(delta));
        }

        /**
         * Sets the contrast
         * @param {number} delta
         */
        contrast(delta: number){
            this.pixels.forEach(p => p.contrast(delta));
        }

        /**
         * Clones the icon
         * @returns {icon.Icon}
         */
        clone(): Icon{
            let icon = new Icon(this.width, this.height);
            this.pixels.forEach(p => icon.pixels.push(new Pixel(p.r, p.g, p.b)));
            return icon;
        }

        /**
         * Gets a pixel by its coordinates. 0,0 is top left corner.
         * @param {number} x
         * @param {number} y
         * @returns {icon.Pixel}
         */
        getPixel(x: number, y: number): Pixel{
            return this.pixels[y * this.width + x];
        }

        getPixelTuples(): number[][]{
            return this.pixels.map(p => [p.r, p.g, p.b]);
        }

        /**
         * This should be in another software layer
         */
        stickToPalette(pal: Color[]){

            let a32 = this.dither(pal);
            this.importUint32Array(a32);
            //this.snapToPalette(pal || this.getPaletteColors());
            // log(this.colorStatistics());
            //this.colorQuant();
        }

        /**
         * Sets the pixel by its coordinates. 0,0 is top left corner.
         * @param {number} x
         * @param {number} y
         * @param {icon.Pixel} p
         */
        setPixel(x: number, y: number, p: Pixel){
            this.pixels[y * this.height + x] = p;
        }

        snapToPalette(palette: Color[]){
            // this.colorQuant()
            // log(this.colorStatistics());
            // check http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/
            this.pixels.forEach(p => p.snapToPalette(palette));
        }

        importUint8Array(a: Uint8Array){
            let count = 0;
            for(let i = 0; i < a.length; i+=4){
                this.pixels[count].r = a[i];
                this.pixels[count].g = a[i + 1];
                this.pixels[count].b = a[i + 2];
                this.pixels[count].a = a[i + 3];
                count++;
            }
        }

        importUint32Array(a: Uint32Array){
            /*
            *  let r = i32 & 0xff;
                let g = (i32 & 0xff00) >> 8;
                let b = (i32 & 0xff0000) >> 16;*/
            for(let i = 0; i < a.length; i+=1){
                let n = a[i];
                this.pixels[i].r = n & 0xff;
                this.pixels[i].g = (n & 0xff00) >> 8;
                this.pixels[i].b = (n & 0xff0000) >> 16;
            }
        }

        toUint8Array(): Uint8Array{
            let a = new Uint8Array(this.pixels.length * 4);

            this.pixels.forEach((p, i) => {
                a[i*4] = p.r;
                a[i*4+1] = p.g;
                a[i*4+2] = p.b;
                a[i*4+3] = p.a;
            } );

            return a;

        }

        toUint32Array(): Uint32Array{
            let a = new Uint32Array(this.pixels.length);

            this.pixels.forEach((p, i) => {
                a[i] = (255 << 24)	|	// alpha
                    (p.b  << 16)	|	// blue
                    (p.g  <<  8)	|	// green
                     p.r;			    // red
            });

            return a;

        }

        /**
         * Dithers the Icon to the specified palette
         * @param {latte.Color[]} pal
         * @param {string} kernel
         * @param {boolean} serpentine
         * @returns {Uint32Array}
         */
        dither(pal: Color[] = null, kernel: string = 'FloydSteinberg', serpentine:boolean = true): Uint32Array {
            // http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/
            let kernels: {[name:string]:number[][]} = {
                FloydSteinberg: [
                    [7 / 16, 1, 0],
                    [3 / 16, -1, 1],
                    [5 / 16, 0, 1],
                    [1 / 16, 1, 1]
                ],
                FalseFloydSteinberg: [
                    [3 / 8, 1, 0],
                    [3 / 8, 0, 1],
                    [2 / 8, 1, 1]
                ],
                Stucki: [
                    [8 / 42, 1, 0],
                    [4 / 42, 2, 0],
                    [2 / 42, -2, 1],
                    [4 / 42, -1, 1],
                    [8 / 42, 0, 1],
                    [4 / 42, 1, 1],
                    [2 / 42, 2, 1],
                    [1 / 42, -2, 2],
                    [2 / 42, -1, 2],
                    [4 / 42, 0, 2],
                    [2 / 42, 1, 2],
                    [1 / 42, 2, 2]
                ],
                Atkinson: [
                    [1 / 8, 1, 0],
                    [1 / 8, 2, 0],
                    [1 / 8, -1, 1],
                    [1 / 8, 0, 1],
                    [1 / 8, 1, 1],
                    [1 / 8, 0, 2]
                ],
                Jarvis: [			// Jarvis, Judice, and Ninke / JJN?
                    [7 / 48, 1, 0],
                    [5 / 48, 2, 0],
                    [3 / 48, -2, 1],
                    [5 / 48, -1, 1],
                    [7 / 48, 0, 1],
                    [5 / 48, 1, 1],
                    [3 / 48, 2, 1],
                    [1 / 48, -2, 2],
                    [3 / 48, -1, 2],
                    [5 / 48, 0, 2],
                    [3 / 48, 1, 2],
                    [1 / 48, 2, 2]
                ],
                Burkes: [
                    [8 / 32, 1, 0],
                    [4 / 32, 2, 0],
                    [2 / 32, -2, 1],
                    [4 / 32, -1, 1],
                    [8 / 32, 0, 1],
                    [4 / 32, 1, 1],
                    [2 / 32, 2, 1],
                ],
                Sierra: [
                    [5 / 32, 1, 0],
                    [3 / 32, 2, 0],
                    [2 / 32, -2, 1],
                    [4 / 32, -1, 1],
                    [5 / 32, 0, 1],
                    [4 / 32, 1, 1],
                    [2 / 32, 2, 1],
                    [2 / 32, -1, 2],
                    [3 / 32, 0, 2],
                    [2 / 32, 1, 2],
                ],
                TwoSierra: [
                    [4 / 16, 1, 0],
                    [3 / 16, 2, 0],
                    [1 / 16, -2, 1],
                    [2 / 16, -1, 1],
                    [3 / 16, 0, 1],
                    [2 / 16, 1, 1],
                    [1 / 16, 2, 1],
                ],
                SierraLite: [
                    [2 / 4, 1, 0],
                    [1 / 4, -1, 1],
                    [1 / 4, 0, 1],
                ],
            };

            if (!kernel || !kernels[kernel]) {
                throw 'Unknown dithering kernel: ' + kernel;
            }

            let legoPal = pal;

            let nearest = (i32: number): number => {
                let r = i32 & 0xff;
                let g = (i32 & 0xff00) >> 8;
                let b = (i32 & 0xff0000) >> 16;
                let nearest = (new Pixel(r, g, b)).nearest(legoPal);
                return (255 << 24)	|	// alpha
                    (nearest.b  << 16)	|	// blue
                    (nearest.g  <<  8)	|	// green
                    nearest.r;			// red
            };

            var ds: number[][] = kernels[kernel];

            var buf32 = this.toUint32Array(),
                width = this.width,
                height = this.height;
            let len = buf32.length;

            var dir = serpentine ? -1 : 1;

            for (var y = 0; y < height; y++) {
                if (serpentine)
                    dir = dir * -1;

                var lni = y * width;

                for (var x = (dir == 1 ? 0 : width - 1), xend = (dir == 1 ? width : 0); x !== xend; x += dir) {
                    // Image pixel
                    var idx = lni + x,
                        i32 = buf32[idx],
                        r1 = (i32 & 0xff),
                        g1 = (i32 & 0xff00) >> 8,
                        b1 = (i32 & 0xff0000) >> 16;

                    // Reduced pixel
                    // var i32x = this.nearestColor(i32),
                    var i32x = nearest(i32),
                        r2 = (i32x & 0xff),
                        g2 = (i32x & 0xff00) >> 8,
                        b2 = (i32x & 0xff0000) >> 16;

                    buf32[idx] =
                        (255 << 24)	|	// alpha
                        (b2  << 16)	|	// blue
                        (g2  <<  8)	|	// green
                        r2;

                    // dithering strength
                    // if (this.dithDelta) {
                    //     var dist = this.colorDist([r1, g1, b1], [r2, g2, b2]);
                    //     if (dist < this.dithDelta)
                    //         continue;
                    // }

                    // Component distance
                    var er = r1 - r2,
                        eg = g1 - g2,
                        eb = b1 - b2;

                    for (var i = (dir == 1 ? 0 : ds.length - 1), end = (dir == 1 ? ds.length : 0); i !== end; i += dir) {
                        var x1 = ds[i][1] * dir,
                            y1 = ds[i][2];

                        var lni2 = y1 * width;

                        if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
                            var d = ds[i][0];
                            var idx2 = idx + (lni2 + x1);

                            var r3 = (buf32[idx2] & 0xff),
                                g3 = (buf32[idx2] & 0xff00) >> 8,
                                b3 = (buf32[idx2] & 0xff0000) >> 16;

                            var r4 = Math.max(0, Math.min(255, r3 + er * d)),
                                g4 = Math.max(0, Math.min(255, g3 + eg * d)),
                                b4 = Math.max(0, Math.min(255, b3 + eb * d));

                            buf32[idx2] =
                                (255 << 24)	|	// alpha
                                (b4  << 16)	|	// blue
                                (g4  <<  8)	|	// green
                                r4;			// red
                        }
                    }
                }
            }

            return buf32;
        }

        //endregion

        //region Properties

        /**
         * Gets the height of the icon
         */
        get height(): number {
            return this.getPropertyValue('height', Number, 0);
        }

        /**
         * Gets the unidimensional array of pixels
         */
        get pixels(): Pixel[] {
            return this.getPropertyValue('pixels', Array, []);
        }

        /**
         * Gets the size of the icon
         *
         * @returns {Size}
         */
        get size(): Size {
            return new Size(this.width, this.height);
        }

        /**
         * Gets the width of the icon
         */
        get width(): number {
            return this.getPropertyValue('width', Array,0);
        }

        //endregion

    }

    /**
     * Provides information about the projection of an icon to a canvas
     */
    class IconProjection extends PropertyTarget{

        /**
         * Creates the projection
         * @param {icon.Icon} icon
         * @param {workspace.Canvas<workspace.IconDrawable>} canvas
         */
        constructor(icon: Icon, canvas: Canvas){
            super();
            this.icon = icon;
            this.canvas = canvas;
        }

        //region Private Methods

        //endregion

        //region Methods

        /**
         * Gets the rectangle of the pixel
         */
        getPixelRect(x: number, y: number): Rectangle{
            return new Rectangle(
                this.iconRectangle.left + x * this.pixelSize.width,
                this.iconRectangle.top + y * this.pixelSize.height,
                this.pixelSize.width, this.pixelSize.height
            ).ceil();
        }

        /**
         * Gets the pixel at the specified point of the canvas. Null if none.
         * @param {number} x
         * @param {number} y
         * @returns {latte.Point}
         */
        getPixelAt(x: number, y: number): Point{

            if(!this.iconRectangle.contains(x, y)){
                return null;
            }

            return new Point(Math.floor((x - this.iconRectangle.left) / this.pixelSize.width),
                Math.floor((y - this.iconRectangle.top) / this.pixelSize.height));

        }

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'icon' || e.property == 'canvas'){
                this.update();
            }

        }

        /**
         * Updates the projection calculations
         */
        update(){

            let canvas = this.canvas;
            let icon = this.icon;

            if(!this.icon || !this.canvas){
                this.setPropertyValues({
                    canvasRectangle: Rectangle.zero,
                    iconRectangle:   Rectangle.zero,
                    pixelSize:       Size.empty
                });

            }else{
                this.setPropertyValue('canvasRectangle', new Rectangle(0, 0, canvas.width, canvas.height), Rectangle);

                this.setPropertyValue('iconRectangle', new Rectangle(0, 0, icon.width, icon.height)
                    .scaleToFit(this.canvasRectangle.size)
                    .centerOn(this.canvasRectangle), Rectangle);

                this.setPropertyValue('pixelSize', new Size(this.iconRectangle.width / icon.width,
                    this.iconRectangle.height / icon.height), Size);

            }

        }

        //endregion

        //region Projection Properties

        /**
         * Gets the canvas rectangle
         */
        get canvasRectangle(): Rectangle {
            return this.getPropertyValue('canvasRectangle', Rectangle, Rectangle.zero);
        }

        /**
         * Gets the rectangle of the icon on the canvas
         */
        get iconRectangle(): Rectangle {
            return this.getPropertyValue('iconRectangle', Rectangle, Rectangle.zero);
        }

        /**
         * Gets the size of the pixel in the canvas
         */
        get pixelSize(): Size {
            return this.getPropertyValue('pixelSize', Size, Size.empty);
        }

        //endregion

        //region Properties

        /**
         * Gets or sets the canvas of the projection
         */
        get canvas(): Canvas {
            return this.getPropertyValue('canvas', Canvas,null);
        }

        /**
         * Gets or sets the canvas of the projection
         *
         * @param {Canvas} value
         */
        set canvas(value: Canvas) {
            this.setPropertyValue('canvas', value, Canvas);
        }

        /**
         * Gets or sets the icon of the projection
         */
        get icon(): Icon {
            return this.getPropertyValue('icon', Icon,null);
        }

        /**
         * Gets or sets the icon of the projection
         *
         * @param {Icon} value
         */
        set icon(value: Icon) {
            this.setPropertyValue('icon', value, Icon);
        }

        //endregion

    }

    /**
     * Icon specific illustrator
     */
    export class IconIllustrator extends Illustrator{

        //region Static


        //endregion

        constructor(icon: Icon){
            super();
            this.icon = icon;
            this.tool = new DrawTool();
            this.plugins.push(new ImportFileTool(this));
        }

        //region Private
        private checkForProjection(){

            if(!this.projection.isPresent && this.canvas && this.icon) {
                this.setPropertyValue('projection',
                    Optional.of(
                        new IconProjection(this.icon, this.canvas)),
                    Optional);
            }

        }
        //endregion

        //region Methods

        /**
         * Implementation
         * @param {workspace.Canvas<workspace.IconDrawable>} canvas
         */
        draw(){

            this.projection.ifPresent(p => p.update());

            // Adjust this threshold for grid tolerance
            let gridThreshold = 10;

            this.drawIcon();

            this.projection.ifPresent(p => {
                if(p.pixelSize.width >= gridThreshold) {
                    // this.drawGrid();
                }
            });

        }

        /**
         * Draws the grid
         * @param {latte.Rectangle} iconRect
         * @param {latte.Size} pixelSize
         */
        drawGrid(){

            this.projection.ifPresent(projection => {
                let iconRect = projection.iconRectangle;
                let pixelSize = projection.pixelSize;

                let context = this.canvas.context;

                context.strokeStyle = CanvasTheme.gridColor.toHexString();

                let drawRow = (row: number) =>{
                    let y = iconRect.top + row * pixelSize.height;
                    this.drawLine(iconRect.left, y, iconRect.right, y);
                };

                let drawCol = (col: number) =>{
                    let x = iconRect.left + col * pixelSize.width;
                    this.drawLine(x, iconRect.top, x, iconRect.bottom);
                };

                for(let row = 0; row <= this.icon.height; row++) drawRow(row);
                for(let col = 0; col <= this.icon.width ; col++) drawCol(col);
            });



        }

        /**
         *
         * @param {latte.Rectangle} iconRect
         * @param {latte.Size} pixelSize
         */
        drawIcon(){
            for(let y = 0; y < this.icon.height; y++){
                for(let x = 0; x < this.icon.width; x++){

                    let px = this.icon.getPixel(x, y);

                    if(px && this.projection.isPresent) {
                        this.drawRectangle(this.projection.orThrow().getPixelRect(x, y), px);
                    }

                }
            }
        }

        /**
         * Draws a line
         * @param {number} x1
         * @param {number} y1
         * @param {number} x2
         * @param {number} y2
         */
        drawLine(x1: number, y1: number, x2: number, y2: number){
            this.canvas.context.beginPath();
            this.canvas.context.moveTo(x1, y1);
            this.canvas.context.lineTo(x2, y2);
            this.canvas.context.stroke();
        }

        /**
         * Draws a rectangle
         * @param {latte.Rectangle} r
         */
        drawRectangle(r: Rectangle, color: Color){
            this.canvas.context.fillStyle = color.toHexString();
            this.canvas.context.fillRect(r.left, r.top, r.width, r.height);
        }

        /**
         * Change Handler
         * @param {latte.ChangedEvent} e
         */
        didSet(e: DidSet){
            super.didSet(e);

            if (e.property == 'original'){
                if(this.original) {
                    this.original.resize({
                        size: this.icon.size,
                        fit: ImageFit.AspectFill
                    }, stream => {

                        // Create new icon
                        this.icon = Icon.fromStream(stream);
                        this.saveBase();

                        this.raise('originalProcessed')

                    });
                }
            }else if(e.property == 'icon') {

                if(this.icon) {
                    if(!this.base) this.saveBase();
                }

                this.projection.ifPresent( p => p.icon = this.icon);
                this.checkForProjection();

            }else if(e.property == 'canvas') {

                this.projection.ifPresent(p => p.canvas = this.canvas);
                this.checkForProjection();
            }

        }

        /**
         * Sets the current icon as the base for certain operations, like brightness, contrast, etc
         */
        saveBase(icon: Icon = null){
            this.setPropertyValue('base', icon || this.icon.clone(), Icon);
        }

        //endregion

        //region Properties

        /**
         * Gets the base icon
         */
        get base(): Icon {
            return this.getPropertyValue('base', Icon, null);
        }

        /**
         * Gets or sets the icon of the illustrator
         */
        get icon(): Icon {
            return this.getPropertyValue('icon', Icon, null);
        }

        /**
         * Gets or sets the icon of the illustrator
         *
         * @param {Icon} value
         */
        set icon(value: Icon) {
            this.setPropertyValue('icon', value, Icon);
        }

        /**
         * Gets or sets the original image of the icon
         */
        get original(): ImageStream {
            return this.getPropertyValue('original', ImageStream, null);
        }

        /**
         * Gets or sets the original image of the icon
         *
         * @param {ImageStream} value
         */
        set original(value: ImageStream) {
            this.setPropertyValue('original', value, ImageStream);
        }

        /**
         * Gets the projection of the icon
         */
        get projection(): Optional<IconProjection> {
            return this.getPropertyValue('projection', Optional, Optional.empty());
        }

        //endregion

    }

    /**
     * Draws stuff
     */
    export class DrawTool extends Tool<IconIllustrator>{

        down: boolean = false;

        /**
         * Recieves mouse events
         * @param {workspace.Mouse} mouse
         * @param {MouseEvent} e
         */
        onMouseEvent(mouse: Mouse, e: MouseEvent){
            super.onMouseEvent(mouse, e);

            if(mouse == Mouse.DOWN) {
                this.down = true;

            }else if(mouse == Mouse.UP) {
                this.down = false;

            }else if(mouse == Mouse.MOVE) {

                let p:Point = null;

                this.illustrator.projection.ifPresent(projection =>
                    p = projection.getPixelAt(e.offsetX, e.offsetY));

                if(this.down && p) {
                    this.illustrator.icon.getPixel(p.x, p.y).setColor(Color.red);
                }

            }

        }

        /**
         * Recieves
         *
         * @param {workspace.Keyboard} key
         * @param {KeyboardEvent} e
         */
        onKeyboardEvent(key: Keyboard, e: KeyboardEvent){
            super.onKeyboardEvent(key, e);
        }

    }

    /**
     * Imports a file
     */
    export class ImportFileTool extends Plugin<IconIllustrator>{

        onDragEvent(drag: Drag, e: DragEvent){
            super.onDragEvent(drag, e);

            e.preventDefault();

            if(drag == Drag.DROP) {

                e.preventDefault();

                if(e.dataTransfer && e.dataTransfer.files.length > 0) {

                    let file = e.dataTransfer.files[0];

                    // Resize File
                    ImageStream.fromFile(file, stream => {

                        this.illustrator.original = stream;

                    });

                }else{
                    throw "no good drop";

                }

            }

        }

    }

}