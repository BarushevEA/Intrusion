import {AbstractActor} from "../AnimationEngine/rootModels/AbstractActor/AbstractActor";

export class PositionBalance {
    private root: AbstractActor = <any>0;
    private balanced: AbstractActor = <any>0;
    private yBalance: number = 0;
    private xBalance: number = 0;
    private ortY = -1;
    private ortX = -1;

    constructor(root: AbstractActor, balanced: AbstractActor) {
        this.root = root;
        this.balanced = balanced;
    }
}
