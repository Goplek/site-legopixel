var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./latte", "./workspace", "./imageutil"], function (require, exports, latte_1, workspace_1, imageutil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var icon;
    (function (icon_1) {
        var Color = latte_1.latte.Color;
        var Rectangle = latte_1.latte.Rectangle;
        var Illustrator = workspace_1.workspace.Illustrator;
        var CanvasTheme = workspace_1.workspace.CanvasTheme;
        var Canvas = workspace_1.workspace.Canvas;
        var Size = latte_1.latte.Size;
        var log = latte_1.latte.log;
        var Tool = workspace_1.workspace.Tool;
        var Mouse = workspace_1.workspace.Mouse;
        var Point = latte_1.latte.Point;
        var Plugin = workspace_1.workspace.Plugin;
        var Drag = workspace_1.workspace.Drag;
        var ImageFit = imageutil_1.imageutil.ImageFit;
        var ImageStream = imageutil_1.imageutil.ImageStream;
        var _zeroFill = latte_1.latte._zeroFill;
        var PropertyTarget = latte_1.latte.PropertyTarget;
        var Optional = latte_1.latte.Optional;
        var Pixel = (function (_super) {
            __extends(Pixel, _super);
            function Pixel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Pixel.prototype.brightness = function (delta) {
                var t = function (n) {
                    if (n < 0)
                        return 0;
                    if (n > 255)
                        return 255;
                    return n;
                };
                this.r = t(this.r + delta);
                this.g = t(this.g + delta);
                this.b = t(this.b + delta);
            };
            Pixel.prototype.contrast = function (delta) {
                var t = function (n) {
                    if (n < 0)
                        return 0;
                    if (n > 255)
                        return 255;
                    return Math.round(n);
                };
                var factor = (259 * (delta + 255)) / (255 * (259 - delta));
                this.r = t(factor * (this.r - 128) + 128);
                this.g = t(factor * (this.g - 128) + 128);
                this.b = t(factor * (this.b - 128) + 128);
            };
            Pixel.prototype.distanceTo = function (color) {
                var x0 = this.r;
                var x1 = color.r;
                var y0 = this.g;
                var y1 = color.g;
                var z0 = this.b;
                var z1 = color.b;
                return Math.sqrt(Math.pow(x1 - x0, 2) +
                    Math.pow(y1 - y0, 2) +
                    Math.pow(z1 - z0, 2));
            };
            Pixel.prototype.setColor = function (c) {
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;
                this.a = c.a;
            };
            Pixel.prototype.nearest = function (palette) {
                var _this = this;
                var min = Number.MAX_VALUE;
                var minIndex = -1;
                palette.forEach(function (c, i) {
                    var d = _this.distanceTo(c);
                    min = Math.min(min, d);
                    if (min === d) {
                        minIndex = i;
                    }
                });
                return palette[minIndex];
            };
            Pixel.prototype.snapToPalette = function (palette) {
                var nearest = this.nearest(palette);
                this.r = nearest.r;
                this.g = nearest.g;
                this.b = nearest.b;
            };
            return Pixel;
        }(Color));
        icon_1.Pixel = Pixel;
        var Icon = (function (_super) {
            __extends(Icon, _super);
            function Icon(width, height) {
                var _this = _super.call(this) || this;
                _this.setPropertyValues({
                    width: width,
                    height: height
                });
                return _this;
            }
            Icon.fromStream = function (s) {
                var icon = new Icon(s.canvas.width, s.canvas.height);
                var x = s.canvas.getContext('2d');
                var data = x.getImageData(0, 0, s.canvas.width, s.canvas.height).data;
                var p = 0;
                for (var i = 0; i < data.length; i += 4) {
                    icon.pixels[p++] = new Pixel(data[i], data[i + 1], data[i + 2], data[i + 3]);
                }
                return icon;
            };
            Icon.legoPalette = function () {
                var pal = [
                    Color.white,
                    Color.red,
                    Color.blue,
                    Color.fromHex('ff0'),
                    Color.black,
                    Color.fromHex('2bc114'),
                    Color.fromHex('d9c285'),
                    Color.fromHex('1b3c71'),
                    Color.fromHex('555'),
                    Color.fromHex('bbb'),
                    Color.fromHex('51311a'),
                    Color.fromHex('fd9330'),
                    Color.combine(Color.fromHex('ccc'), Color.red),
                    Color.combine(Color.fromHex('ccc'), Color.blue),
                    Color.combine(Color.fromHex('ccc'), Color.fromHex('ff0')),
                    Color.combine(Color.fromHex('ccc'), Color.fromHex('2bc114')),
                    Color.combine(Color.fromHex('ccc'), Color.fromHex('fd9330')),
                ];
                log(pal.map(function (c) { return c.toHexString(); }));
                return pal;
            };
            Icon.legoPalette_TooLarge = function () {
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
                ];
            };
            Icon.prototype.colorStatistics = function (p) {
                var zero = function (color) {
                    return _zeroFill(3, color.r) + _zeroFill(3, color.g) + _zeroFill(3, color.b);
                };
                var pal = p.map(function (c) { return zero(c); });
                var result = {};
                this.pixels.forEach(function (p) {
                    var code = zero(p);
                    var count = (code in result) ? result[code] : 0;
                    result[code] = count + 1;
                });
                var colors = 0;
                for (var code in result)
                    colors++;
                log("colors: " + colors);
                return result;
            };
            Icon.prototype.bright = function (delta) {
                this.pixels.forEach(function (p) { return p.brightness(delta); });
            };
            Icon.prototype.contrast = function (delta) {
                this.pixels.forEach(function (p) { return p.contrast(delta); });
            };
            Icon.prototype.clone = function () {
                var icon = new Icon(this.width, this.height);
                this.pixels.forEach(function (p) { return icon.pixels.push(new Pixel(p.r, p.g, p.b)); });
                return icon;
            };
            Icon.prototype.getPixel = function (x, y) {
                return this.pixels[y * this.width + x];
            };
            Icon.prototype.getPixelTuples = function () {
                return this.pixels.map(function (p) { return [p.r, p.g, p.b]; });
            };
            Icon.prototype.stickToPalette = function (pal) {
                var a32 = this.dither(pal);
                this.importUint32Array(a32);
            };
            Icon.prototype.setPixel = function (x, y, p) {
                this.pixels[y * this.height + x] = p;
            };
            Icon.prototype.snapToPalette = function (palette) {
                this.pixels.forEach(function (p) { return p.snapToPalette(palette); });
            };
            Icon.prototype.importUint8Array = function (a) {
                var count = 0;
                for (var i = 0; i < a.length; i += 4) {
                    this.pixels[count].r = a[i];
                    this.pixels[count].g = a[i + 1];
                    this.pixels[count].b = a[i + 2];
                    this.pixels[count].a = a[i + 3];
                    count++;
                }
            };
            Icon.prototype.importUint32Array = function (a) {
                for (var i = 0; i < a.length; i += 1) {
                    var n = a[i];
                    this.pixels[i].r = n & 0xff;
                    this.pixels[i].g = (n & 0xff00) >> 8;
                    this.pixels[i].b = (n & 0xff0000) >> 16;
                }
            };
            Icon.prototype.toUint8Array = function () {
                var a = new Uint8Array(this.pixels.length * 4);
                this.pixels.forEach(function (p, i) {
                    a[i * 4] = p.r;
                    a[i * 4 + 1] = p.g;
                    a[i * 4 + 2] = p.b;
                    a[i * 4 + 3] = p.a;
                });
                return a;
            };
            Icon.prototype.toUint32Array = function () {
                var a = new Uint32Array(this.pixels.length);
                this.pixels.forEach(function (p, i) {
                    a[i] = (255 << 24) |
                        (p.b << 16) |
                        (p.g << 8) |
                        p.r;
                });
                return a;
            };
            Icon.prototype.dither = function (pal, kernel, serpentine) {
                if (pal === void 0) { pal = null; }
                if (kernel === void 0) { kernel = 'FloydSteinberg'; }
                if (serpentine === void 0) { serpentine = true; }
                var kernels = {
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
                    Jarvis: [
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
                var legoPal = pal;
                var nearest = function (i32) {
                    var r = i32 & 0xff;
                    var g = (i32 & 0xff00) >> 8;
                    var b = (i32 & 0xff0000) >> 16;
                    var nearest = (new Pixel(r, g, b)).nearest(legoPal);
                    return (255 << 24) |
                        (nearest.b << 16) |
                        (nearest.g << 8) |
                        nearest.r;
                };
                var ds = kernels[kernel];
                var buf32 = this.toUint32Array(), width = this.width, height = this.height;
                var len = buf32.length;
                var dir = serpentine ? -1 : 1;
                for (var y = 0; y < height; y++) {
                    if (serpentine)
                        dir = dir * -1;
                    var lni = y * width;
                    for (var x = (dir == 1 ? 0 : width - 1), xend = (dir == 1 ? width : 0); x !== xend; x += dir) {
                        var idx = lni + x, i32 = buf32[idx], r1 = (i32 & 0xff), g1 = (i32 & 0xff00) >> 8, b1 = (i32 & 0xff0000) >> 16;
                        var i32x = nearest(i32), r2 = (i32x & 0xff), g2 = (i32x & 0xff00) >> 8, b2 = (i32x & 0xff0000) >> 16;
                        buf32[idx] =
                            (255 << 24) |
                                (b2 << 16) |
                                (g2 << 8) |
                                r2;
                        var er = r1 - r2, eg = g1 - g2, eb = b1 - b2;
                        for (var i = (dir == 1 ? 0 : ds.length - 1), end = (dir == 1 ? ds.length : 0); i !== end; i += dir) {
                            var x1 = ds[i][1] * dir, y1 = ds[i][2];
                            var lni2 = y1 * width;
                            if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
                                var d = ds[i][0];
                                var idx2 = idx + (lni2 + x1);
                                var r3 = (buf32[idx2] & 0xff), g3 = (buf32[idx2] & 0xff00) >> 8, b3 = (buf32[idx2] & 0xff0000) >> 16;
                                var r4 = Math.max(0, Math.min(255, r3 + er * d)), g4 = Math.max(0, Math.min(255, g3 + eg * d)), b4 = Math.max(0, Math.min(255, b3 + eb * d));
                                buf32[idx2] =
                                    (255 << 24) |
                                        (b4 << 16) |
                                        (g4 << 8) |
                                        r4;
                            }
                        }
                    }
                }
                return buf32;
            };
            Object.defineProperty(Icon.prototype, "height", {
                get: function () {
                    return this.getPropertyValue('height', Number, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Icon.prototype, "pixels", {
                get: function () {
                    return this.getPropertyValue('pixels', Array, []);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Icon.prototype, "size", {
                get: function () {
                    return new Size(this.width, this.height);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Icon.prototype, "width", {
                get: function () {
                    return this.getPropertyValue('width', Array, 0);
                },
                enumerable: true,
                configurable: true
            });
            return Icon;
        }(PropertyTarget));
        icon_1.Icon = Icon;
        var IconProjection = (function (_super) {
            __extends(IconProjection, _super);
            function IconProjection(icon, canvas) {
                var _this = _super.call(this) || this;
                _this.icon = icon;
                _this.canvas = canvas;
                return _this;
            }
            IconProjection.prototype.getPixelRect = function (x, y) {
                return new Rectangle(this.iconRectangle.left + x * this.pixelSize.width, this.iconRectangle.top + y * this.pixelSize.height, this.pixelSize.width, this.pixelSize.height).ceil();
            };
            IconProjection.prototype.getPixelAt = function (x, y) {
                if (!this.iconRectangle.contains(x, y)) {
                    return null;
                }
                return new Point(Math.floor((x - this.iconRectangle.left) / this.pixelSize.width), Math.floor((y - this.iconRectangle.top) / this.pixelSize.height));
            };
            IconProjection.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'icon' || e.property == 'canvas') {
                    this.update();
                }
            };
            IconProjection.prototype.update = function () {
                var canvas = this.canvas;
                var icon = this.icon;
                if (!this.icon || !this.canvas) {
                    this.setPropertyValues({
                        canvasRectangle: Rectangle.zero,
                        iconRectangle: Rectangle.zero,
                        pixelSize: Size.empty
                    });
                }
                else {
                    this.setPropertyValue('canvasRectangle', new Rectangle(0, 0, canvas.width, canvas.height), Rectangle);
                    this.setPropertyValue('iconRectangle', new Rectangle(0, 0, icon.width, icon.height)
                        .scaleToFit(this.canvasRectangle.size)
                        .centerOn(this.canvasRectangle), Rectangle);
                    this.setPropertyValue('pixelSize', new Size(this.iconRectangle.width / icon.width, this.iconRectangle.height / icon.height), Size);
                }
            };
            Object.defineProperty(IconProjection.prototype, "canvasRectangle", {
                get: function () {
                    return this.getPropertyValue('canvasRectangle', Rectangle, Rectangle.zero);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconProjection.prototype, "iconRectangle", {
                get: function () {
                    return this.getPropertyValue('iconRectangle', Rectangle, Rectangle.zero);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconProjection.prototype, "pixelSize", {
                get: function () {
                    return this.getPropertyValue('pixelSize', Size, Size.empty);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconProjection.prototype, "canvas", {
                get: function () {
                    return this.getPropertyValue('canvas', Canvas, null);
                },
                set: function (value) {
                    this.setPropertyValue('canvas', value, Canvas);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconProjection.prototype, "icon", {
                get: function () {
                    return this.getPropertyValue('icon', Icon, null);
                },
                set: function (value) {
                    this.setPropertyValue('icon', value, Icon);
                },
                enumerable: true,
                configurable: true
            });
            return IconProjection;
        }(PropertyTarget));
        var IconIllustrator = (function (_super) {
            __extends(IconIllustrator, _super);
            function IconIllustrator(icon) {
                var _this = _super.call(this) || this;
                _this.icon = icon;
                _this.tool = new DrawTool();
                _this.plugins.push(new ImportFileTool(_this));
                return _this;
            }
            IconIllustrator.prototype.checkForProjection = function () {
                if (!this.projection.isPresent && this.canvas && this.icon) {
                    this.setPropertyValue('projection', Optional.of(new IconProjection(this.icon, this.canvas)), Optional);
                }
            };
            IconIllustrator.prototype.draw = function () {
                this.projection.ifPresent(function (p) { return p.update(); });
                var gridThreshold = 10;
                this.drawIcon();
                this.projection.ifPresent(function (p) {
                    if (p.pixelSize.width >= gridThreshold) {
                    }
                });
            };
            IconIllustrator.prototype.drawGrid = function () {
                var _this = this;
                this.projection.ifPresent(function (projection) {
                    var iconRect = projection.iconRectangle;
                    var pixelSize = projection.pixelSize;
                    var context = _this.canvas.context;
                    context.strokeStyle = CanvasTheme.gridColor.toHexString();
                    var drawRow = function (row) {
                        var y = iconRect.top + row * pixelSize.height;
                        _this.drawLine(iconRect.left, y, iconRect.right, y);
                    };
                    var drawCol = function (col) {
                        var x = iconRect.left + col * pixelSize.width;
                        _this.drawLine(x, iconRect.top, x, iconRect.bottom);
                    };
                    for (var row = 0; row <= _this.icon.height; row++)
                        drawRow(row);
                    for (var col = 0; col <= _this.icon.width; col++)
                        drawCol(col);
                });
            };
            IconIllustrator.prototype.drawIcon = function () {
                for (var y = 0; y < this.icon.height; y++) {
                    for (var x = 0; x < this.icon.width; x++) {
                        var px = this.icon.getPixel(x, y);
                        if (px && this.projection.isPresent) {
                            this.drawRectangle(this.projection.orThrow().getPixelRect(x, y), px);
                        }
                    }
                }
            };
            IconIllustrator.prototype.drawLine = function (x1, y1, x2, y2) {
                this.canvas.context.beginPath();
                this.canvas.context.moveTo(x1, y1);
                this.canvas.context.lineTo(x2, y2);
                this.canvas.context.stroke();
            };
            IconIllustrator.prototype.drawRectangle = function (r, color) {
                this.canvas.context.fillStyle = color.toHexString();
                this.canvas.context.fillRect(r.left, r.top, r.width, r.height);
            };
            IconIllustrator.prototype.didSet = function (e) {
                var _this = this;
                _super.prototype.didSet.call(this, e);
                if (e.property == 'original') {
                    if (this.original) {
                        this.original.resize({
                            size: this.icon.size,
                            fit: ImageFit.AspectFill
                        }, function (stream) {
                            _this.icon = Icon.fromStream(stream);
                            _this.saveBase();
                            _this.raise('originalProcessed');
                        });
                    }
                }
                else if (e.property == 'icon') {
                    if (this.icon) {
                        if (!this.base)
                            this.saveBase();
                    }
                    this.projection.ifPresent(function (p) { return p.icon = _this.icon; });
                    this.checkForProjection();
                }
                else if (e.property == 'canvas') {
                    this.projection.ifPresent(function (p) { return p.canvas = _this.canvas; });
                    this.checkForProjection();
                }
            };
            IconIllustrator.prototype.saveBase = function (icon) {
                if (icon === void 0) { icon = null; }
                this.setPropertyValue('base', icon || this.icon.clone(), Icon);
            };
            Object.defineProperty(IconIllustrator.prototype, "base", {
                get: function () {
                    return this.getPropertyValue('base', Icon, null);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconIllustrator.prototype, "icon", {
                get: function () {
                    return this.getPropertyValue('icon', Icon, null);
                },
                set: function (value) {
                    this.setPropertyValue('icon', value, Icon);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconIllustrator.prototype, "original", {
                get: function () {
                    return this.getPropertyValue('original', ImageStream, null);
                },
                set: function (value) {
                    this.setPropertyValue('original', value, ImageStream);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IconIllustrator.prototype, "projection", {
                get: function () {
                    return this.getPropertyValue('projection', Optional, Optional.empty());
                },
                enumerable: true,
                configurable: true
            });
            return IconIllustrator;
        }(Illustrator));
        icon_1.IconIllustrator = IconIllustrator;
        var DrawTool = (function (_super) {
            __extends(DrawTool, _super);
            function DrawTool() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.down = false;
                return _this;
            }
            DrawTool.prototype.onMouseEvent = function (mouse, e) {
                _super.prototype.onMouseEvent.call(this, mouse, e);
                if (mouse == Mouse.DOWN) {
                    this.down = true;
                }
                else if (mouse == Mouse.UP) {
                    this.down = false;
                }
                else if (mouse == Mouse.MOVE) {
                    var p_1 = null;
                    this.illustrator.projection.ifPresent(function (projection) {
                        return p_1 = projection.getPixelAt(e.offsetX, e.offsetY);
                    });
                    if (this.down && p_1) {
                        this.illustrator.icon.getPixel(p_1.x, p_1.y).setColor(Color.red);
                    }
                }
            };
            DrawTool.prototype.onKeyboardEvent = function (key, e) {
                _super.prototype.onKeyboardEvent.call(this, key, e);
            };
            return DrawTool;
        }(Tool));
        icon_1.DrawTool = DrawTool;
        var ImportFileTool = (function (_super) {
            __extends(ImportFileTool, _super);
            function ImportFileTool() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ImportFileTool.prototype.onDragEvent = function (drag, e) {
                var _this = this;
                _super.prototype.onDragEvent.call(this, drag, e);
                e.preventDefault();
                if (drag == Drag.DROP) {
                    e.preventDefault();
                    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                        var file = e.dataTransfer.files[0];
                        ImageStream.fromFile(file, function (stream) {
                            _this.illustrator.original = stream;
                        });
                    }
                    else {
                        throw "no good drop";
                    }
                }
            };
            return ImportFileTool;
        }(Plugin));
        icon_1.ImportFileTool = ImportFileTool;
    })(icon = exports.icon || (exports.icon = {}));
});
