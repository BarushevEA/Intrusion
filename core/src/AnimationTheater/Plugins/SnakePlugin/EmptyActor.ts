import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

export class EmptyActor extends AbstractActor {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 0, 0);
    }

    renderFrame(): void {
    }
}
