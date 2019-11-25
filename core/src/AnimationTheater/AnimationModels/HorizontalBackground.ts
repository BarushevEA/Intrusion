import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {GreenTriangle} from "./GreenTriangle";
import {GreenRectangle} from "./GreenRectangle";
import {BrickWall} from "./briks/BrickWall";

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
            this.drawVirtualOnVirtual(ELayer.COPY, ELayer.WORK, 0, 0);
            this.counter = 0;
        }
        this.drawVirtualOnGeneral(ELayer.COPY, 0 - this.counter, 0);
        // this.drawVirtualOnGeneral(ELayer.GREED, 0, 0);
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
}

function getWork($: AbstractActor) {
    const layer = $.setVirtualLayer(ELayer.WORK, $.height, $.width + 100);
    $.clearLayer();
    const brickWall = new BrickWall(layer);
    brickWall.xPos = layer.width - brickWall.width;
    brickWall.yPos = 0;
    brickWall.setShowedFrame(80);
    brickWall.renderFrame();
    const rectangle = new GreenRectangle(layer);
    rectangle.xPos = layer.width - rectangle.width;
    rectangle.yPos = brickWall.height;
    rectangle.renderFrame();
    const rectangle1 = new BrickWall(layer);
    rectangle1.xPos = layer.width - rectangle1.width;
    rectangle1.yPos = layer.height - rectangle1.height * 2;
    rectangle1.setShowedFrame(80);
    rectangle1.renderFrame();
    const triangle1 = new GreenTriangle(layer);
    triangle1.xPos = layer.width - triangle1.width;
    triangle1.yPos = layer.height - rectangle1.height;
    triangle1.renderFrame();
}

function getCopy($: AbstractActor) {
    $.setVirtualLayer(ELayer.COPY, $.height, $.width + 100);
}
