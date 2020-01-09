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
define(["require", "exports", "./ui", "./viewport", "./latte", "./linearicon"], function (require, exports, ui_1, viewport_1, latte_1, linearicon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var workspace;
    (function (workspace) {
        var Color = latte_1.latte.Color;
        var PropertyTarget = latte_1.latte.PropertyTarget;
        var DivElement = ui_1.ui.DivElement;
        var InputElement = ui_1.ui.InputElement;
        var Label = ui_1.ui.LabelItem;
        var Optional = latte_1.latte.Optional;
        var LinearIcon = linearicon_1.linearicon.LinearIcon;
        var MainView = ui_1.ui.MainView;
        var SplitView = ui_1.ui.SplitView;
        var Side = latte_1.latte.Side;
        var ColorView = ui_1.ui.ColorView;
        var Mouse;
        (function (Mouse) {
            Mouse[Mouse["UP"] = 0] = "UP";
            Mouse[Mouse["DOWN"] = 1] = "DOWN";
            Mouse[Mouse["MOVE"] = 2] = "MOVE";
        })(Mouse = workspace.Mouse || (workspace.Mouse = {}));
        var Drag;
        (function (Drag) {
            Drag[Drag["OVER"] = 0] = "OVER";
            Drag[Drag["LEAVE"] = 1] = "LEAVE";
            Drag[Drag["DROP"] = 2] = "DROP";
        })(Drag = workspace.Drag || (workspace.Drag = {}));
        var Keyboard;
        (function (Keyboard) {
            Keyboard[Keyboard["UP"] = 0] = "UP";
            Keyboard[Keyboard["DOWN"] = 1] = "DOWN";
            Keyboard[Keyboard["PRESS"] = 2] = "PRESS";
        })(Keyboard = workspace.Keyboard || (workspace.Keyboard = {}));
        var CanvasActuator = (function (_super) {
            __extends(CanvasActuator, _super);
            function CanvasActuator() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            CanvasActuator.prototype.onDragEvent = function (drag, e) { };
            CanvasActuator.prototype.onMouseEvent = function (mouse, e) { };
            CanvasActuator.prototype.onKeyboardEvent = function (key, e) { };
            return CanvasActuator;
        }(PropertyTarget));
        workspace.CanvasActuator = CanvasActuator;
        var IllustratorActuator = (function (_super) {
            __extends(IllustratorActuator, _super);
            function IllustratorActuator() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(IllustratorActuator.prototype, "illustrator", {
                get: function () {
                    return this.getPropertyValue('illustrator', Illustrator, null);
                },
                set: function (value) {
                    this.setPropertyValue('illustrator', value, Illustrator);
                },
                enumerable: true,
                configurable: true
            });
            return IllustratorActuator;
        }(CanvasActuator));
        workspace.IllustratorActuator = IllustratorActuator;
        var Tool = (function (_super) {
            __extends(Tool, _super);
            function Tool() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Tool.prototype, "active", {
                get: function () {
                    return this.getPropertyValue('active', Boolean, false);
                },
                set: function (value) {
                    this.setPropertyValue('active', value, Boolean);
                },
                enumerable: true,
                configurable: true
            });
            return Tool;
        }(IllustratorActuator));
        workspace.Tool = Tool;
        var Plugin = (function (_super) {
            __extends(Plugin, _super);
            function Plugin(ill) {
                var _this = _super.call(this) || this;
                if (!ill)
                    throw "Illustrator at constructor is required";
                _this.illustrator = ill;
                return _this;
            }
            Object.defineProperty(Plugin.prototype, "enabled", {
                get: function () {
                    return this.getPropertyValue('enabled', Boolean, true);
                },
                set: function (value) {
                    this.setPropertyValue('enabled', value, Boolean);
                },
                enumerable: true,
                configurable: true
            });
            return Plugin;
        }(IllustratorActuator));
        workspace.Plugin = Plugin;
        var Illustrator = (function (_super) {
            __extends(Illustrator, _super);
            function Illustrator() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._plugins = [];
                return _this;
            }
            Illustrator.prototype.draw = function () { };
            Illustrator.prototype.onDragEvent = function (drag, e) {
                _super.prototype.onDragEvent.call(this, drag, e);
                if (this.tool) {
                    this.tool.onDragEvent(drag, e);
                }
                this.plugins.forEach(function (p) {
                    if (p.enabled) {
                        p.onDragEvent(drag, e);
                    }
                });
            };
            Illustrator.prototype.onMouseEvent = function (mouse, e) {
                _super.prototype.onMouseEvent.call(this, mouse, e);
                if (this.tool) {
                    this.tool.onMouseEvent(mouse, e);
                }
                this.plugins.forEach(function (p) {
                    if (p.enabled) {
                        p.onMouseEvent(mouse, e);
                    }
                });
            };
            Illustrator.prototype.onKeyboardEvent = function (key, e) {
                _super.prototype.onKeyboardEvent.call(this, key, e);
                if (this.tool) {
                    this.tool.onKeyboardEvent(key, e);
                }
                this.plugins.forEach(function (p) {
                    if (p.enabled) {
                        p.onKeyboardEvent(key, e);
                    }
                });
            };
            Illustrator.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'tool') {
                    if (e.oldValue) {
                        e.oldValue.active = false;
                    }
                    if (this.tool) {
                        this.tool.illustrator = this;
                        this.tool.active = true;
                    }
                }
            };
            Object.defineProperty(Illustrator.prototype, "canvas", {
                get: function () {
                    return this.getPropertyValue('canvas', Canvas, null);
                },
                set: function (value) {
                    this.setPropertyValue('canvas', value, Canvas);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Illustrator.prototype, "plugins", {
                get: function () {
                    return this._plugins;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Illustrator.prototype, "tool", {
                get: function () {
                    return this.getPropertyValue('tool', Tool, null);
                },
                set: function (value) {
                    this.setPropertyValue('tool', value, Tool);
                },
                enumerable: true,
                configurable: true
            });
            return Illustrator;
        }(CanvasActuator));
        workspace.Illustrator = Illustrator;
        var CanvasTheme = (function () {
            function CanvasTheme() {
            }
            CanvasTheme.gridColor = Color.fromHex('#f0f0f0');
            return CanvasTheme;
        }());
        workspace.CanvasTheme = CanvasTheme;
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas(illustrator) {
                var _this = _super.call(this, document.createElement('canvas')) || this;
                _this.illustrator = illustrator;
                _this.raw.addEventListener('mouseup', function (e) { return _this.illustrator.onMouseEvent(Mouse.UP, e); });
                _this.raw.addEventListener('mousemove', function (e) { return _this.illustrator.onMouseEvent(Mouse.MOVE, e); });
                _this.raw.addEventListener('mousedown', function (e) { return _this.illustrator.onMouseEvent(Mouse.DOWN, e); });
                _this.raw.addEventListener('dragover', function (e) { return _this.illustrator.onDragEvent(Drag.OVER, e); });
                _this.raw.addEventListener('dragleave', function (e) { return _this.illustrator.onDragEvent(Drag.LEAVE, e); });
                _this.raw.addEventListener('drop', function (e) { return _this.illustrator.onDragEvent(Drag.DROP, e); });
                _this.raw.addEventListener('keyup', function (e) { return _this.illustrator.onKeyboardEvent(Keyboard.UP, e); });
                _this.raw.addEventListener('keydown', function (e) { return _this.illustrator.onKeyboardEvent(Keyboard.DOWN, e); });
                _this.raw.addEventListener('keypress', function (e) { return _this.illustrator.onKeyboardEvent(Keyboard.PRESS, e); });
                return _this;
            }
            Canvas.prototype.backingScale = function (context) {
                if ('devicePixelRatio' in window) {
                    if (window.devicePixelRatio > 1) {
                        return window.devicePixelRatio;
                    }
                }
                return 1;
            };
            Canvas.prototype.updateSize = function () {
                var scaleFactor = this.backingScale(this.context);
                var desiredWidth = window.innerWidth - 300;
                var desiredHeight = window.innerHeight;
                if (scaleFactor > 1) {
                    this.raw.width = desiredWidth * scaleFactor;
                    this.raw.height = desiredHeight * scaleFactor;
                    this.raw.style.width = String(desiredWidth) + 'px';
                    this.raw.style.height = String(desiredHeight) + 'px';
                    this.setPropertyValue('context', this.raw.getContext('2d'), CanvasRenderingContext2D);
                    this.context.scale(scaleFactor, scaleFactor);
                }
                else {
                    this.raw.width = desiredWidth;
                    this.raw.height = desiredHeight;
                }
                this.setPropertyValues({
                    width: desiredWidth,
                    height: desiredHeight
                });
            };
            Canvas.prototype.draw = function () {
                this.context.clearRect(0, 0, this.width, this.height);
                if (this.illustrator) {
                    this.illustrator.draw();
                }
            };
            Canvas.prototype.endLoop = function () {
                this.setPropertyValue('looping', false, Boolean);
            };
            Canvas.prototype.startLoop = function () {
                var _this = this;
                var start = Date.now();
                var frames = 0;
                var loop = function () {
                    var now = Date.now();
                    if ((now - start) >= 1000) {
                        _this.setPropertyValue('fps', frames, Number);
                        start = now;
                        frames = 0;
                    }
                    _this.draw();
                    frames++;
                    if (_this.looping) {
                        window.requestAnimationFrame(loop);
                    }
                };
                this.setPropertyValue('looping', true, Boolean);
                window.requestAnimationFrame(loop);
            };
            Canvas.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'illustrator' && this.illustrator) {
                    this.illustrator.canvas = this;
                }
            };
            Canvas.prototype.raise = function (eventName) {
                var _this = this;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                _super.prototype.raise.call(this, eventName, args);
                if (eventName == 'attach') {
                    this.updateSize();
                    viewport_1.viewport.onResize(this, function (e) { return _this.updateSize(); });
                    this.startLoop();
                }
                else if (eventName == 'detach') {
                    this.endLoop();
                }
            };
            Object.defineProperty(Canvas.prototype, "context", {
                get: function () {
                    var _this = this;
                    return this.getLazyProperty('context', CanvasRenderingContext2D, function () {
                        return _this.raw.getContext('2d');
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "fps", {
                get: function () {
                    return this.getPropertyValue('fps', Number, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "height", {
                get: function () {
                    return this.getPropertyValue('height', Number, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "illustrator", {
                get: function () {
                    return this.getPropertyValue('illustrator', Illustrator, null);
                },
                set: function (value) {
                    this.setPropertyValue('illustrator', value, Illustrator);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "looping", {
                get: function () {
                    return this.getPropertyValue('looping', Boolean, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "theme", {
                get: function () {
                    return this.getPropertyValue('theme', CanvasTheme, new CanvasTheme());
                },
                set: function (value) {
                    this.setPropertyValue('theme', value, CanvasTheme);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "width", {
                get: function () {
                    return this.getPropertyValue('width', Number, 0);
                },
                enumerable: true,
                configurable: true
            });
            return Canvas;
        }(ui_1.ui.UiElement));
        workspace.Canvas = Canvas;
        var Slider = (function (_super) {
            __extends(Slider, _super);
            function Slider(text) {
                if (text === void 0) { text = ''; }
                var _this = _super.call(this, 'slider') || this;
                _this.text = text;
                return _this;
            }
            Slider.prototype.initRange = function (min, max, step, value) {
                this.inpRange.setAtts({
                    min: min,
                    max: max,
                    step: step,
                    value: value
                });
                this.setPropertyValue('value', String(value), String, { silent: true });
                this.divValue.html = String(value);
                return this;
            };
            Slider.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'text') {
                    this.divText.html = this.text;
                }
                else if (e.property == 'value') {
                    this.divValue.html = this.value;
                }
            };
            Slider.prototype.raise = function (eventName) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                _super.prototype.raise.call(this, eventName, args);
                if (eventName == 'attach') {
                    this.add([
                        this.divText,
                        this.inpRange,
                        this.divValue
                    ]);
                }
            };
            Object.defineProperty(Slider.prototype, "text", {
                get: function () {
                    return this.getPropertyValue('text', String, null);
                },
                set: function (value) {
                    this.setPropertyValue('text', value, String);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slider.prototype, "value", {
                get: function () {
                    return this.getPropertyValue('value', String, null);
                },
                set: function (value) {
                    this.setPropertyValue('value', value, String);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slider.prototype, "inpRange", {
                get: function () {
                    var _this = this;
                    return this.getLazyProperty('inpRange', InputElement, function () {
                        return new InputElement()
                            .setAtts({ type: 'range' })
                            .addEventListener('input', function () { return _this.value = _this.inpRange.raw.value; })
                            .addEventListener('change', function () { return _this.raise('rangeChange'); });
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slider.prototype, "divText", {
                get: function () {
                    return this.getLazyProperty('divText', DivElement, function () {
                        return new DivElement().addClass('text');
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Slider.prototype, "divValue", {
                get: function () {
                    return this.getLazyProperty('divValue', DivElement, function () {
                        return new DivElement().addClass('value');
                    });
                },
                enumerable: true,
                configurable: true
            });
            return Slider;
        }(DivElement));
        var Workspace = (function (_super) {
            __extends(Workspace, _super);
            function Workspace(illustrator) {
                var _this = _super.call(this, 'workspace') || this;
                _this.setPropertyValue('illustrator', illustrator, Illustrator);
                return _this;
            }
            Workspace.prototype.raise = function (eventName) {
                var _this = this;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                _super.prototype.raise.call(this, eventName, args);
                if (eventName == 'attach') {
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
                    this.testLabel.icon = Optional.of(LinearIcon.cross);
                    var a = new SplitView();
                    a.side = Side.LEFT;
                    a.wide = 100;
                    a.sideView = Optional.of(ColorView.fromString('f00'));
                    var b = new SplitView();
                    b.side = Side.TOP;
                    b.wide = 100;
                    var c = new SplitView();
                    c.side = Side.LEFT;
                    c.wide = 100;
                    c.sideView = Optional.of(ColorView.fromString('0f0'));
                    var d = new SplitView();
                    d.side = Side.RIGHT;
                    d.wide = 100;
                    d.view = Optional.of(ColorView.fromString('f0f'));
                    d.sideView = Optional.of(ColorView.fromString('0ff'));
                    a.view = Optional.of(b);
                    b.view = Optional.of(c);
                    b.sideView = Optional.of(d);
                    c.view = Optional.of(ColorView.fromString('00f'));
                    MainView.instance.view = Optional.of(a);
                    setInterval(function () { return _this.divFps.html = _this.canvas.fps + "fps"; }, 500);
                }
            };
            Object.defineProperty(Workspace.prototype, "brightnessSlider", {
                get: function () {
                    var _this = this;
                    return this.getLazyProperty('brightnessSlider', Slider, function () {
                        return new Slider("Brightness")
                            .attachTo(_this.sidebar);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "canvas", {
                get: function () {
                    var _this = this;
                    return this.getLazyProperty('canvas', Canvas, function () {
                        return new Canvas(_this.illustrator);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "contrastSlider", {
                get: function () {
                    var _this = this;
                    return this.getLazyProperty('contrastSlider', Slider, function () {
                        return new Slider("Contrast")
                            .attachTo(_this.sidebar);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "divFps", {
                get: function () {
                    return this.getLazyProperty('divFps', DivElement, function () {
                        return new DivElement('fps');
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "illustrator", {
                get: function () {
                    return this.getPropertyValue('illustrator', Illustrator, undefined);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "sidebar", {
                get: function () {
                    return this.getLazyProperty('sidebar', DivElement, function () {
                        return new DivElement('sidebar');
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "sizeSlider", {
                get: function () {
                    return this.getLazyProperty('sizeSlider', Slider, function () {
                        return new Slider("Size");
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "heightSlider", {
                get: function () {
                    return this.getLazyProperty('heightSlider', Slider, function () {
                        return new Slider("Height");
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "widthSlider", {
                get: function () {
                    return this.getLazyProperty('widthSlider', Slider, function () {
                        return new Slider("Width");
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "colorSlider", {
                get: function () {
                    return this.getLazyProperty('colorSlider', Slider, function () {
                        return new Slider("Palette");
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workspace.prototype, "testLabel", {
                get: function () {
                    return this.getLazyProperty('testLabel', Label, function () {
                        return new Label('Some Text');
                    });
                },
                enumerable: true,
                configurable: true
            });
            Workspace.START_SIZE = 64;
            return Workspace;
        }(DivElement));
        workspace.Workspace = Workspace;
    })(workspace = exports.workspace || (exports.workspace = {}));
});
