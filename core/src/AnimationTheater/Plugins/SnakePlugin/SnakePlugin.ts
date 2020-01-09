import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {FakeActor} from "./FakeActor";
import {EmptyActor} from "./EmptyActor";

export class SnakePlugin extends AbstractActorPlugin {
    private actors: AbstractActor[] = <any>0;
    private realActors: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private isUnlinkProcessed = false;
    private distance = 0;
    private emptyActor: AbstractActor = <any>0;

    constructor(scene: AbstractScene, plugins: AbstractActorPlugin[], distance = 15) {
        super('SnakePlugin', scene);
        this.distance = distance;
        this.emptyActor = new EmptyActor(scene.generalLayer);
        this.scene.setActors(this.emptyActor);
        for (let i = 0; i < plugins.length; i++) {
            const plugin = plugins[i];
            this.emptyActor.pluginDock.add(plugin);
        }
    }

    onInit(): void {
        this.init();
    }

    private init() {
        if (!this.actors) {
            this.actors = [];
            this.actors.push(this.emptyActor);
            this.emptyActor.xPos = this.root.xPos;
            this.emptyActor.yPos = this.root.yPos;
            this.emptyActor.width = this.root.width;
            this.emptyActor.height = this.root.height;
        }

        if (!this.realActors) {
            this.realActors = [];
        }

        if (this.actors.length > 1) {
            for (let i = 0; i < this.distance; i++) {
                const fakeActor = new FakeActor();
                fakeActor.xPos = this.root.xPos;
                fakeActor.yPos = this.root.yPos;
                this.actors.push(<any>fakeActor)
            }
        }
        this.actors.push(this.root);
        this.realActors.push(this.root);
        if (!this.subscriber) {
            this.subscriber = this.scene.tickCount$.subscribe(() => {
                if (this.actors.length && this.actors.length > 1) {
                    for (let i = 0; i < this.actors.length - 1; i++) {
                        const actor = this.actors[i + 1];
                        const actorPreview = this.actors[i];

                        actor.xPos = actorPreview.xPosPreview;
                        actor.yPos = actorPreview.yPosPreview;
                    }
                }
            });
        }
    }

    unLink(): void {
        if (this.isUnlinkProcessed || this.isUnlinked) {
            return;
        }

        this.isUnlinkProcessed = true;

        if (!this.checkIsDestroyed()) {
            this.isUnlinkProcessed = false;
            return;
        }

        if (this.realActors && this.realActors.length) {
            for (let i = 0; i < this.realActors.length; i++) {
                const actor = this.realActors[i];
                if (actor && actor.pluginDock) {
                    actor.pluginDock.unLink(this);
                }
            }
            this.actors.length = 0;
            this.realActors.length = 0;
        }

        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        super.unLink();
        this.isUnlinkProcessed = false;
    }

    private checkIsDestroyed() {
        let isDestroyed = true;
        for (let i = 0; i < this.realActors.length; i++) {
            const actor = this.realActors[i];
            if (!actor.isDestroyed) {
                isDestroyed = false;
                break;
            }
        }
        return isDestroyed;
    }

    destroy(): void {
        super.destroy();
        setTimeout(() => {
            if (this.checkIsDestroyed()) {
                this.unLink();
                this.actors = <any>0;
                this.realActors = <any>0;
                if (this.emptyActor) {
                    this.emptyActor.destroy();
                }
                this.emptyActor = <any>0;
            }
        }, 1000);
    }
}
