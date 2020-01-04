import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";

export class BulletPlugin extends AbstractActorPlugin{

    constructor(scene: AbstractScene) {
        super('BulletPlugin', scene);
    }

    onInit(): void {
    }

    unLink(): void {
        super.unLink();
    }

    destroy(): void {
        super.destroy();
    }
}
