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
    var ui;
    (function (ui) {
        var DateTime = latte_1.latte.DateTime;
        var PropertyTarget = latte_1.latte.PropertyTarget;
        var Any = latte_1.latte.Any;
        var Optional = latte_1.latte.Optional;
        var Side = latte_1.latte.Side;
        var Color = latte_1.latte.Color;
        var log = latte_1.latte.log;
        var Point = latte_1.latte.Point;
        var LanguageDirection;
        (function (LanguageDirection) {
            LanguageDirection[LanguageDirection["AUTO"] = 0] = "AUTO";
            LanguageDirection[LanguageDirection["RTL"] = 1] = "RTL";
            LanguageDirection[LanguageDirection["LTR"] = 2] = "LTR";
        })(LanguageDirection = ui.LanguageDirection || (ui.LanguageDirection = {}));
        var ClickAndDragOperation = (function (_super) {
            __extends(ClickAndDragOperation, _super);
            function ClickAndDragOperation(e) {
                var _this = _super.call(this) || this;
                _this.moveHandler = function (e) { return _this.mouseMove(e); };
                _this.upHandler = function (e) { return _this.mouseUp(e); };
                window.addEventListener('mousemove', _this.moveHandler, true);
                window.addEventListener('mouseup', _this.upHandler, true);
                return _this;
            }
            ClickAndDragOperation.prototype.destroy = function () {
                window.removeEventListener('mousemove', this.moveHandler, true);
                window.removeEventListener('mouseup', this.upHandler, true);
                log("ClickAndDragDestroyed");
            };
            ClickAndDragOperation.prototype.mouseMove = function (e) {
                this.raise('mouseMove', e);
            };
            ClickAndDragOperation.prototype.mouseUp = function (e) {
                this.raise('mouseUp', e);
                this.destroy();
            };
            return ClickAndDragOperation;
        }(PropertyTarget));
        ui.ClickAndDragOperation = ClickAndDragOperation;
        var Animation = (function (_super) {
            __extends(Animation, _super);
            function Animation(startValue, endValue, duration, updateHandler, endHandler) {
                if (updateHandler === void 0) { updateHandler = null; }
                if (endHandler === void 0) { endHandler = null; }
                var _this = _super.call(this) || this;
                _this.setPropertyValues({
                    duration: duration,
                    startValue: startValue,
                    endValue: endValue
                });
                if (updateHandler) {
                    _this.on('update', updateHandler);
                }
                if (endHandler) {
                    _this.on('ended', endHandler);
                }
                return _this;
            }
            Object.defineProperty(Animation, "requestAnimationFrame", {
                get: function () {
                    return window.requestAnimationFrame || (function () {
                        var timeLast = 0;
                        return window['webkitRequestAnimationFrame'] || function (callback) {
                            var timeCurrent = (new Date()).getTime(), timeDelta;
                            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
                            timeLast = timeCurrent + timeDelta;
                            return setTimeout(function () { callback(timeCurrent + timeDelta); }, timeDelta);
                        };
                    })();
                },
                enumerable: true,
                configurable: true
            });
            Animation.loop = function () {
                Animation.loopActive = true;
                var now = DateTime.now;
                var runningAnimations = 0;
                for (var i = 0; i < Animation.stack.length; i++) {
                    var a = Animation.stack[i];
                    if (!a || !a.running)
                        continue;
                    var value = a.currentValue;
                    if (now.compareTo(a.endTime) > 0 || value >= a.endValue) {
                        a.setPropertyValue('running', false, Boolean);
                        a.raise('update', a.endValue);
                        a.raise('ended');
                    }
                    else {
                        a.raise('update', a.endValue);
                        runningAnimations++;
                    }
                }
                if (runningAnimations > 0) {
                    var rq = Animation.requestAnimationFrame;
                    rq(Animation.loop);
                }
                else {
                    Animation.stack = [];
                    Animation.loopActive = false;
                }
            };
            Animation.prototype.getValueForSecond = function (s) {
                return this.startValue + (this.speed * s);
            };
            Animation.prototype.start = function () {
                this.updateStartDate();
                Animation.stack.push(this);
                if (!Animation.loopActive)
                    Animation.loop();
            };
            Animation.prototype.updateStartDate = function () {
                this.setPropertyValue('startTime', this.nowSupplier(), DateTime);
            };
            Object.defineProperty(Animation.prototype, "currentValue", {
                get: function () {
                    return this.getValueForSecond((this.nowSupplier()).subtractDate(this.startTime).totalSeconds);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "distance", {
                get: function () {
                    return this.endValue - this.startValue;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "duration", {
                get: function () {
                    return this.getPropertyValue('duration', Number, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "endValue", {
                get: function () {
                    return this.getPropertyValue('endValue', Number, 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "endTime", {
                get: function () {
                    return this.startTime.addSeconds(this.duration);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "nowSupplier", {
                get: function () {
                    return this.getPropertyValue('nowSupplier', Any, function () { return DateTime.now; });
                },
                set: function (value) {
                    this.setPropertyValue('nowSupplier', value, Any);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "running", {
                get: function () {
                    return this.getPropertyValue('running', Boolean, false);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "startValue", {
                get: function () {
                    return this.getPropertyValue('startValue', Number, undefined);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "startTime", {
                get: function () {
                    return this.getPropertyValue('startTime', DateTime, null);
                },
                set: function (value) {
                    this.setPropertyValue('startTime', value, DateTime);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "speed", {
                get: function () {
                    return this.distance / this.duration;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "tag", {
                get: function () {
                    return this.getPropertyValue('tag', Any, undefined);
                },
                set: function (value) {
                    this.setPropertyValue('tag', value, Any);
                },
                enumerable: true,
                configurable: true
            });
            Animation.stack = [];
            Animation.loopActive = false;
            return Animation;
        }(PropertyTarget));
        ui.Animation = Animation;
        var Element = (function (_super) {
            __extends(Element, _super);
            function Element(raw) {
                var _this = _super.call(this) || this;
                _this.animations = [];
                if (!raw) {
                    throw "HTMLElement Needed";
                }
                _this.setPropertyValue('raw', raw, HTMLElement);
                return _this;
            }
            Element.of = function (tagName) {
                var raw = document.createElement(tagName);
                return new Element(raw);
            };
            Element.prototype.getCssNumericValue = function (property) {
                return parseFloat(this.raw.style[property] || '0');
            };
            Element.prototype.setCssNumericValue = function (property, value) {
                if (property == 'opacity') {
                    this.raw.style[property] = String(value);
                }
                else {
                    this.raw.style[property] = value + 'px';
                }
            };
            Element.prototype.addClass = function (name) {
                var _this = this;
                if (name.indexOf(' ') >= 0) {
                    name.split(' ').forEach(function (token) {
                        if (token) {
                            _this.raw.classList.add(token);
                        }
                    });
                }
                else {
                    this.raw.classList.add(name);
                }
                return this;
            };
            Element.prototype.add = function (e) {
                var _this = this;
                if (e instanceof HTMLElement) {
                    this.raw.appendChild(e);
                }
                else if (e instanceof Element) {
                    this.add(e.raw);
                    e.raise('attach');
                }
                else if (e instanceof Array) {
                    e.forEach(function (piece) { return _this.add(piece); });
                }
                return this;
            };
            Element.prototype.animateFrom = function (startProperties, endProperties, duration, callback) {
                var _this = this;
                if (duration === void 0) { duration = 0.1; }
                if (callback === void 0) { callback = null; }
                var animations = [];
                var setValue = function (p, value) {
                    if (!_this.hasPropertyValue(p)) {
                        _this.setCssNumericValue(p, value);
                    }
                    else {
                        _this.setPropertyValue(p, value, Any);
                    }
                };
                for (var p in startProperties) {
                    var a = new Animation(startProperties[p], endProperties[p], duration, null);
                    a.tag = p;
                    animations.push(a);
                }
                if (animations.length > 0) {
                    var leader_1 = animations[0];
                    leader_1.on('update', function () {
                        for (var i = 0; i < animations.length; i++) {
                            var a = animations[i];
                            setValue(a.tag, leader_1.running ? a.currentValue : a.endValue);
                        }
                    });
                    leader_1.on('ended', function () {
                        _this.setPropertyValue('isBeingAnimated', false, Boolean);
                    });
                    if (callback) {
                        leader_1.on('ended', callback);
                    }
                    this.setPropertyValue('isBeingAnimated', true, Boolean);
                    leader_1.start();
                    animations.forEach(function (a) { return a.startTime = DateTime.now; });
                    return this;
                }
                this.animations = this.animations.concat(animations);
                this.animations = this.animations.filter(function (a) { return a.running; });
            };
            Element.prototype.animate = function (properties, duration, callback) {
                var _this = this;
                if (duration === void 0) { duration = 0.1; }
                if (callback === void 0) { callback = null; }
                var starts = {};
                var getValue = function (p) {
                    if (!_this.hasPropertyValue(p)) {
                        return _this.getCssNumericValue(p);
                    }
                    else {
                        return _this.getPropertyValue(p, Any, undefined);
                    }
                };
                for (var p in properties) {
                    starts[p] = getValue(p);
                }
                this.animateFrom(starts, properties, duration, callback);
                return this;
            };
            Element.prototype.attachTo = function (e) {
                if (e instanceof Element) {
                    e.raw.appendChild(this.raw);
                }
                else {
                    e.appendChild(this.raw);
                }
                this.raise('attach');
                return this;
            };
            Element.prototype.addEventListener = function (name, listener) {
                this.raw.addEventListener(name, listener);
                return this;
            };
            Element.prototype.clear = function () {
                while (this.raw.children.length > 0) {
                    this.raw.children[0].remove();
                }
            };
            Element.prototype.ensureClass = function (className, present) {
                if (present === void 0) { present = true; }
                if (present) {
                    this.addClass(className);
                }
                else {
                    this.removeClass(className);
                }
                return this;
            };
            Element.prototype.getAtt = function (name) {
                return this.raw.getAttribute(name);
            };
            Element.prototype.hasClass = function (className) {
                return this.raw.classList.contains(className);
            };
            Element.prototype.setAtt = function (name, value) {
                this.raw.setAttribute(name, value);
                return this;
            };
            Element.prototype.setAtts = function (keyValueMap) {
                for (var key in keyValueMap)
                    this.setAtt(key, String(keyValueMap[key]));
                return this;
            };
            Element.prototype.removeClass = function (name) {
                var _this = this;
                if (name.indexOf(' ') >= 0) {
                    name.split(' ').forEach(function (token) {
                        if (token) {
                            _this.raw.classList.remove(token);
                        }
                    });
                }
                else {
                    this.raw.classList.remove(name);
                }
                return this;
            };
            Element.prototype.removeFromParent = function () {
                this.raw.remove();
                this.raise('detach');
            };
            Object.defineProperty(Element.prototype, "html", {
                get: function () {
                    return this.raw.innerHTML;
                },
                set: function (value) {
                    this.raw.innerHTML = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "raw", {
                get: function () {
                    return this.getPropertyValue('raw', HTMLElement, undefined);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "isBeingAnimated", {
                get: function () {
                    return this.getPropertyValue('isBeingAnimated', Boolean, false);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "style", {
                get: function () {
                    return this.raw.style;
                },
                enumerable: true,
                configurable: true
            });
            return Element;
        }(PropertyTarget));
        ui.Element = Element;
        var AnyElement = (function (_super) {
            __extends(AnyElement, _super);
            function AnyElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AnyElement;
        }(Element));
        ui.AnyElement = AnyElement;
        var UiElement = (function (_super) {
            __extends(UiElement, _super);
            function UiElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UiElement.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'langDirection') {
                    switch (this.langDirection) {
                        case LanguageDirection.AUTO:
                            this.setAtt('dir', 'auto');
                            break;
                        case LanguageDirection.LTR:
                            this.setAtt('dir', 'ltr');
                            break;
                        case LanguageDirection.RTL:
                            this.setAtt('dir', 'rtl');
                            break;
                    }
                }
            };
            Object.defineProperty(UiElement.prototype, "langDirection", {
                get: function () {
                    return this.getPropertyValue('langDirection', Any, LanguageDirection.AUTO);
                },
                set: function (value) {
                    this.setPropertyValue('langDirection', value, Any);
                },
                enumerable: true,
                configurable: true
            });
            return UiElement;
        }(Element));
        ui.UiElement = UiElement;
        var DivElement = (function (_super) {
            __extends(DivElement, _super);
            function DivElement(e) {
                if (e === void 0) { e = null; }
                var _this = _super.call(this, e instanceof HTMLDivElement ? e : document.createElement('div')) || this;
                if ("string" === typeof e) {
                    _this.addClass(e);
                }
                return _this;
            }
            DivElement.withClass = function (name) {
                var d = new DivElement();
                d.addClass(name);
                return d;
            };
            return DivElement;
        }(UiElement));
        ui.DivElement = DivElement;
        var InputElement = (function (_super) {
            __extends(InputElement, _super);
            function InputElement(e) {
                if (e === void 0) { e = null; }
                return _super.call(this, e || document.createElement('input')) || this;
            }
            return InputElement;
        }(UiElement));
        ui.InputElement = InputElement;
        var Item = (function (_super) {
            __extends(Item, _super);
            function Item(e) {
                if (e === void 0) { e = null; }
                var _this = _super.call(this, e) || this;
                _this.addClass('item');
                _this.setAtt('tabIndex', '0');
                return _this;
            }
            return Item;
        }(DivElement));
        ui.Item = Item;
        var IconItem = (function (_super) {
            __extends(IconItem, _super);
            function IconItem(size) {
                if (size === void 0) { size = 16; }
                var _this = _super.call(this, 'icon') || this;
                _this.size = size;
                return _this;
            }
            IconItem.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'size') {
                    this.raw.style.width = this.size.px;
                    this.raw.style.height = this.size.px;
                }
            };
            Object.defineProperty(IconItem.prototype, "size", {
                get: function () {
                    return this.getPropertyValue('size', Number, 16);
                },
                set: function (value) {
                    this.setPropertyValue('size', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            return IconItem;
        }(Item));
        ui.IconItem = IconItem;
        var LabelItem = (function (_super) {
            __extends(LabelItem, _super);
            function LabelItem(text) {
                if (text === void 0) { text = null; }
                var _this = _super.call(this, 'label') || this;
                _this.reassembleNeeded = false;
                if (text) {
                    _this.text = text;
                }
                return _this;
            }
            LabelItem.prototype.createIconElement = function () {
                this.setPropertyUnsafe('eIcon', Optional.of(new DivElement('icon-container')));
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.createDescriptionElement = function () {
                this.setPropertyUnsafe('eDescription', Optional.of(new DivElement('desc')));
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.createTextElement = function () {
                this.setPropertyUnsafe('eText', Optional.of(new DivElement('text')));
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.createGroupElement = function () {
                this.setPropertyUnsafe('eGroup', Optional.of(new DivElement('group')));
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.deleteIconElement = function () {
                this.eIcon.ifPresent(function (e) { return e.removeFromParent(); });
                this.setPropertyUnsafe('eIcon', Optional.empty());
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.deleteDescriptionElement = function () {
                this.eDescription.ifPresent(function (e) { return e.removeFromParent(); });
                this.setPropertyUnsafe('eDescription', Optional.empty());
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.deleteGroupElement = function () {
                this.eGroup.ifPresent(function (e) { return e.removeFromParent(); });
                this.setPropertyUnsafe('eGroup', Optional.empty());
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.deleteTextElement = function () {
                this.eText.ifPresent(function (e) { return e.removeFromParent(); });
                this.setPropertyUnsafe('eText', Optional.empty());
                this.reassembleNeeded = true;
            };
            LabelItem.prototype.reassemble = function () {
                var _this = this;
                this.eText.ifPresent(function (e) { return e.removeFromParent(); });
                this.eDescription.ifPresent(function (e) { return e.removeFromParent(); });
                this.eGroup.ifPresent(function (e) { return e.removeFromParent(); });
                this.eIcon.ifPresent(function (e) { return e.removeFromParent(); });
                if (this.eIcon.isPresent) {
                    this.add(this.eIcon.orThrow());
                }
                this.eGroup.ifPresent(function (g) {
                    _this.add(g);
                    _this.eText.ifPresent(function (t) { return g.add(t); });
                    _this.eDescription.ifPresent(function (d) {
                        g.add(d);
                    });
                }).elseDo(function () {
                    _this.eDescription.ifPresent(function (d) {
                        _this.eText.ifPresent(function (t) { return _this.add(t); });
                        _this.add(d);
                    }).elseDo(function () {
                        _this.eText.ifPresent(function (t) {
                        }).elseDo(function () {
                            if (_this.text) {
                                _this.html = _this.text;
                            }
                        });
                    });
                });
                this.reassembleNeeded = false;
            };
            LabelItem.prototype.updateLayout = function () {
                if (this.icon.isPresent) {
                    if (!this.eIcon.isPresent) {
                        this.createIconElement();
                    }
                    this.eIcon.orThrow().add(this.icon.orThrow());
                }
                else {
                    if (this.eIcon.isPresent) {
                        this.deleteIconElement();
                    }
                }
                if (this.icon.isPresent && (this.description.isPresent || this.text)) {
                    if (!this.eGroup.isPresent) {
                        this.createGroupElement();
                    }
                }
                else {
                    if (this.eGroup.isPresent) {
                        this.deleteGroupElement();
                    }
                }
                if (this.description.isPresent) {
                    if (!this.eDescription.isPresent) {
                        this.createDescriptionElement();
                    }
                    this.eDescription.orThrow().html = this.description.orThrow();
                }
                else {
                    if (this.eDescription.isPresent) {
                        this.deleteDescriptionElement();
                    }
                }
                if (this.text)
                    if (this.icon.isPresent || this.description.isPresent) {
                        if (!this.eText.isPresent) {
                            this.html = '';
                            this.createTextElement();
                        }
                        this.eText.orThrow().html = this.text;
                    }
                    else {
                        if (this.eGroup.isPresent) {
                            if (!this.eText.isPresent) {
                                this.html = '';
                                this.createTextElement();
                            }
                        }
                        else {
                            if (this.eText.isPresent) {
                                this.deleteTextElement();
                            }
                            this.html = this.text;
                        }
                    }
                if (this.reassembleNeeded) {
                    this.reassemble();
                }
            };
            LabelItem.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'text' || e.property == 'description' || e.property == 'icon') {
                    this.updateLayout();
                    this.ensureClass('with-icon', this.eIcon.isPresent);
                    this.ensureClass('with-desc', this.eDescription.isPresent);
                    this.ensureClass('with-text', !!this.text);
                }
            };
            Object.defineProperty(LabelItem.prototype, "description", {
                get: function () {
                    return this.getPropertyValue('description', Optional, Optional.empty());
                },
                set: function (value) {
                    this.setPropertyValue('description', value, Optional);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelItem.prototype, "icon", {
                get: function () {
                    return this.getPropertyValue('icon', Optional, Optional.empty());
                },
                set: function (value) {
                    this.setPropertyValue('icon', value, Optional);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelItem.prototype, "text", {
                get: function () {
                    return this.getPropertyValue('text', String, null);
                },
                set: function (value) {
                    this.setPropertyValue('text', value, String);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelItem.prototype, "eDescription", {
                get: function () {
                    return this.getPropertyValue('eDescription', Optional, Optional.empty());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelItem.prototype, "eGroup", {
                get: function () {
                    return this.getPropertyValue('eGroup', Optional, Optional.empty());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelItem.prototype, "eIcon", {
                get: function () {
                    return this.getPropertyValue('eIcon', Optional, Optional.empty());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelItem.prototype, "eText", {
                get: function () {
                    return this.getPropertyValue('eText', Optional, Optional.empty());
                },
                enumerable: true,
                configurable: true
            });
            return LabelItem;
        }(Item));
        ui.LabelItem = LabelItem;
        var Clickable = (function (_super) {
            __extends(Clickable, _super);
            function Clickable() {
                var _this = _super.call(this) || this;
                _this.addEventListener('click', function (e) { return _this.raise('click', e); });
                return _this;
            }
            return Clickable;
        }(Item));
        ui.Clickable = Clickable;
        var ButtonItem = (function (_super) {
            __extends(ButtonItem, _super);
            function ButtonItem() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(ButtonItem.prototype, "label", {
                get: function () {
                    return this.getLazyProperty('label', LabelItem, function () {
                        return new LabelItem();
                    });
                },
                enumerable: true,
                configurable: true
            });
            return ButtonItem;
        }(Clickable));
        ui.ButtonItem = ButtonItem;
        var Selectable = (function (_super) {
            __extends(Selectable, _super);
            function Selectable() {
                return _super.call(this, 'selectable') || this;
            }
            Selectable.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'selected') {
                    this.ensureClass('selected', this.selected);
                }
            };
            Object.defineProperty(Selectable.prototype, "selected", {
                get: function () {
                    return this.getPropertyValue('selected', Boolean, null);
                },
                set: function (value) {
                    this.setPropertyValue('selected', value, Boolean);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Selectable.prototype, "divLabel", {
                get: function () {
                    return this.getLazyProperty('divLabel', LabelItem, function () {
                        return new LabelItem();
                    });
                },
                enumerable: true,
                configurable: true
            });
            return Selectable;
        }(DivElement));
        ui.Selectable = Selectable;
        var View = (function (_super) {
            __extends(View, _super);
            function View(className) {
                if (className === void 0) { className = ''; }
                return _super.call(this, className + ' view') || this;
            }
            View.prototype.didSet = function (e) {
                var _this = this;
                _super.prototype.didSet.call(this, e);
                if (e.property == 'view') {
                    if (e.oldValue) {
                        e.oldValue.ifPresent(function (v) { return v.removeFromParent(); });
                    }
                    this.container.clear();
                    this.view.ifPresent(function (v) { return _this.container.add(v); });
                }
            };
            View.prototype.onEvent = function (name, args) {
                _super.prototype.onEvent.call(this, name, args);
                if (name == 'attach') {
                    this.add(this.container);
                }
            };
            Object.defineProperty(View.prototype, "view", {
                get: function () {
                    return this.getPropertyValue('view', Optional, undefined);
                },
                set: function (value) {
                    this.setPropertyValue('view', value, Optional);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(View.prototype, "container", {
                get: function () {
                    return this.getLazyProperty('container', DivElement, function () {
                        return new DivElement('container');
                    });
                },
                enumerable: true,
                configurable: true
            });
            return View;
        }(DivElement));
        ui.View = View;
        var MainView = (function (_super) {
            __extends(MainView, _super);
            function MainView() {
                var _this = _super.call(this) || this;
                if (++MainView.instances > 1) {
                    throw "This class is a singleton";
                }
                return _this;
            }
            MainView.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'view') {
                    if (e.oldValue) {
                        e.oldValue.ifPresent(function (v) { return v.removeFromParent(); });
                    }
                    this.view.ifPresent(function (v) {
                        document.body.appendChild(v.raw);
                        v.raise('attach');
                    });
                }
            };
            Object.defineProperty(MainView.prototype, "view", {
                get: function () {
                    return this.getPropertyValue('view', Optional, Optional.empty());
                },
                set: function (value) {
                    this.setPropertyValue('view', value, Optional);
                },
                enumerable: true,
                configurable: true
            });
            MainView.instances = 0;
            MainView.instance = new MainView();
            return MainView;
        }(PropertyTarget));
        ui.MainView = MainView;
        var AnchorView = (function (_super) {
            __extends(AnchorView, _super);
            function AnchorView(className) {
                return _super.call(this, className + ' anchor') || this;
            }
            AnchorView.prototype.updateUi = function () {
                var top = null;
                var left = null;
                var right = null;
                var bottom = null;
                var size = this.wide.px;
                switch (this.side) {
                    case Side.TOP:
                        top = size;
                        break;
                    case Side.LEFT:
                        left = size;
                        break;
                    case Side.RIGHT:
                        right = size;
                        break;
                    case Side.BOTTOM:
                        bottom = size;
                        break;
                }
                this.container.style.top = top;
                this.container.style.left = left;
                this.container.style.right = right;
                this.container.style.bottom = bottom;
                this.ensureClass('side-top', this.side == Side.TOP);
                this.ensureClass('side-left', this.side == Side.LEFT);
                this.ensureClass('side-right', this.side == Side.RIGHT);
                this.ensureClass('side-bottom', this.side == Side.BOTTOM);
            };
            AnchorView.prototype.didSet = function (e) {
                _super.prototype.didSet.call(this, e);
                if (e.property == 'side' || e.property == 'wide') {
                    this.updateUi();
                }
            };
            Object.defineProperty(AnchorView.prototype, "side", {
                get: function () {
                    return this.getPropertyValue('side', Side, Side.TOP);
                },
                set: function (value) {
                    this.setPropertyValue('side', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnchorView.prototype, "wide", {
                get: function () {
                    return this.getPropertyValue('wide', Number, 20);
                },
                set: function (value) {
                    this.setPropertyValue('wide', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            return AnchorView;
        }(View));
        ui.AnchorView = AnchorView;
        var SplitView = (function (_super) {
            __extends(SplitView, _super);
            function SplitView() {
                return _super.call(this, 'split') || this;
            }
            SplitView.prototype.splitter_MouseDown = function (e) {
                var _this = this;
                var me = e;
                var d = new ClickAndDragOperation(me);
                var start = new Point(me.clientX, me.clientY);
                var startWide = this.wide;
                d.on('mouseMove', function (e) {
                    var me = e;
                    var diff = 0;
                    if (_this.side == Side.TOP) {
                        diff = me.clientY - start.y;
                    }
                    else if (_this.side == Side.BOTTOM) {
                        diff = -me.clientY + start.y;
                    }
                    else if (_this.side == Side.LEFT) {
                        diff = me.clientX - start.x;
                    }
                    else if (_this.side == Side.RIGHT) {
                        diff = -me.clientX + start.x;
                    }
                    _this.wide = startWide + diff;
                });
                d.on('mouseUp', function (e) {
                });
            };
            ;
            SplitView.prototype.updateUi = function () {
                _super.prototype.updateUi.call(this);
                var container = {
                    top: null,
                    left: null,
                    right: null,
                    bottom: null,
                    width: null,
                    height: null
                };
                var sideBar = {
                    top: null,
                    left: null,
                    right: null,
                    bottom: null,
                    width: null,
                    height: null
                };
                var spt = {
                    top: null,
                    left: null,
                    right: null,
                    bottom: null,
                    width: null,
                    height: null
                };
                var size = this.wide.px;
                var vertical = this.side == Side.LEFT || this.side == Side.RIGHT;
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
                for (var p in container)
                    this.container.style[p] = container[p];
                for (var p in sideBar)
                    this.sideContainer.style[p] = sideBar[p];
                for (var p in spt)
                    this.splitter.style[p] = spt[p];
                this.splitter.ensureClass('vertical', vertical);
            };
            SplitView.prototype.didSet = function (e) {
                var _this = this;
                _super.prototype.didSet.call(this, e);
                if (e.property == 'sideView') {
                    if (e.oldValue) {
                        e.oldValue.ifPresent(function (v) { return v.removeFromParent(); });
                    }
                    this.sideContainer.clear();
                    this.sideView.ifPresent(function (v) { return _this.sideContainer.add(v); });
                }
            };
            SplitView.prototype.onEvent = function (name, args) {
                var _this = this;
                _super.prototype.onEvent.call(this, name, args);
                if (name == 'attach') {
                    this.add(this.sideContainer);
                    this.add(this.splitter);
                    this.splitter.addEventListener('mousedown', function (e) { return _this.splitter_MouseDown(e); });
                }
            };
            Object.defineProperty(SplitView.prototype, "sideView", {
                get: function () {
                    return this.getPropertyValue('sideView', Optional, undefined);
                },
                set: function (value) {
                    this.setPropertyValue('sideView', value, Optional);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SplitView.prototype, "splitterWide", {
                get: function () {
                    return this.getPropertyValue('splitterWide', Number, 5);
                },
                set: function (value) {
                    this.setPropertyValue('splitterWide', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SplitView.prototype, "sideContainer", {
                get: function () {
                    return this.getLazyProperty('sideContainer', DivElement, function () {
                        return new DivElement('side-container');
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SplitView.prototype, "splitter", {
                get: function () {
                    return this.getLazyProperty('splitter', DivElement, function () {
                        return new DivElement('splitter');
                    });
                },
                enumerable: true,
                configurable: true
            });
            return SplitView;
        }(AnchorView));
        ui.SplitView = SplitView;
        var ColorView = (function (_super) {
            __extends(ColorView, _super);
            function ColorView(c) {
                var _this = _super.call(this) || this;
                _this.raw.style.backgroundColor = c.toString();
                return _this;
            }
            ColorView.fromString = function (s) {
                return new ColorView(Color.fromHex(s));
            };
            return ColorView;
        }(View));
        ui.ColorView = ColorView;
        var ListView = (function (_super) {
            __extends(ListView, _super);
            function ListView() {
                return _super.call(this, 'list') || this;
            }
            return ListView;
        }(DivElement));
        ui.ListView = ListView;
        var Overlay = (function (_super) {
            __extends(Overlay, _super);
            function Overlay() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Overlay;
        }(DivElement));
        ui.Overlay = Overlay;
    })(ui = exports.ui || (exports.ui = {}));
});
