import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";
import {randomize} from "../../AnimationCore/Libraries/FunctionLibs";
import {tickGenerator} from "../../AnimationCore/Libraries/TickGenerator";

export class BounceOffTheWall extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private deltaNum = 5;
    private xDelta = 0;
    private yDelta = 0;
    private minXBound = 0;
    private reInitTime = 0;
    private isReInitDeltas = false;
    private reInitTimer: ISubscriptionLike = <any>0;
    private isReInitProcessed = false;
    private multiply = 2;
    private forceSpeed = 1;

    constructor(scene: AbstractScene,
                minXBound = 0,
                isReInitDeltas = false,
                reInitTime = 5,
                deltaNum = 5,
                multiply = 2,
                forceSpeed = 1) {
        super('BounceOffTheWall', scene);
        this.minXBound = minXBound;
        this.reInitTime = reInitTime;
        this.isReInitDeltas = isReInitDeltas;
        this.deltaNum = deltaNum;
        this.multiply = multiply;
        this.forceSpeed = forceSpeed;
    }

    onInit(): void {
        this.init();
    }

    init() {
        this.reInitDeltas();

        if (this.isReInitDeltas && !this.isReInitProcessed) {
            this.isReInitProcessed = true;
            this.reInitTimer = tickGenerator.executeSecondInterval(() => {
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

            this.root.xPos += this.xDelta * this.forceSpeed;
            this.root.yPos += this.yDelta * this.forceSpeed;
        });
    }

    private reInitDeltas() {
        this.xDelta = randomize(this.deltaNum * this.multiply) > this.deltaNum ? randomize(this.deltaNum) : -randomize(this.deltaNum);
        this.yDelta = randomize(this.deltaNum * this.multiply) > this.deltaNum ? randomize(this.deltaNum) : -randomize(this.deltaNum);
        this.xDelta *= this.multiply;
        this.yDelta *= this.multiply;
        this.xDelta = !!this.xDelta ? this.xDelta : this.deltaNum;
        this.yDelta = !!this.yDelta ? this.yDelta : this.deltaNum;
    }

    unLink(): void {
        if (this.isReInitDeltas) {
            if (this.reInitTimer) {
                this.reInitTimer.unsubscribe();
                this.reInitTimer = <any>0;
            }
            this.isReInitProcessed = false;
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
