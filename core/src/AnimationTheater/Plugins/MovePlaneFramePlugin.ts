import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";
import {AbstractFramedShape} from "../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class MovePlaneFramePlugin extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private yBalance: number = 0;
    private xBalance: number = 0;

    constructor(scene: AbstractScene) {
        super('MovePlaneFramePlugin', scene);
    }

    onInit(): void {
        this.yBalance = this.root.yPos;
        this.xBalance = this.root.xPos;
        (<AbstractFramedShape>this.root).setShowedFrame(1);
        this.root.setStopFrame(1);
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

            switch (true) {
                case ortY === 0:
                    (<AbstractFramedShape>this.root).setShowedFrame(1);
                    this.root.setStopFrame(1);
                    break;
                case ortY >= 0:
                    (<AbstractFramedShape>this.root).setShowedFrame(0);
                    this.root.setStopFrame(0);
                    break;
                case ortY <= 0:
                    (<AbstractFramedShape>this.root).setShowedFrame(0);
                    this.root.setStopFrame(0);
                    break;
            }

            this.yBalance = this.root.yPos;
            this.xBalance = this.root.xPos;
        });
    }

    unLink(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        this.yBalance = 0;
        this.xBalance = 0;
        super.unLink();
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        this.yBalance = 0;
        this.xBalance = 0;
        super.destroy();
    }
}
