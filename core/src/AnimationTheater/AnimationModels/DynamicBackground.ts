import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

enum ELayer {
    WORK = 'WORK',
    GREED = 'GREED'
}

export class DynamicBackground extends AbstractActor {

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height),
            Math.round(canvas.width));
        this.init();
        this.restorePreviousLayer();
    }

    init(): void {
        getGreed(this);
        getWork(this);
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
    for (let i = 0; i < $.elementWidth; i += 100) {
        $.shape.line(i, 0, i, $.elementHeight);
    }
    for (let i = 0; i < $.elementHeight; i += 100) {
        $.shape.line(0, i, $.elementWidth, i);
    }
    $.shape
        .colors('', 'rgba(0,250,0,0.5)')
        .lineWidth(10)
        .lineDash([0, 0])
        .customStroke(true)
        .polygon([
            {x: 0, y: 0},
            {x: $.elementWidth, y: 0},
            {x: $.elementWidth, y: $.elementHeight},
            {x: 0, y: $.elementHeight},
            {x: 0, y: 0},
        ])
        .customStroke(false);
    $.restorePreviousLayer();
}

function getWork($: AbstractActor) {
    $.setVirtualLayer(ELayer.WORK);
    $.shape
        .colors('rgba(0,250,0,0.1)', 'rgba(0,250,0,0.5)')
        .lineWidth(5)
        .circle($.elementWidth - 300, $.elementHeight / 2, 200);
    $.restorePreviousLayer();
    $.drawVirtualOnVirtual(ELayer.WORK, ELayer.WORK, -100, 0);
}
