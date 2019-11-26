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
    private step = 4;
    private number = 100;
    private counter = 100;
    private copyLayerCounter = 0;
    private arrayCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height),
            Math.round(canvas.width));
        this.init();
    }

    init(): void {
        getGreed(this);
    }

    renderFrame() {
        if (this.counter >= this.number) {
            this.counter = 0;
            setDataToCopy(this, this.arrayCounter);
            this.arrayCounter++;
        }
        if (this.copyLayerCounter >= this.generalLayer.width) {
            this.copyLayerCounter = 0;
            this.arrayCounter = 0;
            this.counter = this.number;
            this.clearLayer(0, 0, this.generalLayer.width, this.generalLayer.height);
            this.drawVirtualOnVirtual(ELayer.COPY, ELayer.COPY, 0 - this.generalLayer.width, 0);
            this.clearLayer(this.generalLayer.width, 0, this.generalLayer.width, this.generalLayer.height);
        }
        this.drawVirtualOnGeneral(ELayer.COPY, 0 - this.copyLayerCounter, 0);
        // this.drawVirtualOnGeneral(ELayer.GREED, 0, 0);
        this.counter += this.step;
        this.copyLayerCounter += this.step;
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

function setDataToCopy($: AbstractActor, delta: number) {
    const layer = $.setVirtualLayer(ELayer.COPY, $.height, $.width * 2);
    const brickWall = new BrickWall(layer);
    brickWall.xPos = $.width + delta * brickWall.width;
    brickWall.yPos = 0;
    brickWall.setShowedFrame(80);
    brickWall.renderFrame();
    const rectangle = new GreenRectangle(layer);
    rectangle.xPos = $.width + delta * rectangle.width;
    rectangle.yPos = brickWall.height;
    rectangle.renderFrame();
    const rectangle1 = new BrickWall(layer);
    rectangle1.xPos = $.width + delta * rectangle1.width;
    rectangle1.yPos = $.height - rectangle1.height * 2;
    rectangle1.setShowedFrame(80);
    rectangle1.renderFrame();
    const triangle1 = new GreenTriangle(layer);
    triangle1.xPos = $.width + delta * triangle1.width;
    triangle1.yPos = $.height - rectangle1.height;
    triangle1.renderFrame();
}
