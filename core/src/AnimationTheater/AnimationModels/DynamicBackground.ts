import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";

const startDelta = 1000;

export class DynamicBackground extends AbstractActor {

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height + startDelta * 1.2),
            Math.round(canvas.width + startDelta * 1.2));
        this.init();
        this.restorePreviousLayer();
    }

    init(): void {
    }

    renderFrame() {
    }
}
