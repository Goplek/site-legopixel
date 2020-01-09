define(["require", "exports", "./workspace", "./icon", "./imageutil", "./latte"], function (require, exports, workspace_1, icon_1, imageutil_1, latte_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Workspace = workspace_1.workspace.Workspace;
    var Icon = icon_1.icon.Icon;
    var IconIllustrator = icon_1.icon.IconIllustrator;
    var ImageFit = imageutil_1.imageutil.ImageFit;
    var Size = latte_1.latte.Size;
    var log = latte_1.latte.log;
    var Color = latte_1.latte.Color;
    exports.run = function () {
        var pal = Icon.legoPalette();
        var illustrator = new IconIllustrator(new Icon(Workspace.START_SIZE, Workspace.START_SIZE))
            .on('originalProcessed', function () { return applyFilters(); });
        var ws = new Workspace(illustrator).attachTo(document.body);
        var applyFilters = function () {
            var icon = illustrator.base.clone();
            icon.contrast(parseInt(ws.contrastSlider.value));
            icon.bright(parseInt(ws.brightnessSlider.value));
            icon.stickToPalette(pal);
            log(icon.colorStatistics(pal));
            illustrator.icon = icon;
        };
        var updateSize = function (size) {
            if (illustrator.original) {
                illustrator.original.resize({
                    size: size,
                    fit: ImageFit.AspectFill
                }, function (sized) {
                    illustrator.icon = Icon.fromStream(sized);
                    illustrator.saveBase();
                    applyFilters();
                });
            }
            else {
                illustrator.icon = new Icon(size.width, size.height);
            }
        };
        ws.brightnessSlider
            .initRange(-128, 128, 1, 0)
            .on('didSetValue', function () { return applyFilters(); });
        ws.contrastSlider
            .initRange(-255, 255, 1, 0)
            .on('didSetValue', function () { return applyFilters(); });
        ws.sizeSlider
            .initRange(32, 192, 32, Workspace.START_SIZE)
            .on('didSetValue', function () {
            var size = parseInt(ws.sizeSlider.value);
            updateSize(new Size(size, size));
        });
        ws.heightSlider
            .on('didSetValue', function () {
            updateSize(new Size(parseInt(ws.widthSlider.value), parseInt(ws.heightSlider.value)));
        })
            .initRange(32, 192, 1, Workspace.START_SIZE);
        ws.widthSlider
            .initRange(32, 192, 1, Workspace.START_SIZE)
            .on('didSetValue', function () {
            updateSize(new Size(parseInt(ws.widthSlider.value), parseInt(ws.heightSlider.value)));
        });
        ws.colorSlider
            .initRange(1, 6, 1, 6)
            .on('didSetValue', function () {
            switch (parseInt(ws.colorSlider.value)) {
                case 1:
                    pal = [Color.black, Color.white];
                    break;
                case 2:
                    pal = [Color.black, Color.white, Color.red];
                    break;
                case 3:
                    pal = [Color.black, Color.white, Color.red, Color.blue, Color.green];
                    break;
                case 4:
                    pal = [Color.black, Color.white, Color.red, Color.blue, Color.green,
                        Color.fromHex('ff0'), Color.fromHex('0ff'), Color.fromHex('f0f')];
                    break;
                case 5:
                    pal = [Color.black, Color.red, Color.white, Color.fromHex('A52A2A'),
                        Color.fromHex('ff0'), Color.fromHex('f7d89e'), Color.green, Color.fromHex('a2fb5f'),
                        Color.blue, Color.fromHex('52c8fd'), Color.fromHex('ccc'), Color.fromHex('777')
                    ];
                    break;
                case 6:
                    pal = Icon.legoPalette();
                    break;
            }
            applyFilters();
        });
    };
});
