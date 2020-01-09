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
define(["require", "exports", "./latte"], function (require, exports, latte_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var imageutil;
    (function (imageutil) {
        var Size = latte_1.latte.Size;
        var Color = latte_1.latte.Color;
        var PropertyTarget = latte_1.latte.PropertyTarget;
        var log = latte_1.latte.log;
        var ImageFit;
        (function (ImageFit) {
            ImageFit[ImageFit["AspectFit"] = 0] = "AspectFit";
            ImageFit[ImageFit["AspectFill"] = 1] = "AspectFill";
            ImageFit[ImageFit["AspectFillNear"] = 2] = "AspectFillNear";
            ImageFit[ImageFit["AspectFillFar"] = 3] = "AspectFillFar";
        })(ImageFit = imageutil.ImageFit || (imageutil.ImageFit = {}));
        ;
        var ImageStream = (function (_super) {
            __extends(ImageStream, _super);
            function ImageStream(canvas) {
                var _this = _super.call(this) || this;
                _this.setPropertyValue('canvas', canvas, HTMLCanvasElement);
                return _this;
            }
            ImageStream.fromFile = function (file, callback) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var dataUrl = e.target.result;
                    ImageStream.fromUrl(dataUrl, function (s) { return callback(s); });
                };
                reader.readAsDataURL(file);
            };
            ImageStream.fromUrl = function (url, callback) {
                var img = new Image();
                img.onload = function () {
                    callback(ImageStream.fromImage(img));
                };
                img.crossOrigin = '';
                img.src = url;
            };
            ImageStream.fromImage = function (image) {
                var canvas = document.createElement('canvas');
                var x = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                x.drawImage(image, 0, 0);
                return new ImageStream(canvas);
            };
            ImageStream.prototype.resample_hermite = function (canvas, W, H, W2, H2) {
                var time1 = Date.now();
                W2 = Math.round(W2);
                H2 = Math.round(H2);
                var img = canvas.getContext("2d").getImageData(0, 0, W, H);
                var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
                var data = img.data;
                var data2 = img2.data;
                var ratio_w = W / W2;
                var ratio_h = H / H2;
                var ratio_w_half = Math.ceil(ratio_w / 2);
                var ratio_h_half = Math.ceil(ratio_h / 2);
                for (var j = 0; j < H2; j++) {
                    for (var i = 0; i < W2; i++) {
                        var x2 = (i + j * W2) * 4;
                        var weight = 0;
                        var weights = 0;
                        var weights_alpha = 0;
                        var gx_r = 0, gx_g = 0, gx_b = 0, gx_a = 0;
                        var center_y = (j + 0.5) * ratio_h;
                        for (var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++) {
                            var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                            var center_x = (i + 0.5) * ratio_w;
                            var w0 = dy * dy;
                            for (var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++) {
                                var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                                var w = Math.sqrt(w0 + dx * dx);
                                if (w >= -1 && w <= 1) {
                                    weight = 2 * w * w * w - 3 * w * w + 1;
                                    if (weight > 0) {
                                        dx = 4 * (xx + yy * W);
                                        gx_a += weight * data[dx + 3];
                                        weights_alpha += weight;
                                        if (data[dx + 3] < 255)
                                            weight = weight * data[dx + 3] / 250;
                                        gx_r += weight * data[dx];
                                        gx_g += weight * data[dx + 1];
                                        gx_b += weight * data[dx + 2];
                                        weights += weight;
                                    }
                                }
                            }
                        }
                        data2[x2] = gx_r / weights;
                        data2[x2 + 1] = gx_g / weights;
                        data2[x2 + 2] = gx_b / weights;
                        data2[x2 + 3] = gx_a / weights_alpha;
                    }
                }
                canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
                canvas.width = W2;
                canvas.height = H2;
                canvas.getContext("2d").putImageData(img2, 0, 0);
            };
            ImageStream.prototype.crop = function (crop, callback) {
                this.toImage(null, function (image) {
                    crop.top = crop.top || 0;
                    crop.left = crop.left || 0;
                    crop.right = crop.right || 0;
                    crop.bottom = crop.bottom || 0;
                    var w = image.naturalWidth;
                    var h = image.naturalHeight;
                    var neww = w - crop.left - crop.right;
                    var newh = h - crop.top - crop.bottom;
                    var c = document.createElement('canvas');
                    c.width = w - crop.left - crop.right;
                    c.height = h - crop.top - crop.bottom;
                    var x = c.getContext('2d');
                    x.drawImage(image, crop.left, crop.top, neww, newh, 0, 0, neww, newh);
                    callback(new ImageStream(c));
                });
            };
            ImageStream.prototype.resize = function (options, callback) {
                var _this = this;
                this.toImage(null, function (image) {
                    var w = image.width;
                    var h = image.height;
                    var size = options.size;
                    var fit = options.fit || ImageFit.AspectFit;
                    var original = new Size(w, h);
                    var target = (fit == ImageFit.AspectFit ? original.scaleToFit(size) : original.scaleToFill(size)).round();
                    var bg = options.background || null;
                    var canvas = document.createElement('canvas');
                    var cx = canvas.getContext('2d');
                    canvas.width = w;
                    canvas.height = h;
                    if (bg instanceof Color) {
                        cx.fillStyle = bg.toHexString();
                        cx.fillRect(0, 0, w, h);
                    }
                    cx.drawImage(image, 0, 0, w, h);
                    log("target (" + target.width + "," + target.height + ")");
                    _this.resample_hermite(canvas, w, h, target.width, target.height);
                    if (fit == ImageFit.AspectFill || fit == ImageFit.AspectFillNear || fit == ImageFit.AspectFillFar) {
                        var offsetx = 0;
                        var offsety = 0;
                        if (target.height > size.height) {
                            if (fit == ImageFit.AspectFill) {
                                offsety = (target.height - size.height) / 2;
                            }
                            else if (fit == ImageFit.AspectFillFar) {
                                offsety = target.height - size.height;
                            }
                        }
                        if (target.width > size.width) {
                            if (fit == ImageFit.AspectFill) {
                                offsetx = (target.width - size.width) / 2;
                            }
                            else if (fit == ImageFit.AspectFillFar) {
                                offsetx = target.width - size.width;
                            }
                        }
                        var canvasex = document.createElement('canvas');
                        canvasex.width = size.width;
                        canvasex.height = size.height;
                        var cx_1 = canvasex.getContext('2d');
                        cx_1.drawImage(canvas, offsetx, offsety, size.width, size.height, 0, 0, size.width, size.height);
                        canvas = canvasex;
                    }
                    callback(new ImageStream(canvas));
                });
            };
            ImageStream.prototype.rotateCounterClockwise = function (callback) {
                this.toImage(null, function (image) {
                    var c = document.createElement('canvas');
                    c.width = image.naturalHeight;
                    c.height = image.naturalWidth;
                    var x = c.getContext('2d');
                    x.save();
                    x.translate(c.width / 2, c.height / 2);
                    x.rotate(-90 * Math.PI / 180);
                    x.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
                    x.restore();
                    callback(new ImageStream(c));
                });
            };
            ImageStream.prototype.rotateClockwise = function (callback) {
                this.toImage(null, function (image) {
                    var c = document.createElement('canvas');
                    c.width = image.naturalHeight;
                    c.height = image.naturalWidth;
                    var x = c.getContext('2d');
                    x.save();
                    x.translate(c.width / 2, c.height / 2);
                    x.rotate(90 * Math.PI / 180);
                    x.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
                    x.restore();
                    callback(new ImageStream(c));
                });
            };
            ImageStream.prototype.toDataUrl = function (options) {
                var opts = options || {};
                return this.canvas.toDataURL(opts.type || ImageUtil.DEFAULT_TYPE, opts.quality || ImageUtil.DEFAULT_QUALITY);
            };
            ImageStream.prototype.toImage = function (options, callback) {
                var img = new Image(this.canvas.width, this.canvas.height);
                img.onload = function () {
                    callback(img);
                };
                img.src = this.toDataUrl(options);
            };
            Object.defineProperty(ImageStream.prototype, "canvas", {
                get: function () {
                    return this.getPropertyValue('canvas', HTMLCanvasElement, undefined);
                },
                enumerable: true,
                configurable: true
            });
            return ImageStream;
        }(PropertyTarget));
        imageutil.ImageStream = ImageStream;
        var ImageUtil = (function () {
            function ImageUtil() {
            }
            ImageUtil.base64ByteSize = function (base64) {
                return atob(base64).length;
            };
            ImageUtil.imageFitFromString = function (fit) {
                if (fit == 'aspect-fit') {
                    return ImageFit.AspectFit;
                }
                else if (fit == 'aspect-fill') {
                    return ImageFit.AspectFill;
                }
                else if (fit == 'aspect-fill-near') {
                    return ImageFit.AspectFillNear;
                }
                else if (fit == 'aspect-fill-far') {
                    return ImageFit.AspectFillFar;
                }
                return null;
            };
            ImageUtil.createThumbOfFile = function (file, options, callback) {
                if (callback === void 0) { callback = null; }
                ImageUtil.readFileAsDataUrl(file, function (dataUrl) {
                    ImageUtil.createThumbOfUrl(dataUrl, options, function (dataUrl) {
                        callback(dataUrl);
                    });
                });
            };
            ImageUtil.createThumbOfImage_Steps = function (image, size) {
                var w = image.width;
                var h = image.height;
                var scale = Math.min(size.width / w, size.height / h);
                var targW = w * scale;
                var steps = Math.ceil(Math.log(w / targW) / Math.log(2)) + 1;
                var stepWidth = Math.round(Math.abs(targW - w) / steps);
                var oc = document.createElement('canvas'), octx = oc.getContext('2d');
                var curW = w;
                var curH = h;
                var curImg = image;
                for (var i = 0; i < steps; i++) {
                    curW -= stepWidth;
                    curH = Math.round(curW * h / w);
                    oc.width = curW;
                    oc.height = curH;
                    octx.drawImage(curImg, 0, 0, curW, curH);
                    curImg = document.createElement('img');
                    curImg.src = oc.toDataURL();
                }
                var result = curImg.src;
                curImg = null;
                oc = null;
                octx = null;
                return result;
            };
            ImageUtil.cropImage = function (image, crop, options) {
                if (options === void 0) { options = null; }
                if (!options) {
                    options = {};
                }
                crop.top = crop.top || 0;
                crop.left = crop.left || 0;
                crop.right = crop.right || 0;
                crop.bottom = crop.bottom || 0;
                var w = image.naturalWidth;
                var h = image.naturalHeight;
                var neww = w - crop.left - crop.right;
                var newh = h - crop.top - crop.bottom;
                var c = document.createElement('canvas');
                c.width = w - crop.left - crop.right;
                c.height = h - crop.top - crop.bottom;
                var x = c.getContext('2d');
                x.drawImage(image, crop.left, crop.top, neww, newh, 0, 0, neww, newh);
                var img = document.createElement('img');
                img.src = c.toDataURL(options.type || ImageUtil.DEFAULT_TYPE, options.quality || ImageUtil.DEFAULT_QUALITY);
                return img;
            };
            ImageUtil.resizeImage = function (image, options) {
                var w = image.width;
                var h = image.height;
                var size = options.size;
                var original = new Size(w, h);
                var type = options.type || ImageUtil.DEFAULT_TYPE;
                var quality = options.quality || ImageUtil.DEFAULT_QUALITY;
                var bg = options.background || null;
                var canvas = document.createElement('canvas');
                var cx = canvas.getContext('2d');
                var target;
                var fit = options.fit || ImageFit.AspectFit;
                if (fit == ImageFit.AspectFit) {
                    target = original.scaleToFit(size);
                }
                else {
                    target = original.scaleToFill(size);
                }
                canvas.width = image.width;
                canvas.height = image.height;
                if (bg instanceof Color) {
                    cx.fillStyle = bg.toHexString();
                    cx.fillRect(0, 0, w, h);
                }
                cx.drawImage(image, 0, 0, w, h);
                ImageUtil.resample_hermite(canvas, w, h, target.width, target.height);
                if (fit == ImageFit.AspectFill || fit == ImageFit.AspectFillNear || fit == ImageFit.AspectFillFar) {
                    var offsetx = 0;
                    var offsety = 0;
                    if (target.height > size.height) {
                        if (fit == ImageFit.AspectFill) {
                            offsety = (target.height - size.height) / 2;
                        }
                        else if (fit == ImageFit.AspectFillFar) {
                            offsety = target.height - size.height;
                        }
                    }
                    if (target.width > size.width) {
                        if (fit == ImageFit.AspectFill) {
                            offsetx = (target.width - size.width) / 2;
                        }
                        else if (fit == ImageFit.AspectFillFar) {
                            offsetx = target.width - size.width;
                        }
                    }
                    var canvasex = document.createElement('canvas');
                    canvasex.width = size.width;
                    canvasex.height = size.height;
                    var cx_2 = canvasex.getContext('2d');
                    cx_2.drawImage(canvas, offsetx, offsety, size.width, size.height, 0, 0, size.width, size.height);
                    canvas = canvasex;
                }
                var result = '';
                if (ImageUtil.mimeTypeCompressable(type)) {
                    result = canvas.toDataURL(type, quality);
                }
                else {
                    result = canvas.toDataURL(type);
                }
                canvas = null;
                return result;
            };
            ImageUtil.createThumbOfImage = function (image, options) {
                return ImageUtil.resizeImage(image, options);
            };
            ImageUtil.resample_hermite = function (canvas, W, H, W2, H2) {
                var time1 = Date.now();
                W2 = Math.round(W2);
                H2 = Math.round(H2);
                var img = canvas.getContext("2d").getImageData(0, 0, W, H);
                var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
                var data = img.data;
                var data2 = img2.data;
                var ratio_w = W / W2;
                var ratio_h = H / H2;
                var ratio_w_half = Math.ceil(ratio_w / 2);
                var ratio_h_half = Math.ceil(ratio_h / 2);
                for (var j = 0; j < H2; j++) {
                    for (var i = 0; i < W2; i++) {
                        var x2 = (i + j * W2) * 4;
                        var weight = 0;
                        var weights = 0;
                        var weights_alpha = 0;
                        var gx_r = 0, gx_g = 0, gx_b = 0, gx_a = 0;
                        var center_y = (j + 0.5) * ratio_h;
                        for (var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++) {
                            var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                            var center_x = (i + 0.5) * ratio_w;
                            var w0 = dy * dy;
                            for (var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++) {
                                var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                                var w = Math.sqrt(w0 + dx * dx);
                                if (w >= -1 && w <= 1) {
                                    weight = 2 * w * w * w - 3 * w * w + 1;
                                    if (weight > 0) {
                                        dx = 4 * (xx + yy * W);
                                        gx_a += weight * data[dx + 3];
                                        weights_alpha += weight;
                                        if (data[dx + 3] < 255)
                                            weight = weight * data[dx + 3] / 250;
                                        gx_r += weight * data[dx];
                                        gx_g += weight * data[dx + 1];
                                        gx_b += weight * data[dx + 2];
                                        weights += weight;
                                    }
                                }
                            }
                        }
                        data2[x2] = gx_r / weights;
                        data2[x2 + 1] = gx_g / weights;
                        data2[x2 + 2] = gx_b / weights;
                        data2[x2 + 3] = gx_a / weights_alpha;
                    }
                }
                canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
                canvas.width = W2;
                canvas.height = H2;
                canvas.getContext("2d").putImageData(img2, 0, 0);
            };
            ImageUtil.createThumbOfUrl = function (url, options, callback) {
                if (callback === void 0) { callback = null; }
                var img = new Image();
                img.onload = function () {
                    callback(ImageUtil.createThumbOfImage(img, options));
                };
                img.crossOrigin = '';
                img.src = url;
            };
            ImageUtil.getBase64 = function (dataUrl) {
                var indicator = 'base64,';
                var index = dataUrl.indexOf(indicator);
                if (index > 0) {
                    return dataUrl.substr(index + indicator.length);
                }
                return null;
            };
            ImageUtil.readFileAsDataUrl = function (file, callback) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var dataUrl = e.target.result;
                    callback(dataUrl);
                };
                reader.readAsDataURL(file);
            };
            ImageUtil.getImageAsBase64 = function (image) {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                var c = canvas.getContext('2d');
                c.drawImage(image, 0, 0);
                return ImageUtil.getBase64(canvas.toDataURL('image/png'));
            };
            ImageUtil.mimeTypeOf = function (extension) {
                var e = String(extension).toLowerCase().trim();
                if (e.charAt(0) == '.')
                    e = e.substr(1);
                switch (e) {
                    case "jpg":
                        return "image/jpeg";
                    case "jpeg":
                        return "image/jpeg";
                    case "gif":
                        return "image/gif";
                    case "webp":
                        return "image/webp";
                    case "png":
                        return "image/png";
                    default:
                        return "image/png";
                }
            };
            ImageUtil.mimeTypeCompressable = function (mimeType) {
                var m = String(mimeType).toLocaleLowerCase();
                return m == "image/jpg" || m == "image/jpeg" || m == "image/webp";
            };
            ImageUtil.mimeTypeTransparent = function (mimeType) {
                var m = String(mimeType).toLocaleLowerCase();
                return m == "image/png" || m == "image/gif";
            };
            ImageUtil.rotateCounterClockwise = function (image, options) {
                if (options === void 0) { options = null; }
                if (!options) {
                    options = {};
                }
                var c = document.createElement('canvas');
                c.width = image.naturalHeight;
                c.height = image.naturalWidth;
                var x = c.getContext('2d');
                x.save();
                x.translate(c.width / 2, c.height / 2);
                x.rotate(-90 * Math.PI / 180);
                x.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
                x.restore();
                var img = document.createElement('img');
                img.src = c.toDataURL(options.type || ImageUtil.DEFAULT_TYPE, options.quality || ImageUtil.DEFAULT_QUALITY);
                return img;
            };
            ImageUtil.rotateClockwise = function (image, options) {
                if (options === void 0) { options = null; }
                if (!options) {
                    options = {};
                }
                var c = document.createElement('canvas');
                c.width = image.naturalHeight;
                c.height = image.naturalWidth;
                var x = c.getContext('2d');
                x.save();
                x.translate(c.width / 2, c.height / 2);
                x.rotate(90 * Math.PI / 180);
                x.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
                x.restore();
                var img = document.createElement('img');
                img.src = c.toDataURL(options.type || ImageUtil.DEFAULT_TYPE, options.quality || ImageUtil.DEFAULT_QUALITY);
                return img;
            };
            ImageUtil.DEFAULT_QUALITY = 0.85;
            ImageUtil.DEFAULT_TYPE = 'image/jpeg';
            return ImageUtil;
        }());
        imageutil.ImageUtil = ImageUtil;
    })(imageutil = exports.imageutil || (exports.imageutil = {}));
});
