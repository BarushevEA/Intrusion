import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {GreenTriangle} from "./GreenTriangle";
import {GreenRectangle} from "./GreenRectangle";

enum ELayer {
    WORK = 'WORK',
    GREED = 'GREED',
    COPY = 'COPY'
}

export class HorizontalBackground extends AbstractActor {
    private step = 5;
    private number = 100;
    private counter = 100;

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
        if (this.counter >= this.number) {
            getWork(this);
            this.drawVirtualOnVirtual(ELayer.WORK, ELayer.COPY, 0 - this.counter, 0);
            this.setVirtualLayer(ELayer.COPY);
            this.clearLayer();
            this.restoreDefaultLayer();
            this.drawVirtualOnVirtual(ELayer.COPY, ELayer.WORK, 0, 0);
            this.counter = 0;
        }
        this.drawVirtualOnGeneral(ELayer.COPY, 0 - this.counter, 0);
        this.drawVirtualOnGeneral(ELayer.GREED, 0, 0);
        this.counter += this.step;
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
    const layer = $.setVirtualLayer(ELayer.WORK, $.height, $.width + 100);
    $.clearLayer();
    const triangle = new GreenTriangle(layer);
    triangle.xPos = layer.width - triangle.width;
    triangle.yPos = 0;
    triangle.renderFrame();
    const rectangle = new GreenRectangle(layer);
    rectangle.xPos = layer.width - rectangle.width;
    rectangle.yPos = triangle.height;
    rectangle.renderFrame();
    const rectangle1 = new GreenRectangle(layer);
    rectangle1.xPos = layer.width - rectangle1.width;
    rectangle1.yPos = layer.height - rectangle1.height;
    rectangle1.renderFrame();
    const triangle1 = new GreenTriangle(layer);
    triangle1.xPos = layer.width - triangle1.width;
    triangle1.yPos = layer.height - rectangle1.height - triangle1.height;
    triangle1.renderFrame();
    // $.drawVirtualOnVirtual(ELayer.WORK, ELayer.WORK, -100, 0);
    $.restoreDefaultLayer();
}

function getCopy($: AbstractActor) {
    $.setVirtualLayer(ELayer.COPY, $.height, $.width + 100);
    $.restoreDefaultLayer();
}
