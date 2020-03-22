import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {E_Cells, IBackgroundMap, ICellScheme} from "./DimensionTypes";
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
        layer = this.setVirtualLayer(ELayer.COPY, this.height, this.width);
        cells.setScheme(scheme, E_Cells.ACTOR_USE, layer);
        draw.render();
    }

    get draw():DrawHelper {
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

    prepareCells(): void {
        cells = new Cells(100, 100, 4, 10);
        cells
            .fillWithActor(<any>[$.WAL])
            .addRowAt(<any>[$.REC],1,0,8)
            .addRowAt(<any>[$.REC],1,3,8)
            .addColumnAt(<any>[$.REC],0,0,4)
            .addColumnAt(<any>[$.REC],9,0,4);
        draw = new DrawHelper(<any>0, cells, 0, 0);
    }

    renderFrame(): void {
        this.drawVirtualOnGeneral(ELayer.COPY, this.xPos, this.yPos);
    }
}
