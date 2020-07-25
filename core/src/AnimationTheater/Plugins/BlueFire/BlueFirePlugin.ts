import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {BlueFire} from "./BlueFire";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {ELayers} from "../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observables/Types";
import {IActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export class BlueFirePlugin extends AbstractActorPlugin {
    private fire: IActor = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private yBalance: number = 0;
    private xBalance: number = 0;

    constructor(scene: IScene) {
        super('BlueFirePlugin', scene);
    }

    onInit(): void {
        if (!this.fire) {
            this.fire = new BlueFire(this.scene.generalLayer);
            this.fire.isEventsBlock = true;
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

            if (ortX > 0) {
                this.fire.xPos = this.root.xPos - this.root.width + ortX * 2;
            } else {
                this.fire.xPos = this.root.xPos - this.root.width - 20;
            }
            this.fire.yPos =
                getCenterY(this.root.yPos, this.root.height)
                - Math.round(this.fire.height / 2)
                - ortY;

            this.yBalance = this.root.yPos;
            this.xBalance = this.root.xPos;

            if (!this.isUnlinked) {
                this.scene.setActiveLayer(ELayers.MIDDLE);
                this.scene.setActors(this.fire);
                this.scene.setActorZIndex(this.fire, this.root.z_index - 1);
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
        this.scene.unLink(this.fire);
        super.unLink();
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        if (this.fire) {
            this.scene.destroyActor(this.fire);
            this.fire = <any>0;
        }
        this.yBalance = 0;
        this.xBalance = 0;
        super.destroy();
    }
}
