import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";

export class SnakePlugin extends AbstractActorPlugin {
    private actors: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private isUnlinkProcessed = false;

    constructor(scene: AbstractScene) {
        super('SnakePlugin', scene);
    }

    onInit(): void {
        this.init();
    }

    private init() {
        this.actors.push(this.root);
        this.subscriber = this.scene.tickCount$.subscribe(() => {

        });
    }

    unLink(): void {
        if (this.isUnlinkProcessed) {
            return;
        }
        this.isUnlinkProcessed = true;
        if (this.actors && this.actors.length) {
            for (let i = 0; i < this.actors.length; i++) {
                const actor = this.actors[i];
                actor.pluginDock.unLink(this);
            }
            this.actors.length = 0;
        }
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        super.unLink();
        this.isUnlinkProcessed = false;
    }

    destroy(): void {
        super.destroy();
        this.actors = <any>0;
    }
}
