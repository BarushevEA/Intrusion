import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {E_Cells, IBackgroundMap, ICellDrawOptions, ICellScheme} from "./DimensionTypes";
import {GreenRectangle} from "../GreenRectangle";
import {GreenTriangle} from "../GreenTriangle/GreenTriangle";
import {BrickWall} from "../briks/BrickWall";
import {Cells, DrawHelper} from "./DimensionUtils";

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

let draw: DrawHelper = <any>0;
let layer: HTMLCanvasElement = <any>0;

export class DimensionBackground extends AbstractActor {
    constructor(canvas: HTMLCanvasElement, private options?: ICellDrawOptions) {
        super(
            canvas,
            // Math.round(canvas.height),
            // Math.round(canvas.width));
            500, 800);
        this.init();
    }

    init(): void {
        this.prepareCells();
        draw = new DrawHelper(<any>0, cells, 0, 0);
        this.options && (draw.options = this.options);
        layer = this.setVirtualLayer(ELayer.COPY, this.height, this.width);
        cells.setScheme(scheme, E_Cells.ACTOR_USE, layer);
        draw.render();
    }

    prepareCells(): void {
        cells = new Cells(100, 100, 5, 10);
        cells
            .fillWithActor(<any>[$.WAL])
            .addRowAt(<any>[$.REC], 1, 0, 8)
            .addRowAt(<any>[$.REC], 1, 4, 8)
            .addColumnAt(<any>[$.REC], 0, 0, 5)
            .addColumnAt(<any>[$.REC], 9, 0, 5);
    }

    get draw(): DrawHelper {
        return draw;
    }

    moveLeft(): void {
        layer.width = layer.width;
        draw.moveLeft();
    }

    moveRight(): void {
        layer.width = layer.width;
        draw.moveRight();
    }

    moveTop(): void {
        layer.width = layer.width;
        draw.moveTop();
    }

    moveBottom(): void {
        layer.width = layer.width;
        draw.moveBottom();
    }

    renderFrame(): void {
        this.drawVirtualOnGeneral(ELayer.COPY, this.xPos, this.yPos);
    }
}
