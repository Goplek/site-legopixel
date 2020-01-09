import { workspace } from "./workspace";
import Workspace = workspace.Workspace;
import {icon} from "./icon";
import Icon = icon.Icon;
import IconIllustrator = icon.IconIllustrator;
import {imageutil} from "./imageutil";
import ImageFit = imageutil.ImageFit;
import {latte} from "./latte";
import Size = latte.Size;
import log = latte.log;
import Color = latte.Color;
import Illustrator = workspace.Illustrator;

export const run = () =>{

    let pal = Icon.legoPalette();

    // Icon illustrator
    let illustrator = new IconIllustrator(new Icon(Workspace.START_SIZE, Workspace.START_SIZE))
        .on('originalProcessed', () => applyFilters());

    // Workspace
    let ws = new Workspace(illustrator).attachTo(document.body);

    let applyFilters = () => {

        let icon = illustrator.base.clone();

        icon.contrast(parseInt(ws.contrastSlider.value));
        icon.bright(parseInt(ws.brightnessSlider.value));
        icon.stickToPalette(pal);
        log(icon.colorStatistics(pal));

        illustrator.icon = icon;
    };

    /**
     * Updates the size
     * @param {number} size
     */
    let updateSize = (size: Size) => {
        if(illustrator.original) {

            // Resize original
            illustrator.original.resize({
                size: size,
                fit: ImageFit.AspectFill

            }, sized => {

                illustrator.icon = Icon.fromStream(sized);
                illustrator.saveBase();

                applyFilters();

            });

        }else{
            illustrator.icon = new Icon(size.width, size.height);
        }
    };

    ws.brightnessSlider
        .initRange(-128, 128, 1, 0)
        .on('didSetValue', () => applyFilters());

    ws.contrastSlider
        .initRange(-255, 255, 1, 0)
        .on('didSetValue', () => applyFilters());

    ws.sizeSlider
        .initRange(32,192,32, Workspace.START_SIZE)
        .on('didSetValue', () => {
            let size = parseInt(ws.sizeSlider.value);
            updateSize(new Size(size, size));
        });

    ws.heightSlider
        .on('didSetValue', () => {
            updateSize(new Size(
                parseInt(ws.widthSlider.value),
                parseInt(ws.heightSlider.value)
            ));
        })
        .initRange(32,192,1, Workspace.START_SIZE);

    ws.widthSlider
        .initRange(32,192,1, Workspace.START_SIZE)
        .on('didSetValue', () => {
            updateSize(new Size(
                parseInt(ws.widthSlider.value),
                parseInt(ws.heightSlider.value)
            ));
        });

    ws.colorSlider
        .initRange(1,6,1, 6)
        .on('didSetValue', () => {

            switch(parseInt(ws.colorSlider.value)){
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
                    // ali palette
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

            // let newIcon = illustrator.base.clone();
            // newIcon.legolize(pal);
            //
            // illustrator.icon = newIcon;

        });
};

