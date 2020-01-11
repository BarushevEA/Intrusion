import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";
import {randomize} from "../../AnimationCore/Libraries/FunctionLibs";

export class BounceOffTheWall extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private deltaNum = 5;
    private xDelta = 0;
    private yDelta = 0;
    private minXBound = 0;
    private reInitTime = 0;
    private isReInitDeltas = false;
    private reInitTimer = -1;
    private isReinitProcessed = false;

    constructor(scene: AbstractScene,
                minXBound = 0,
                isReInitDeltas = false,
                reInitTime = 5000) {
        super('BounceOffTheWall', scene);
        this.minXBound = minXBound;
        this.reInitTime = reInitTime;
        this.isReInitDeltas = isReInitDeltas;
    }

    onInit(): void {
        this.init();
    }

    init() {
        this.reInitDeltas();

        if (this.isReInitDeltas && !this.isReinitProcessed) {
            this.isReinitProcessed = true;
            this.reInitTimer = setInterval(() => {
                this.reInitDeltas();
            }, this.reInitTime);
        }

        if (!!this.subscriber) {
            return;
        }

        this.subscriber = this.scene.tickCount$.subscribe(() => {
            if (!this.root || this._isUnlinked) {
                return;
            }
            if (this.root.xPos <= this.minXBound) {
                this.xDelta = randomize(this.deltaNum);
                this.xDelta = !!this.xDelta ? this.xDelta : this.deltaNum;
            }
            if (this.root.xPos >= (this.scene.generalLayer.width - this.root.width)) {
                this.xDelta = -randomize(this.deltaNum);
                this.xDelta = !!this.xDelta ? this.xDelta : -this.deltaNum;
            }
            if (this.root.yPos <= 0) {
                this.yDelta = randomize(this.deltaNum);
                this.yDelta = !!this.yDelta ? this.yDelta : this.deltaNum;
            }
            if (this.root.yPos >= (this.scene.generalLayer.height - this.root.height)) {
                this.yDelta = -randomize(this.deltaNum);
                this.yDelta = !!this.yDelta ? this.yDelta : -this.deltaNum;
            }

            this.root.xPos += this.xDelta;
            this.root.yPos += this.yDelta;
        });
    }

    private reInitDeltas() {
        this.xDelta = randomize(this.deltaNum) > this.deltaNum ? randomize(this.deltaNum) : -randomize(this.deltaNum);
        this.yDelta = randomize(this.deltaNum) > this.deltaNum ? randomize(this.deltaNum) : -randomize(this.deltaNum);
        this.xDelta *= 2;
        this.yDelta *= 2;
        this.xDelta = !!this.xDelta ? this.xDelta : this.deltaNum;
        this.yDelta = !!this.yDelta ? this.yDelta : this.deltaNum;
    }

    unLink(): void {
        if (this.isReInitDeltas) {
            clearInterval(this.reInitTimer);
            this.isReinitProcessed = false;
        }
        super.unLink();
    }

    destroy(): void {
        super.destroy();
        if (this.subscriber) {
            this.subscriber.unsubscribe()
        }
        this.subscriber = <any>0;
    }
}
