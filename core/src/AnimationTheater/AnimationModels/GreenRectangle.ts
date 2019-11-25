import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

enum ELayer {
    WORK = 'WORK',
}

export class GreenRectangle extends AbstractActor {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
        this.init();
        this.restoreDefaultLayer();
    }

    init(): void {
        getWork(this);
    }

    renderFrame() {
        this.drawVirtualOnGeneral(ELayer.WORK, this.xPos, this.yPos);
    }
}

function getWork($: AbstractActor) {
    $.setVirtualLayer(ELayer.WORK);
    $.shape
        .colors('rgba(0,250,0,0.1)', 'rgba(0,250,0,0.5)')
        .lineWidth(5)
        .polygon([
            {x: 5, y: 5},
            {x: 95, y: 5},
            {x: 95, y: 95},
            {x: 5, y: 95},
        ]);
    $.restoreDefaultLayer();
}
