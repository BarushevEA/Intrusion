import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {IScene} from "../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export class VirtualDimensions extends AbstractActorPlugin {
    constructor(scene: IScene) {
        super('VirtualDimensions', scene);
    }

    onInit(): void {
    }

    destroy(): void {
        super.destroy();
    }

    unLink(): void {
        super.unLink();
    }
}
