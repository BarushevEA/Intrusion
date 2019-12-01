import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {getCenterY} from "../../AnimationCore/Libraries/FunctionLibs";
import {ShotLighting} from "../AnimationModels/Shot/ShotLighting";

export class ShotLightingPlugin extends AbstractActorPlugin {
    private shotLighting: AbstractActor = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private yBalance: number = 0;
    private xBalance: number = 0;

    constructor(scene: AbstractScene) {
        super('ShotLightingPlugin', scene);
    }

    onInit(): void {
        if (!this.shotLighting) {
            this.shotLighting = new ShotLighting(this.scene.generalLayer);
        }
        this.yBalance = this.root.yPos;
        this.xBalance = this.root.xPos;
        let ortY = -1;
        let ortX = -1;
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            let xDelta = this.xBalance - this.root.xPos;
            let yDelta = this.yBalance - this.root.yPos;

            if (!ortY &&
                !ortX &&
                !yDelta &&
                !xDelta
            ) {
                return;
            }

            ortY = yDelta;
            ortX = xDelta;

            this.scene.setActorZIndex(this.shotLighting, this.root.z_index - 10);
            this.shotLighting.xPos = this.root.xPos + this.root.width - 50 - ortX;
            this.shotLighting.yPos =
                getCenterY(this.root.yPos, this.root.height)
                - Math.round(this.shotLighting.height / 2)
                - ortY;

            this.yBalance = this.root.yPos;
            this.xBalance = this.root.xPos;

            if (this.isUnlinked) {
                this.scene.setActors(this.shotLighting);
                this._isUnlinked = false;
            }
        });
    }

    unLink(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        this.yBalance = 0;
        this.xBalance = 0;
        this.scene.unLink(this.shotLighting);
        super.unLink();
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        if (this.shotLighting) {
            this.shotLighting.destroy();
            this.shotLighting = <any>0;
        }
        this.yBalance = 0;
        this.xBalance = 0;
        super.destroy();
    }
}
