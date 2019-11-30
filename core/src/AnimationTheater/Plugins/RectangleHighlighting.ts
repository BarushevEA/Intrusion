import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

export class RectangleHighlighting extends AbstractActorPlugin {

    constructor(scene: AbstractScene) {
        super(name, scene);
    }

    onInit(root?: AbstractActor): void {
        root = root;
    }
}
