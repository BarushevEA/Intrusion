import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {E_Cells, IBackgroundMap, ICellScheme} from "./DimensionTypes";
import {GreenRectangle} from "../GreenRectangle";
import {GreenTriangle} from "../GreenTriangle/GreenTriangle";
import {BrickWall} from "../briks/BrickWall";
import {Cells, ExperimentalDraw} from "./DimensionUtils";

enum $ {
    NUL = 0,
    REC = 'REC',
    TRI = 'TRI',
    WAL = 'WAL'
}

enum ELayer {
    WORK = 'WORK',
    GREED = 'GREED',
    COPY = 'COPY'
}

let cells: IBackgroundMap = <any>0;

const scheme: ICellScheme = {};
scheme[$.REC] = <any>GreenRectangle;
scheme[$.TRI] = <any>GreenTriangle;
scheme[$.WAL] = <any>BrickWall;

let draw: ExperimentalDraw = <any>0;

export class DimensionBackground extends AbstractActor {
    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            // Math.round(canvas.height),
            // Math.round(canvas.width));
            400, 400);
        this.init();
    }

    init(): void {
        this.prepareCells();
        const layer = this.setVirtualLayer(ELayer.COPY, this.height, this.width);
        cells.setScheme(scheme, E_Cells.ACTOR_USE, layer);
        draw.render();
    }

    prepareCells(): void {
        cells = new Cells(100, 100, 4, 4);
        cells
            .replaceRectangleAt([<any>$.WAL], 0, 0, 4, 4)
            .addRowAt([<any>$.REC], 0, 0, 4)
            .add([<any>$.REC, $.NUL, $.NUL, $.REC], 0, 1)
            .add([<any>$.REC, $.NUL, $.NUL, $.REC], 0, 2)
            .addRowAt([<any>$.REC], 0, 3, 4);
        draw = new ExperimentalDraw(<any>0, cells, 0, 0);
    }

    renderFrame(): void {
        this.drawVirtualOnGeneral(ELayer.COPY, this.xPos, this.yPos);
    }
}
