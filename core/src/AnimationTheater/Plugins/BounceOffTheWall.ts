import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";

export class BounceOffTheWall extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private deltaNum = 5;
    private xDelta = 0;
    private yDelta = 0;

    constructor(scene: AbstractScene) {
        super('BounceOffTheWall', scene);
    }

    onInit(): void {
        this.init();
    }

    init() {
        this.xDelta = this.getRandomDelta() > this.deltaNum ? this.getRandomDelta() : -this.getRandomDelta();
        this.yDelta = this.getRandomDelta() > this.deltaNum ? this.getRandomDelta() : -this.getRandomDelta();
        this.xDelta *= 2;
        this.yDelta *= 2;
        if (!!this.subscriber) {
            return;
        }
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            if (!this.root || this._isUnlinked) {
                return;
            }
            if (this.root.xPos <= 0) {
                this.xDelta = this.getRandomDelta();
            }
            if (this.root.xPos >= (this.scene.generalLayer.width - this.root.width)) {
                this.xDelta = -this.getRandomDelta();
            }
            if (this.root.yPos <= 0) {
                this.yDelta = this.getRandomDelta();
            }
            if (this.root.yPos >= (this.scene.generalLayer.height - this.root.height)) {
                this.yDelta = -this.getRandomDelta();
            }

            this.root.xPos += this.xDelta;
            this.root.yPos += this.yDelta;
        });
    }

    getRandomDelta(): number {
        return Math.round(Math.random() * this.deltaNum);
    }

    destroy(): void {
        super.destroy();
        if (this.subscriber) {
            this.subscriber.unsubscribe()
        }
        this.subscriber = <any>0;
    }
}
