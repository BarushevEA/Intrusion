import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";

export class VirtualDimensions extends AbstractActorPlugin {
    constructor(scene: AbstractScene) {
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
