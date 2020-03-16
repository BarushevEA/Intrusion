import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {HealthPlugin} from "./HealthPlugin";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";

export class HealsBuf extends AbstractActorPlugin {
    private _buf: number = <any>0;
    private _actors: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;

    constructor(scene: AbstractScene, actors: AbstractActor[], buf = 2000) {
        super('HealsBuf', scene);
        this._buf = buf;
        this._actors = actors;
    }

    onInit(): void {
        if (this.subscriber) {
            return;
        }
        this.scene.collect(
            this.subscriber = this.scene.tickCount$.subscribe(() => {
                for (let i = 0; i < this._actors.length; i++) {
                    const actor = this._actors[i];
                    const x = actor.xPos + actor.width;
                    const y = getCenterY(actor.yPos, actor.yPos + actor.height);
                    const isXPosNested = x >= this.root.xPos && x <= (this.root.xPos + this.root.width);
                    const isYPosNested = y >= this.root.yPos && y <= (this.root.yPos + this.root.height);
                    if (isXPosNested && isYPosNested) {
                        const health = <HealthPlugin>actor.pluginDock.getPluginsFromRootName('HealthPlugin')[0];
                        if (health) {
                            health.upgradeCurrentHealth(this._buf);
                            this.scene.unsubscribe(this.subscriber);
                            this.subscriber = <any>0;

                            this.scene.destroyActor(this.root);
                            break;
                        }
                    }
                }
            })
        );
    }

    destroy(): void {
        this._buf = <any>0;
        this._actors = <any>0;
        if (this.subscriber) {
            this.scene.unsubscribe(this.subscriber);
        }
        this.subscriber = <any>0;
        super.destroy();
    }
}
