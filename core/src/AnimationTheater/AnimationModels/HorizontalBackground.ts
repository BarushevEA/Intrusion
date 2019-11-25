import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {GreenTriangle} from "./GreenTriangle";
import {GreenRectangle} from "./GreenRectangle";

enum ELayer {
    WORK = 'WORK',
    GREED = 'GREED',
    COPY = 'COPY'
}

export class HorizontalBackground extends AbstractActor {

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height),
            Math.round(canvas.width));
        this.init();
        this.restoreDefaultLayer();
    }

    init(): void {
        getGreed(this);
        getWork(this);
        getCopy(this);
    }

    renderFrame() {
        this.drawVirtualOnGeneral(ELayer.WORK, 0, 0);
        this.drawVirtualOnGeneral(ELayer.GREED, 0, 0);
    }
}

function getGreed($: AbstractActor): void {
    $.setVirtualLayer(ELayer.GREED);
    $.shape
        .colors('', 'rgba(0,250,0,0.1)')
        .lineWidth(1)
        .lineDash([5, 15]);
    for (let i = 0; i < $.width; i += 100) {
        $.shape.line(i, 0, i, $.height);
    }
    for (let i = 0; i < $.height; i += 100) {
        $.shape.line(0, i, $.width, i);
    }
    $.shape
        .colors('', 'rgba(0,250,0,0.5)')
        .lineWidth(10)
        .lineDash([0, 0])
        .customStroke(true)
        .polygon([
            {x: 0, y: 0},
            {x: $.width, y: 0},
            {x: $.width, y: $.height},
            {x: 0, y: $.height},
            {x: 0, y: 0},
        ])
        .customStroke(false);
    $.restoreDefaultLayer();
}

function getWork($: AbstractActor) {
    const layer = $.setVirtualLayer(ELayer.WORK);
    const triangle = new GreenTriangle(layer);
    triangle.xPos = $.width - triangle.width;
    triangle.yPos = 0;
    triangle.renderFrame();
    const rectangle = new GreenRectangle(layer);
    rectangle.xPos = $.width - rectangle.width;
    rectangle.yPos = triangle.height;
    rectangle.renderFrame();
    const rectangle1 = new GreenRectangle(layer);
    rectangle1.xPos = $.width - rectangle1.width;
    rectangle1.yPos = $.height - rectangle1.height;
    rectangle1.renderFrame();
    const triangle1 = new GreenTriangle(layer);
    triangle1.xPos = $.width - triangle1.width;
    triangle1.yPos = $.height - rectangle1.height - triangle1.height;
    triangle1.renderFrame();
    // $.drawVirtualOnVirtual(ELayer.WORK, ELayer.WORK, -100, 0);
    $.restoreDefaultLayer();
}

function getCopy($: AbstractActor){
    $.setVirtualLayer(ELayer.COPY);
    $.restoreDefaultLayer();
}
