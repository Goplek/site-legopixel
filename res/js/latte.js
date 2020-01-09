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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Object.defineProperty(Number.prototype, "px", {
        get: function () {
            return this + 'px';
        },
        enumerable: false,
        configurable: true
    });
    var latte;
    (function (latte) {
        function _camelCase(s) {
            var nextUpper = true;
            var result = "";
            var skip = false;
            if (s == null) {
                s = '';
            }
            s = String(s);
            if (s.length == 0) {
                return s;
            }
            for (var i = 0; i < s.length; i++) {
                if (skip) {
                    skip = false;
                    nextUpper = true;
                    continue;
                }
                else if (nextUpper) {
                    nextUpper = false;
                    result += s.charAt(i).toUpperCase();
                    continue;
                }
                else {
                    result += s.charAt(i);
                }
                if (i < s.length - 1) {
                    var chr = s.charAt(i + 1);
                    if (chr == ' ' || chr == '_') {
                        skip = true;
                    }
                }
            }
            return result;
        }
        latte._camelCase = _camelCase;
        function _isArray(param, minLength) {
            if (minLength === void 0) { minLength = 0; }
            return (param instanceof Array) && param.length >= minLength;
        }
        latte._isArray = _isArray;
        function _isBoolean(param) { return typeof param == 'boolean'; }
        latte._isBoolean = _isBoolean;
        function _isNumber(param) { return typeof param == 'number'; }
        latte._isNumber = _isNumber;
        function _isNumeric(param) {
            var allowed = "1234567890.";
            if (!_isString(param))
                param = String(param);
            if (param.length == 0) {
                return false;
            }
            else {
                for (var i = 0; i < param.length; i++)
                    if (allowed.indexOf(param.charAt(i)) < 0)
                        return false;
                return true;
            }
        }
        latte._isNumeric = _isNumeric;
        function _isString(param) { return typeof param == 'string'; }
        latte._isString = _isString;
        function _undef(param) { return typeof param == 'undefined'; }
        latte._undef = _undef;
        function _repeat(times, callback) {
            for (var i = 0; i < times; i++) {
                callback();
            }
        }
        latte._repeat = _repeat;
        function _zeroPad(n) {
            n = n || 0;
            return n <= 9 ? '0' + n.toString() : n.toString();
        }
        latte._zeroPad = _zeroPad;
        function _zeroFill(positions, n, chr) {
            if (positions === void 0) { positions = 2; }
            if (chr === void 0) { chr = '0'; }
            var s = String(n);
            var zeros = positions - s.length;
            if (zeros < 0)
                zeros = 0;
            var acc = '';
            _repeat(zeros, function () { return acc += '0'; });
            return acc + s;
        }
        latte._zeroFill = _zeroFill;
        function log() {
            var any = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                any[_i] = arguments[_i];
            }
            if (!_undef(console) && !_undef(console.log)) {
                if (arguments['length'] == 1) {
                    console.log(arguments[0]);
                }
                else {
                    console.log(sprintf.apply(this, arguments));
                }
            }
        }
        latte.log = log;
        function sprintf() {
            var any = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                any[_i] = arguments[_i];
            }
            var arg = 1, format = arguments[0], cur, next, result = [];
            for (var i = 0; i < format.length; i++) {
                cur = format.substr(i, 1);
                next = i == format.length - 1 ? '' : format.substr(i + 1, 1);
                if (cur == '%' && next == 's') {
                    result.push(arguments[arg++]);
                    i++;
                }
                else {
                    result.push(cur);
                }
            }
            return result.join('');
        }
        latte.sprintf = sprintf;
        var Side;
        (function (Side) {
            Side[Side["TOP"] = 0] = "TOP";
            Side[Side["RIGHT"] = 1] = "RIGHT";
            Side[Side["BOTTOM"] = 2] = "BOTTOM";
            Side[Side["LEFT"] = 3] = "LEFT";
        })(Side = latte.Side || (latte.Side = {}));
        var Orientation;
        (function (Orientation) {
            Orientation[Orientation["VERTICAL"] = 0] = "VERTICAL";
            Orientation[Orientation["HORIZONTAL"] = 1] = "HORIZONTAL";
        })(Orientation = latte.Orientation || (latte.Orientation = {}));
        var Eventable = (function () {
            function Eventable() {
                this.eventHandlers = {};
            }
            Eventable.prototype.on = function (eventName, handler) {
                if (!(eventName in this.eventHandlers)) {
                    this.eventHandlers[eventName] = [];
                }
                this.eventHandlers[eventName].push(handler);
                return this;
            };
            Eventable.prototype.onBeforeEvent = function (eventName, params) {
            };
            Eventable.prototype.onEvent = function (eventName, params) {
            };
            Eventable.prototype.raise = function (eventName) {
                var _this = this;
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                this.onBeforeEvent(eventName, params);
                if (eventName in this.eventHandlers) {
                    for (var name_1 in this.eventHandlers) {
                        this.eventHandlers[name_1].forEach(function (f) { return f.apply(_this, params); });
                    }
                }
                this.onEvent(eventName, params);
            };
            return Eventable;
        }());
        latte.Eventable = Eventable;
        var Any = (function () {
            function Any() {
            }
            return Any;
        }());
        latte.Any = Any;
        var PropertyTarget = (function (_super) {
            __extends(PropertyTarget, _super);
            function PropertyTarget() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.propertyValues = {};
                return _this;
            }
            PropertyTarget.getStaticObject = function (eventObj) {
                if (!('staticProperties' in eventObj)) {
                    eventObj.staticProperties = new PropertyTarget();
                }
                return eventObj.staticProperties;
            };
            PropertyTarget.getStaticPropertyValue = function (classObj, name, validator, withDefault) {
                if (withDefault === void 0) { withDefault = undefined; }
                return PropertyTarget.getStaticObject(classObj).getPropertyValue(name, validator, withDefault);
            };
            PropertyTarget.hasStaticPropertyValue = function (className, name) {
                return PropertyTarget.getStaticObject(className).hasPropertyValue(name);
            };
            PropertyTarget.setStaticPropertyValue = function (className, name, validator, value, options) {
                if (options === void 0) { options = {}; }
                return PropertyTarget.getStaticObject(className).setPropertyValue(name, value, validator, options);
            };
            PropertyTarget.getStaticLazyProperty = function (className, name, validator, creator) {
                return PropertyTarget.getStaticObject(className).getLazyProperty(name, validator, creator);
            };
            PropertyTarget.prototype.willSet = function (e) {
                this.raise('willSet' + _camelCase(e.property), e);
            };
            PropertyTarget.prototype.didSet = function (e) {
                this.raise('didSet' + _camelCase(e.property), e);
            };
            PropertyTarget.prototype.valid = function (value, validator) {
                if (validator === null) {
                    return true;
                }
                if (validator === Number) {
                    return _isNumber(value);
                }
                else if (validator === Boolean) {
                    return _isBoolean(value);
                }
                else if (validator === String) {
                    return _isString(value);
                }
                else if (validator === Any) {
                    return true;
                }
                else {
                    return value instanceof validator;
                }
                return true;
            };
            PropertyTarget.prototype.deleteProperty = function (name) {
                if (name in this.propertyValues) {
                    delete this.propertyValues[name];
                }
            };
            PropertyTarget.prototype.getPropertyValue = function (name, validator, withDefault) {
                if (!(name in this.propertyValues)) {
                    this.propertyValues[name] = withDefault;
                }
                return this.propertyValues[name];
            };
            PropertyTarget.prototype.getLazyProperty = function (name, validator, creator) {
                if (!(name in this.propertyValues)) {
                    this.propertyValues[name] = creator();
                }
                return this.getPropertyValue(name, validator, undefined);
            };
            PropertyTarget.prototype.hasPropertyValue = function (name) {
                return name in this.propertyValues;
            };
            PropertyTarget.prototype.setPropertyValue = function (name, value, validator, options) {
                if (options === void 0) { options = {}; }
                var oldValue = this.getPropertyValue(name, validator, undefined);
                var data = {
                    property: name,
                    oldValue: oldValue,
                    newValue: value
                };
                this.willSet(data);
                var changed = oldValue !== data.newValue;
                if (!this.valid(data.newValue, validator)) {
                    throw "Invalid property value";
                }
                if (changed) {
                    this.propertyValues[name] = data.newValue;
                    if (options.silent !== true) {
                        this.didSet(data);
                    }
                }
                return value;
            };
            PropertyTarget.prototype.setPropertyUnsafe = function (name, value) {
                this.propertyValues[name] = value;
                return value;
            };
            PropertyTarget.prototype.setPropertyValues = function (values) {
                for (var i in values) {
                    this.setPropertyValue(i, values[i], null);
                }
                return this;
            };
            return PropertyTarget;
        }(Eventable));
        latte.PropertyTarget = PropertyTarget;
        var Optional = (function (_super) {
            __extends(Optional, _super);
            function Optional(value) {
                var _this = _super.call(this) || this;
                _this.value = value;
                return _this;
            }
            Optional.empty = function () {
                return new Optional(null);
            };
            Optional.of = function (value) {
                return new Optional(value);
            };
            Optional.prototype.elseDo = function (callback) {
                if (!this.isPresent) {
                    callback();
                }
                return this;
            };
            Optional.prototype.ifPresent = function (callback) {
                if (this.isPresent) {
                    callback(this.value);
                }
                return this;
            };
            Optional.prototype.orElse = function (value) {
                if (this.isPresent) {
                    return this.value;
                }
                else {
                    return value;
                }
            };
            Optional.prototype.orThrow = function (ex) {
                if (ex === void 0) { ex = "Value Needed"; }
                if (!this.isPresent) {
                    throw ex;
                }
                return this.value;
            };
            Object.defineProperty(Optional.prototype, "isPresent", {
                get: function () {
                    return this.value !== null;
                },
                enumerable: true,
                configurable: true
            });
            return Optional;
        }(PropertyTarget));
        latte.Optional = Optional;
        var Color = (function (_super) {
            __extends(Color, _super);
            function Color(r, g, b, a) {
                if (r === void 0) { r = 0; }
                if (g === void 0) { g = 0; }
                if (b === void 0) { b = 0; }
                if (a === void 0) { a = 255; }
                var _this = _super.call(this) || this;
                _this.r = r;
                _this.g = g;
                _this.b = b;
                _this.a = a;
                return _this;
            }
            Color.combine = function () {
                var colors = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    colors[_i] = arguments[_i];
                }
                var avg = function (nums) { return Math.round(nums.reduce(function (acc, cur) { return cur + acc; }) / nums.length); };
                return new Color(avg(colors.map(function (c) { return c.r; })), avg(colors.map(function (c) { return c.g; })), avg(colors.map(function (c) { return c.b; })));
            };
            Color.fromHex = function (hexColor) {
                if (!_isString(hexColor) || hexColor.length == 0)
                    throw "Invalid Hex: " + hexColor;
                if (hexColor.charAt(0) == '#')
                    hexColor = hexColor.substr(1);
                if (!(hexColor.length == 3 || hexColor.length == 6 || hexColor.length == 8))
                    throw "Invalid Hex: " + hexColor;
                var c = new latte.Color();
                var toDecimal = function (hex) { return parseInt(hex, 16); };
                if (hexColor.length == 3) {
                    c.r = (toDecimal(hexColor.charAt(0) + hexColor.charAt(0)));
                    c.g = (toDecimal(hexColor.charAt(1) + hexColor.charAt(1)));
                    c.b = (toDecimal(hexColor.charAt(2) + hexColor.charAt(2)));
                }
                else {
                    c.r = (toDecimal(hexColor.charAt(0) + hexColor.charAt(1)));
                    c.g = (toDecimal(hexColor.charAt(2) + hexColor.charAt(3)));
                    c.b = (toDecimal(hexColor.charAt(4) + hexColor.charAt(5)));
                    if (hexColor.length == 8)
                        c.a = (toDecimal(hexColor.charAt(6) + hexColor.charAt(7)));
                }
                return c;
            };
            Color.fromInt32 = function (n) {
                return new Color(n & 0xff, (n & 0xff00) >>> 8, (n & 0xff0000) >>> 16, (n & 0xFF000000) >>> 24);
            };
            Color.cmykToRgb = function (c, m, y, k) {
                return [
                    Math.round(255 * (1 - c) * (1 - k)),
                    Math.round(255 * (1 - m) * (1 - k)),
                    Math.round(255 * (1 - y) * (1 - k))
                ];
            };
            Color.hsvToRgb = function (h, s, v) {
                var r, g, b;
                var i;
                var f, p, q, t;
                h = Math.max(0, Math.min(360, h));
                s = Math.max(0, Math.min(100, s));
                v = Math.max(0, Math.min(100, v));
                if (s == 0) {
                    r = g = b = v;
                    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
                }
                h /= 60;
                i = Math.floor(h);
                f = h - i;
                p = v * (1 - s);
                q = v * (1 - s * f);
                t = v * (1 - s * (1 - f));
                switch (i) {
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
                    default:
                        r = v;
                        g = p;
                        b = q;
                }
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            };
            Color.rgbToCmyk = function (red, green, blue) {
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
                ];
            };
            Color.rgbToHsv = function (red, green, blue) {
                var rr, gg, bb;
                var r = red / 255;
                var g = green / 255;
                var b = blue / 255;
                var h = 0;
                var s = 0;
                var v = Math.max(r, g, b);
                var diff = v - Math.min(r, g, b);
                var diffc = function (c) { return (v - c) / 6 / diff + 1 / 2; };
                if (diff == 0) {
                    h = s = 0;
                }
                else {
                    s = diff / v;
                    rr = diffc(r);
                    gg = diffc(g);
                    bb = diffc(b);
                    if (r === v) {
                        h = bb - gg;
                    }
                    else if (g === v) {
                        h = (1 / 3) + rr - bb;
                    }
                    else if (b === v) {
                        h = (2 / 3) + gg - rr;
                    }
                }
                if (h < 0) {
                    h += 1;
                }
                else if (h > 1) {
                    h -= 1;
                }
                return [
                    Math.round(h * 360),
                    Math.round(s),
                    Math.round(v)
                ];
            };
            Object.defineProperty(Color, "black", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Color, 'black', Color, function () {
                        return new Color(0, 0, 0);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color, "white", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Color, 'white', Color, function () {
                        return new Color(255, 255, 255);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color, "red", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Color, 'red', Color, function () {
                        return new Color(255, 0, 0);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color, "green", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Color, 'green', Color, function () {
                        return new Color(0, 128, 0);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color, "blue", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Color, 'blue', Color, function () {
                        return new Color(0, 0, 255);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color, "transparent", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Color, 'transparent', Color, function () {
                        return new Color(0, 0, 0, 0);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Color.prototype.equals = function (c) {
                return c.a == this.a && c.r === this.r && c.g === this.g && c.b === this.b;
            };
            Color.prototype.fade = function (alpha) {
                return new Color(this.r, this.g, this.b, alpha);
            };
            Color.prototype.fadeFloat = function (alphaFloat) {
                return new Color(this.r, this.g, this.b, alphaFloat * 255);
            };
            Color.prototype.toHexString = function () {
                var d = function (s) { if (s.length == 1)
                    return '0' + s; return s; };
                if (this.a != 255) {
                    return '#' + d(this.r.toString(16)) + d(this.g.toString(16)) + d(this.b.toString(16)) + d(this.a.toString(16));
                }
                else {
                    return '#' + d(this.r.toString(16)) + d(this.g.toString(16)) + d(this.b.toString(16));
                }
            };
            Color.prototype.toInt32 = function () {
                return (this.a << 24) |
                    (this.b << 16) |
                    (this.g << 8) |
                    this.r;
            };
            Color.prototype.toRgbString = function () {
                return sprintf('rgba(%s, %s, %s, %s)', this.r, this.g, this.b, this.a);
            };
            Color.prototype.toString = function () {
                if (this.isTransparent) {
                    return 'transparent';
                }
                else if (this.a != 255) {
                    return this.toRgbString();
                }
                else {
                    return this.toHexString();
                }
            };
            Object.defineProperty(Color.prototype, "a", {
                get: function () {
                    return this.getPropertyValue('a', Number, 255);
                },
                set: function (value) {
                    this.setPropertyValue('a', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "b", {
                get: function () {
                    return this.getPropertyValue('b', Number, 0);
                },
                set: function (value) {
                    this.setPropertyValue('b', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "c", {
                get: function () {
                    return (1 - (this.r / 255) - this.k) / (1 - this.k);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "g", {
                get: function () {
                    return this.getPropertyValue('g', Number, 0);
                },
                set: function (value) {
                    this.setPropertyValue('g', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "k", {
                get: function () {
                    return 1 - Math.max(this.r / 255, this.g / 255, this.b / 255);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "m", {
                get: function () {
                    return (1 - (this.g / 255) - this.k) / (1 - this.k);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "y", {
                get: function () {
                    return (1 - (this.b / 255) - this.k) / (1 - this.k);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "isDark", {
                get: function () {
                    return this.perceivedLuminosity > 0.5;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "isLight", {
                get: function () {
                    return this.perceivedLuminosity <= 0.5;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "isTransparent", {
                get: function () {
                    return this.a === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "perceivedLuminosity", {
                get: function () {
                    var a = 1 - (this.r * 0.299 + this.g * 0.587 + this.b * 0.114) / 255;
                    return a;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "r", {
                get: function () {
                    return this.getPropertyValue('r', Number, 0);
                },
                set: function (value) {
                    this.setPropertyValue('r', value, Number);
                },
                enumerable: true,
                configurable: true
            });
            return Color;
        }(PropertyTarget));
        latte.Color = Color;
        var TimeSpan = (function (_super) {
            __extends(TimeSpan, _super);
            function TimeSpan(days, hours, minutes, seconds, milliseconds) {
                if (days === void 0) { days = 0; }
                if (hours === void 0) { hours = 0; }
                if (minutes === void 0) { minutes = 0; }
                if (seconds === void 0) { seconds = 0; }
                if (milliseconds === void 0) { milliseconds = 0; }
                var _this = _super.call(this) || this;
                _this.millis = 0;
                if (days < 0 || hours < 0 || minutes < 0 || seconds < 0 || milliseconds < 0) {
                    throw "Parameters on constructor can't be negative";
                }
                _this.millis = (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
                if (!Number.isSafeInteger(_this.millis)) {
                    throw "Total milliseconds must be a safe integer";
                }
                return _this;
            }
            Object.defineProperty(TimeSpan, "MAX_VALUE", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(TimeSpan, 'MAX_VALUE', TimeSpan, function () {
                        return TimeSpan.fromMilliseconds(Number.MAX_SAFE_INTEGER);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan, "MIN_VALUE", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(TimeSpan, 'MIN_VALUE', TimeSpan, function () {
                        return TimeSpan.fromMilliseconds(Number.MIN_SAFE_INTEGER * -1).negate();
                    });
                },
                enumerable: true,
                configurable: true
            });
            TimeSpan.fromDays = function (days) {
                var negate = days < 0;
                var result = new TimeSpan(Math.abs(days));
                if (negate) {
                    result.negate();
                }
                return result;
            };
            TimeSpan.fromHours = function (hours) {
                var negate = hours < 0;
                var result = new TimeSpan(0, Math.abs(hours));
                if (negate) {
                    result.negate();
                }
                return result;
            };
            TimeSpan.fromMilliseconds = function (milliseconds) {
                var negate = milliseconds < 0;
                var t = new TimeSpan(0, 0, 0, 0, Math.abs(milliseconds));
                if (negate) {
                    t.negate();
                }
                return t;
            };
            TimeSpan.fromMinutes = function (minutes) {
                var negate = minutes < 0;
                var result = new TimeSpan(0, 0, Math.abs(minutes));
                if (negate) {
                    result.negate();
                }
                return result;
            };
            TimeSpan.fromSeconds = function (seconds) {
                var negate = seconds < 0;
                var result = new TimeSpan(0, 0, 0, Math.abs(seconds));
                if (negate) {
                    result.negate();
                }
                return result;
            };
            TimeSpan.fromString = function (timeString) {
                var parts = timeString.split(':');
                if (parts.length !== 3) {
                    throw "Wrong format: [D] hh:mm:ss[.millis]";
                }
                var negate = timeString.trim().indexOf('-') === 0;
                var first = parts[0];
                var middle = parts[1];
                var last = parts[2];
                var days = 0;
                var hours = 0;
                var minutes = parseInt(middle, 10);
                var seconds = 0;
                var milliseconds = 0;
                if (first.indexOf(' ') >= 0) {
                    var firstParts = first.split(' ');
                    if (firstParts.length != 2)
                        throw "Invalid format of first part: Days + space + hours";
                    days = parseInt(firstParts[0], 10);
                    hours = parseInt(firstParts[1], 10);
                }
                else {
                    hours = parseInt(first, 10);
                }
                if (last.indexOf('.') >= 0) {
                    var lastParts = last.split('.');
                    if (lastParts.length != 2)
                        throw "Invalid format of last part: Seconds + dot + milliseconds";
                    seconds = parseInt(lastParts[0], 10);
                    milliseconds = parseInt(lastParts[1], 10) * 100;
                }
                else {
                    seconds = parseInt(last, 10);
                }
                var result = new TimeSpan(days, hours, minutes, seconds, milliseconds);
                if (negate) {
                    result.negate();
                }
                return result;
            };
            TimeSpan.timeSince = function (d) {
                return DateTime.now.subtractDate(d);
            };
            TimeSpan.prototype._rounder = function (number) {
                if (this.millis < 0)
                    return Math.ceil(number);
                return Math.floor(number);
            };
            TimeSpan.prototype._zeroPad = function (n) {
                return n <= 9 ? '0' + n.toString() : n.toString();
            };
            TimeSpan.prototype.add = function (timespan) {
                return TimeSpan.fromMilliseconds(this.millis + timespan.millis);
            };
            TimeSpan.prototype.addHours = function (hours) {
                return this.add(new TimeSpan(0, hours));
            };
            TimeSpan.prototype.addMinutes = function (minutes) {
                return this.add(new TimeSpan(0, 0, minutes));
            };
            TimeSpan.prototype.addSeconds = function (seconds) {
                return this.add(new TimeSpan(0, 0, 0, seconds));
            };
            TimeSpan.prototype.compareTo = function (timespan) {
                return this.millis - timespan.millis;
            };
            TimeSpan.prototype.equals = function (timespan) {
                return this.millis == timespan.millis;
            };
            TimeSpan.prototype.negate = function () {
                this.millis *= -1;
                return this;
            };
            TimeSpan.prototype.subtract = function (timespan) {
                return TimeSpan.fromMilliseconds(this.millis - timespan.millis);
            };
            TimeSpan.prototype.toString = function (includeMilliseconds) {
                if (includeMilliseconds === void 0) { includeMilliseconds = false; }
                return (this.millis < 0 ? '-' : '') +
                    (this.days ? Math.abs(this.days) + ' ' : '') +
                    this._zeroPad(Math.abs(this.hours)) + ":" +
                    this._zeroPad(Math.abs(this.minutes)) + ':' +
                    this._zeroPad(Math.abs(this.seconds)) +
                    (includeMilliseconds ? '.' + _zeroFill(3, Math.abs(this.milliseconds)) : '');
            };
            TimeSpan.prototype.valueOf = function () {
                return this.millis;
            };
            Object.defineProperty(TimeSpan.prototype, "days", {
                get: function () {
                    return this._rounder(this.millis / 86400000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "hours", {
                get: function () {
                    return this._rounder((this.millis % (24 * 3600 * 1000)) / (3600 * 1000));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "isEmpty", {
                get: function () {
                    return this.millis == 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "milliseconds", {
                get: function () {
                    return this._rounder(this.millis % 1000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "minutes", {
                get: function () {
                    return this._rounder((this.millis % (3600 * 1000)) / (60 * 1000));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "seconds", {
                get: function () {
                    return this._rounder((this.millis % 60000) / 1000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "totalDays", {
                get: function () {
                    return this.millis / (86400000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "totalHours", {
                get: function () {
                    return this.millis / (3600000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "totalMilliseconds", {
                get: function () {
                    return this.millis;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "totalMinutes", {
                get: function () {
                    return this.millis / (60 * 1000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TimeSpan.prototype, "totalSeconds", {
                get: function () {
                    return this.millis / 1000;
                },
                enumerable: true,
                configurable: true
            });
            return TimeSpan;
        }(PropertyTarget));
        latte.TimeSpan = TimeSpan;
        var DateTime = (function (_super) {
            __extends(DateTime, _super);
            function DateTime(year, month, day, hour, minute, second, millisecond) {
                if (year === void 0) { year = 1; }
                if (month === void 0) { month = 1; }
                if (day === void 0) { day = 1; }
                if (hour === void 0) { hour = 0; }
                if (minute === void 0) { minute = null; }
                if (second === void 0) { second = null; }
                if (millisecond === void 0) { millisecond = null; }
                var _this = _super.call(this) || this;
                if (year <= 0 || month <= 0 || day <= 0) {
                    throw "No argument can be <= 0";
                }
                var days = DateTime.absoluteDays(year, month, day);
                _this._span = new TimeSpan(days, hour, minute, second, millisecond);
                return _this;
            }
            Object.defineProperty(DateTime, "MAX_VALUE", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(DateTime, 'MAX_VALUE', DateTime, function () {
                        return DateTime.fromMilliseconds(Number.MAX_SAFE_INTEGER);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime, "MIN_VALUE", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(DateTime, 'MIN_VALUE', DateTime, function () {
                        return new DateTime(1, 1, 1);
                    });
                },
                enumerable: true,
                configurable: true
            });
            DateTime.absoluteDays = function (year, month, day) {
                var div = function (a, b) { return Math.floor(a / b); };
                var arr = DateTime.isLeapYear(year) ?
                    [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366] :
                    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
                var num = year - 1;
                return ((((((num * 365) + div(num, 4)) - div(num, 100)) + div(num, 400)) + arr[month - 1]) + day) - 1;
            };
            DateTime.daysInMonth = function (year, month) {
                if (DateTime.isLeapYear(year)) {
                    return DateTime.monthDaysLeapYear[month];
                }
                else {
                    return DateTime.monthDays[month];
                }
            };
            DateTime.fromDateAndTime = function (date, time) {
                return new DateTime(date.year, date.month, date.day, time.hours, time.minutes, time.seconds, time.milliseconds);
            };
            DateTime.fromMilliseconds = function (milliseconds) {
                var d = new DateTime();
                d._span = TimeSpan.fromMilliseconds(milliseconds);
                return d;
            };
            DateTime.fromString = function (dateTimeString) {
                if (dateTimeString.length === 0)
                    throw "Invalid date format";
                var year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;
                var parts = dateTimeString.split(' ');
                var dateParts = parts.length > 0 ? parts[0].split('-') : [];
                var timeOfDay = parts.length > 1 ? TimeSpan.fromString(parts[1]) : new TimeSpan();
                if (dateParts.length === 3) {
                    year = parseInt(dateParts[0], 10);
                    month = parseInt(dateParts[1], 10);
                    day = parseInt(dateParts[2], 10);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        throw "Date has invalid numbers";
                    }
                }
                else {
                    throw "Invalid date format";
                }
                hour = timeOfDay.hours;
                minute = timeOfDay.minutes;
                second = timeOfDay.seconds;
                if (year <= 0 || month <= 0 || day < 0)
                    throw "Date components can't be lower than one.";
                return new DateTime(year, month, day, hour, minute, second);
            };
            DateTime.isLeapYear = function (year) {
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                    return true;
                }
                return false;
            };
            Object.defineProperty(DateTime, "now", {
                get: function () {
                    var d = new Date();
                    return new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime, "today", {
                get: function () {
                    var d = new Date();
                    return new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime, "tomorrow", {
                get: function () {
                    var d = new Date();
                    return (new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate())).addDays(1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime, "epoch", {
                get: function () {
                    return new DateTime(1970, 1, 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime, "yesterday", {
                get: function () {
                    var d = new Date();
                    return (new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate())).addDays(-1);
                },
                enumerable: true,
                configurable: true
            });
            DateTime.prototype.fromTimeSpan = function (what) {
                var div = function (a, b) { return Math.floor(a / b); };
                var num2 = this._span.days;
                var num3 = div(num2, 146097);
                num2 -= num3 * 146097;
                var num4 = div(num2, 36524);
                if (num4 == 4) {
                    num4 = 3;
                }
                num2 -= num4 * 36524;
                var num5 = div(num2, 1461);
                num2 -= num5 * 1461;
                var num6 = div(num2, 365);
                if (num6 == 4) {
                    num6 = 3;
                }
                if (what == "year") {
                    return (((((num3 * 400) + (num4 * 100)) + (num5 * 4)) + num6) + 1);
                }
                num2 -= num6 * 365;
                if (what == "dayyear") {
                    return (num2 + 1);
                }
                var arr = ((num6 == 3) && ((num5 != 24) || (num4 == 3))) ?
                    [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366] :
                    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
                var index = num2 >> 6;
                while (num2 >= arr[index]) {
                    index++;
                }
                if (what == "month") {
                    return index;
                }
                return ((num2 - arr[index - 1]) + 1);
            };
            DateTime.prototype.add = function (timespan) {
                return DateTime.fromMilliseconds(this._span.millis + timespan.millis);
            };
            DateTime.prototype.addDays = function (days) {
                return DateTime.fromMilliseconds(this._span.millis + days * 86400000);
            };
            DateTime.prototype.addHours = function (hours) {
                return DateTime.fromMilliseconds(this._span.millis + hours * 3600000);
            };
            DateTime.prototype.addMilliseconds = function (milliseconds) {
                return DateTime.fromMilliseconds(this._span.millis + milliseconds);
            };
            DateTime.prototype.addMinutes = function (minutes) {
                return DateTime.fromMilliseconds(this._span.millis + minutes * 60000);
            };
            DateTime.prototype.addMonths = function (months) {
                var year = this.year;
                var month = this.month;
                var day = this.day;
                var newMonth = month - 1 + months;
                if (newMonth < 0) {
                    month = 12 + (newMonth + 1) % 12;
                    year += Math.ceil((newMonth - 11) / 12);
                }
                else {
                    month = newMonth % 12 + 1;
                    year += Math.floor(newMonth / 12);
                }
                if (year < 1 || year > 9999) {
                    throw "Invalid 'months'";
                }
                else {
                    var daysInMonth = DateTime.daysInMonth(year, month);
                    if (day > daysInMonth)
                        day = daysInMonth;
                    return new DateTime(year, month, day);
                }
            };
            DateTime.prototype.addSeconds = function (seconds) {
                return DateTime.fromMilliseconds(this._span.millis + seconds * 1000);
            };
            DateTime.prototype.addYears = function (years) {
                return this.addMonths(years * 12);
            };
            DateTime.prototype.compareTo = function (datetime) {
                return this._span.compareTo(datetime._span);
            };
            DateTime.prototype.equals = function (datetime) {
                return this._span.equals(datetime._span);
            };
            DateTime.prototype.onRange = function (start, end) {
                return this.compareTo(start) >= 0 && this.compareTo(end) <= 0;
            };
            DateTime.prototype.subtractDate = function (datetime) {
                return TimeSpan.fromMilliseconds(this._span.millis - datetime._span.millis);
            };
            DateTime.prototype.subtractTime = function (timespan) {
                return DateTime.fromMilliseconds(this._span.millis - timespan.millis);
            };
            DateTime.prototype.toMilliseconds = function () {
                return this._span.totalMilliseconds;
            };
            DateTime.prototype.toString = function (includeTime) {
                if (includeTime === void 0) { includeTime = true; }
                if (isNaN(this.year))
                    return '';
                var t = this.timeOfDay;
                var r = this.year + '-' + _zeroPad(this.month) + '-' + _zeroPad(this.day);
                if (includeTime) {
                    r += ' ' + _zeroPad(t.hours) + ":" + _zeroPad(t.minutes) + ':'
                        + _zeroPad(t.seconds);
                }
                return r;
            };
            DateTime.prototype.valueOf = function () {
                if (!this.thisEpoch) {
                    return 0;
                }
                else {
                    return this._span.millis;
                }
            };
            Object.defineProperty(DateTime.prototype, "day", {
                get: function () {
                    return this.fromTimeSpan("day");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "dayOfWeek", {
                get: function () {
                    return (this._span.days + 1) % 7;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "dayOfYear", {
                get: function () {
                    return this.fromTimeSpan("dayyear");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "date", {
                get: function () {
                    return new DateTime(this.year, this.month, this.day);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "hour", {
                get: function () {
                    return this._span.hours;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "millisecond", {
                get: function () {
                    return this._span.milliseconds;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "minute", {
                get: function () {
                    return this._span.minutes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "month", {
                get: function () {
                    return this.fromTimeSpan("month");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "second", {
                get: function () {
                    return this._span.seconds;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "timeOfDay", {
                get: function () {
                    return TimeSpan.fromMilliseconds(this._span.millis % 86400000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "thisEpoch", {
                get: function () {
                    return this.compareTo(new DateTime(2, 1, 1)) > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "weekOfYear", {
                get: function () {
                    var oneJan = new DateTime(this.year, 1, 1);
                    return Math.ceil((this.dayOfYear + oneJan.dayOfWeek) / 7);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DateTime.prototype, "year", {
                get: function () {
                    return this.fromTimeSpan("year");
                },
                enumerable: true,
                configurable: true
            });
            DateTime.monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            DateTime.monthDaysLeapYear = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return DateTime;
        }(PropertyTarget));
        latte.DateTime = DateTime;
        var OldEventHandler = (function () {
            function OldEventHandler(handler, context) {
                this.handler = handler;
                this.context = context;
            }
            return OldEventHandler;
        }());
        var LatteEvent_deprecated = (function () {
            function LatteEvent_deprecated(context) {
                this.context = context;
                this.handlers = [];
            }
            Object.defineProperty(LatteEvent_deprecated.prototype, "handlerAdded", {
                get: function () {
                    if (!this._handlerAdded) {
                        this._handlerAdded = new LatteEvent_deprecated(this);
                    }
                    return this._handlerAdded;
                },
                enumerable: true,
                configurable: true
            });
            LatteEvent_deprecated.prototype.add = function (handler, context) {
                if (context === void 0) { context = null; }
                this.handlers.push(new OldEventHandler(handler, context));
                this.onHandlerAdded(handler);
            };
            LatteEvent_deprecated.prototype.onHandlerAdded = function (handler) {
                this.handlerAdded.raise(handler);
            };
            LatteEvent_deprecated.prototype.raise = function () {
                var parameter = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameter[_i] = arguments[_i];
                }
                var args = arguments;
                for (var i = 0; i < this.handlers.length; i++) {
                    var evh = this.handlers[i];
                    if (!evh.handler)
                        continue;
                    var result = evh.handler.apply(evh.context || this.context, args);
                    if (typeof result == 'boolean') {
                        return result;
                    }
                }
            };
            LatteEvent_deprecated.prototype.remove = function (handler) {
                var index = -1;
                this.handlers.forEach(function (h, i) {
                    if (h.handler == handler) {
                        index = i;
                    }
                });
                if (index >= 0) {
                    this.handlers.splice(index, 1);
                }
            };
            return LatteEvent_deprecated;
        }());
        latte.LatteEvent_deprecated = LatteEvent_deprecated;
        var Point = (function (_super) {
            __extends(Point, _super);
            function Point(x, y) {
                if (x === void 0) { x = null; }
                if (y === void 0) { y = null; }
                var _this = _super.call(this) || this;
                _this.setPropertyValue('x', x, Number);
                _this.setPropertyValue('y', y, Number);
                return _this;
            }
            Point.distance = function (a, b) {
                return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
            };
            Object.defineProperty(Point, "origin", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Point, 'origin', Point, function () {
                        return new Point(0, 0);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Point.prototype.distanceTo = function (p) {
                return Point.distance(this, p);
            };
            Point.prototype.equals = function (p) {
                return this.x == p.x && p.y == this.y;
            };
            Point.prototype.offset = function (x, y) {
                return new Point(this.x + x, this.y + y);
            };
            Point.prototype.round = function () {
                return new Point(Math.round(this.x), Math.round(this.y));
            };
            Point.prototype.toString = function () {
                return sprintf("(%s, %s)", this.x, this.y);
            };
            Object.defineProperty(Point.prototype, "isOrigin", {
                get: function () {
                    return this.x === 0 && this.y === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "x", {
                get: function () {
                    return this.getPropertyValue('x', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "y", {
                get: function () {
                    return this.getPropertyValue('y', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            return Point;
        }(PropertyTarget));
        latte.Point = Point;
        var Size = (function (_super) {
            __extends(Size, _super);
            function Size(width, height) {
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                var _this = _super.call(this) || this;
                _this.setPropertyValue('width', width, Number);
                _this.setPropertyValue('height', height, Number);
                return _this;
            }
            Object.defineProperty(Size, "empty", {
                get: function () {
                    return PropertyTarget.getStaticLazyProperty(Size, 'empty', Size, function () {
                        return new Size(0, 0);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Size.prototype.contains = function (size) {
                return this.width >= size.width && this.height >= size.height;
            };
            Size.prototype.equals = function (s) {
                return this.width == s.width && this.height == s.height;
            };
            Size.prototype.inflate = function (width, height) {
                return new Size(this.width + width, this.height + height);
            };
            Size.prototype.inflateUniform = function (wide) {
                return new Size(this.width + wide, this.height + wide);
            };
            Size.prototype.round = function () {
                return new Size(Math.round(this.width), Math.round(this.height));
            };
            Size.prototype.scaleToFit = function (target) {
                var dh = target.width * this.height / this.width;
                if (dh > target.height) {
                    return new Size(target.height * this.width / this.height, target.height);
                }
                return new Size(target.width, dh);
            };
            Size.prototype.scaleToFill = function (target) {
                var dh = target.width * this.height / this.width;
                if (dh <= target.height) {
                    return new Size(target.height * this.width / this.height, target.height);
                }
                return new Size(target.width, dh);
            };
            Size.prototype.toString = function () {
                return sprintf("(%s, %s)", this.width, this.height);
            };
            Object.defineProperty(Size.prototype, "area", {
                get: function () {
                    return this.width * this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "isEmpty", {
                get: function () {
                    return this.width === 0 || this.height === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "isHorizontal", {
                get: function () {
                    return this.width > this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "isSquare", {
                get: function () {
                    return this.width == this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "isVertical", {
                get: function () {
                    return this.height > this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "height", {
                get: function () {
                    return this.getPropertyValue('height', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Size.prototype, "width", {
                get: function () {
                    return this.getPropertyValue('width', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            return Size;
        }(PropertyTarget));
        latte.Size = Size;
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            function Rectangle(left, top, width, height) {
                if (left === void 0) { left = 0; }
                if (top === void 0) { top = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                var _this = _super.call(this) || this;
                _this.setPropertyValue('top', top, Number);
                _this.setPropertyValue('left', left, Number);
                _this.setPropertyValue('width', width, Number);
                _this.setPropertyValue('height', height, Number);
                return _this;
            }
            Object.defineProperty(Rectangle, "zero", {
                get: function () {
                    return new Rectangle();
                },
                enumerable: true,
                configurable: true
            });
            Rectangle.fromLRTB = function (left, right, top, bottom) {
                return new Rectangle(left, top, right - left, bottom - top);
            };
            Rectangle.fromObject = function (obj) {
                'left,top,width,height'.split(',').forEach(function (p) {
                    if (!(p in obj)) {
                        throw "Missing " + p + " property";
                    }
                });
                return new Rectangle(obj.left, obj.top, obj.width, obj.height);
            };
            Rectangle.fromObjectLRTB = function (obj) {
                'left,right,top,bottom'.split(',').forEach(function (p) {
                    if (!(p in obj)) {
                        throw "Missing " + p + " property";
                    }
                });
                return Rectangle.fromLRTB(obj.left, obj.right, obj.top, obj.bottom);
            };
            Rectangle.fromElement = function (e) {
                return Rectangle.fromObject(e.getBoundingClientRect());
            };
            Rectangle.prototype.absolute = function () {
                var width = Math.abs(this.width);
                var height = Math.abs(this.height);
                var left = this.width < 0 ? this.right : this.left;
                var top = this.height < 0 ? this.bottom : this.top;
                return new Rectangle(left, top, width, height);
            };
            Rectangle.prototype.ceil = function () {
                var r = Math.ceil;
                return new Rectangle(r(this.left), r(this.top), r(this.width), r(this.height));
            };
            Rectangle.prototype.centerOn = function (container) {
                return new Rectangle(container.left + (container.width - this.width) / 2, container.top + (container.height - this.height) / 2, this.width, this.height);
            };
            Rectangle.prototype.clone = function () {
                return new Rectangle(this.left, this.top, this.width, this.height);
            };
            Rectangle.prototype.contains = function (x, y) {
                return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
            };
            Rectangle.prototype.containsPoint = function (point) {
                return this.contains(point.x, point.y);
            };
            Rectangle.prototype.containsRectangle = function (rectangle) {
                return this.contains(rectangle.left, rectangle.top) && this.contains(rectangle.right, rectangle.bottom);
            };
            Rectangle.prototype.equals = function (r) {
                if (!r)
                    return false;
                return this.left === r.left && this.top === this.top && this.width === r.width && this.height === r.height;
            };
            Rectangle.prototype.floor = function () {
                var r = Math.floor;
                return new Rectangle(r(this.left), r(this.top), r(this.width), r(this.height));
            };
            Rectangle.prototype.inflate = function (horizontal, vertical) {
                return Rectangle.fromLRTB(this.left - horizontal, this.right + horizontal, this.top - vertical, this.bottom + vertical);
            };
            Rectangle.prototype.intersection = function (rectangle) {
                var a = this;
                var b = rectangle;
                var x1 = Math.max(a.left, b.left);
                var x2 = Math.min(a.right, b.right);
                var y1 = Math.max(a.top, b.top);
                var y2 = Math.min(a.bottom, b.bottom);
                if (x2 >= x1 && y2 >= y1) {
                    return new Rectangle(x1, y1, x2 - x1, y2 - y1);
                }
                return Rectangle.zero;
            };
            Rectangle.prototype.intersects = function (rectangle) {
                var thisX = this.left;
                var thisY = this.top;
                var thisW = this.width;
                var thisH = this.height;
                var rectX = rectangle.left;
                var rectY = rectangle.top;
                var rectW = rectangle.width;
                var rectH = rectangle.height;
                return (rectX < thisX + thisW) && (thisX < (rectX + rectW)) && (rectY < thisY + thisH) && (thisY < rectY + rectH);
            };
            Rectangle.prototype.ofLocation = function (location) {
                return new Rectangle(location.x, location.y, this.width, this.height);
            };
            Rectangle.prototype.ofSize = function (size) {
                return new Rectangle(this.left, this.top, size.width, size.height);
            };
            Rectangle.prototype.round = function () {
                var r = Math.round;
                return new Rectangle(r(this.left), r(this.top), r(this.width), r(this.height));
            };
            Rectangle.prototype.scaleToFill = function (size) {
                return this.ofSize(this.size.scaleToFill(size));
            };
            Rectangle.prototype.scaleToFit = function (size) {
                return this.ofSize(this.size.scaleToFit(size));
            };
            Rectangle.prototype.scaleToHeight = function (height) {
                return new Rectangle(this.left, this.top, height * this.width / this.height, height);
            };
            Rectangle.prototype.scaleToWidth = function (width) {
                return new Rectangle(this.left, this.top, width, width * this.height / this.width);
            };
            Rectangle.prototype.toString = function () {
                return "Rectangle: " + [this.left, this.top, this.width, this.height].join(', ');
            };
            Rectangle.prototype.union = function (rectangle) {
                return Rectangle.fromLRTB(Math.min(this.left, rectangle.left), Math.max(this.right, rectangle.right), Math.min(this.top, rectangle.top), Math.max(this.bottom, rectangle.bottom));
            };
            Object.defineProperty(Rectangle.prototype, "area", {
                get: function () {
                    return this.size.area;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "aspectRatio", {
                get: function () {
                    return this.width / this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "bottom", {
                get: function () {
                    return this.top + this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "center", {
                get: function () {
                    return new Point(this.left + this.width / 2, this.top + this.height / 2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "height", {
                get: function () {
                    return this.getPropertyValue('height', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "isZero", {
                get: function () {
                    return this.size.isEmpty && this.location.isOrigin;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "isHorizontal", {
                get: function () {
                    return this.width > this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "isSquare", {
                get: function () {
                    return this.width == this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "isVertical", {
                get: function () {
                    return this.height > this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "left", {
                get: function () {
                    return this.getPropertyValue('left', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "location", {
                get: function () {
                    return new Point(this.left, this.top);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "right", {
                get: function () {
                    return this.left + this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "size", {
                get: function () {
                    return new Size(this.width, this.height);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "tag", {
                get: function () {
                    return this.getPropertyValue('tag', Any, null);
                },
                set: function (value) {
                    this.setPropertyValue('tag', value, Any);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "top", {
                get: function () {
                    return this.getPropertyValue('top', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "width", {
                get: function () {
                    return this.getPropertyValue('width', Number, null);
                },
                enumerable: true,
                configurable: true
            });
            return Rectangle;
        }(PropertyTarget));
        latte.Rectangle = Rectangle;
    })(latte = exports.latte || (exports.latte = {}));
});
