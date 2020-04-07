define(["require", "exports", "./latte"], function (require, exports, latte_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var viewport;
    (function (viewport) {
        var Rectangle = latte_1.latte.Rectangle;
        function rectangle() {
            return new Rectangle(0, 0, window.innerWidth, window.innerHeight);
        }
        viewport.rectangle = rectangle;
        function onResize(e, callback) {
            window.addEventListener('resize', callback);
            e.on('detach', function () { return window.removeEventListener('resize', callback); });
        }
        viewport.onResize = onResize;
    })(viewport = exports.viewport || (exports.viewport = {}));
});
