import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";

export class Link extends AbstractActorPlugin {
    private linkedActor: AbstractActor = <any>0;
    private subscriber: ISubscriptionLike = <any>0;

    constructor(scene: AbstractScene) {
        super('Link', scene);
    }

    setActorToLink(actor: AbstractActor): void {
        this.linkedActor = actor;
    }

    onInit(): void {
        this.scene.collect(
            this.subscriber = this.scene.tickCount$.subscribe(() => {
                this.linkedActor.xPos = this.root.xPos + 200;
                this.linkedActor.yPos = this.root.yPos;
            })
        );
    }

    unLink(): void {
        if (this.subscriber) {
            this.scene.unsubscribe(this.subscriber);
            this.subscriber = <any>0;
        }
        super.unLink();
    }
}
