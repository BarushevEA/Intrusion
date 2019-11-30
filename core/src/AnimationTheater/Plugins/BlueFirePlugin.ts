import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {BlueFire} from "../AnimationModels/circle/BlueFire";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";
import {getCenterY} from "../../AnimationCore/Libraries/FunctionLibs";

export class BlueFirePlugin extends AbstractActorPlugin {
    private fire: AbstractActor = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private yBalance: number = 0;
    private xBalance: number = 0;

    constructor(scene: AbstractScene) {
        super('BlueFirePlugin', scene);
    }

    onInit(): void {
        this.fire = new BlueFire(this.scene.generalLayer);
        this.scene.setActors(this.fire);
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

            this.scene.setActorZIndex(this.fire, this.root.z_index - 10);
            this.fire.xPos = this.root.xPos - this.root.width - 20;
            this.fire.yPos =
                getCenterY(this.root.yPos, this.root.height)
                - Math.round(this.fire.height / 2)
                - ortY;

            this.yBalance = this.root.yPos;
            this.xBalance = this.root.xPos;
        });
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        if (this.fire) {
            this.fire.destroy();
            this.fire = <any>0;
        }
        this.yBalance = 0;
        this.xBalance = 0;
        super.destroy();
    }
}
