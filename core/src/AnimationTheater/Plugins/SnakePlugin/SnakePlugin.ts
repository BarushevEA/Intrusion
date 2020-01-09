import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";

export class SnakePlugin extends AbstractActorPlugin {
    private actors: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private isUnlinkProcessed = false;
    private distance = 0;

    constructor(scene: AbstractScene, distance = 15) {
        super('SnakePlugin', scene);
        this.distance = distance;
    }

    onInit(): void {
        this.init();
    }

    private init() {
        if (!this.actors) {
            this.actors = [];
        }
        if (this.actors.length) {
            for (let i = 0; i < this.distance; i++) {
                const fakeActor = new FakeActor();
                fakeActor.xPos = this.root.xPos;
                fakeActor.yPos = this.root.yPos;
                this.actors.push(<any>fakeActor)
            }
        }
        this.actors.push(this.root);
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

        console.log('unlink');

        if (this.actors && this.actors.length) {
            for (let i = 0; i < this.actors.length; i++) {
                const actor = this.actors[i];
                if (actor && actor.pluginDock) {
                    actor.pluginDock.unLink(this);
                }
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

    private checkIsDestroyed() {
        let isDestroyed = true;
        for (let i = 0; i < this.actors.length; i++) {
            const actor = this.actors[i];
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
            }
        }, 1000);
    }
}

class FakeActor {
    private _xPos = 0;
    private _yPos = 0;
    private _xPosPreview = 0;
    private _yPosPreview = 0;
    public isDestroyed = true;

    get xPos(): number {
        return this._xPos;
    }

    set xPos(value: number) {
        this._xPosPreview = this._xPos;
        this._xPos = value;
    }

    get yPos(): number {
        return this._yPos;
    }

    set yPos(value: number) {
        this._yPosPreview = this._yPos;
        this._yPos = value;
    }

    get xPosPreview(): number {
        return this._xPosPreview;
    }

    get yPosPreview(): number {
        return this._yPosPreview;
    }

    destroy() {

    }
}
