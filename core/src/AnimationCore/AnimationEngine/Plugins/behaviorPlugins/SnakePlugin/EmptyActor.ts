import {AbstractActor} from "../../../rootModels/AbstractActor/AbstractActor";
import {EventStore} from "../../../../Store/EventStore";

export class EmptyActor extends AbstractActor {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 0, 0);
    }

    renderFrame(): void {
    }
}
