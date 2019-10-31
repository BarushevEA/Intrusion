import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

enum ELayer {
    WORK = 'WORK',
}

export class GreenTriangle extends AbstractActor {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
        this.init();
        this.restorePreviousLayer();
    }

    init(): void {
        getWork(this);
    }

    renderFrame() {
        this.drawVirtualOnGeneral(ELayer.WORK, this.elementX, this.elementY);
    }
}

function getWork($: AbstractActor) {
    $.setVirtualLayer(ELayer.WORK);
    $.shape
        .colors('rgba(0,250,0,0.1)', 'rgba(0,250,0,0.5)')
        .lineWidth(5)
        .polygon([
            {x: 5, y: 95},
            {x: 50, y: 5},
            {x: 95, y: 95},
        ]);
    $.restorePreviousLayer();
}
