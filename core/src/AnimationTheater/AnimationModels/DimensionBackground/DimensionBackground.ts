import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {E_Cells, IBackgroundMap, ICellDrawOptions, ICellScheme} from "./DimensionTypes";
import {GreenRectangle} from "../GreenRectangle";
import {GreenTriangle} from "../GreenTriangle/GreenTriangle";
import {BrickWall} from "../briks/BrickWall";
import {Cells, DrawHelper} from "./DimensionUtils";
import {GreenTriangleLeft} from "../GreenTriangle/GreenTriangleLeft";
import {GreenTriangleRight} from "../GreenTriangle/GreenTriangleRight";
import {AnimatedRectangleLightGray} from "../rectangles/AnimatedRectangleLightGray";
import {BlueBrick} from "../briks/BlueBrick";

enum $ {
    NUL = 0,
    REC = 'REC',
    TRI = 'TRI',
    WAL = 'WAL',
    SKY = 'SKY'
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
scheme[$.SKY] = <any>BlueBrick;
scheme[' '] = <any>0;
scheme['0'] = <any>GreenRectangle;
scheme['['] = <any>GreenTriangleLeft;
scheme[`]`] = <any>GreenTriangleRight;
scheme[`#`] = <any>AnimatedRectangleLightGray;

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
        cells = new Cells(100, 100, 6, 20);
        cells
            .fillWithActor(<any>[$.SKY])
            .addRowAt(<any>[$.REC], 1, 0, 18)
            .addRowAt(<any>[$.REC], 1, 5, 18)
            .addColumnAt(<any>[$.REC], 0, 0, 6)
            .addColumnAt(<any>[$.REC], 19, 0, 6)
            .addStringDimension(
                [
                    '        ',
                    '     [] ',
                    '[]  [00]',
                    '00  ####',
                    '00  ####'
                ], 2, 0)
            .addStringDimension(
                [
                    '    0  0',
                    '    0  0'
                ], 2, 3);
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
