import {IActor} from "../AnimationEngine/rootModels/AbstractActor/ActorTypes";

export class PositionBalance {
    private readonly rootActor: IActor = <any>0;
    private readonly balancedActor: IActor = <any>0;
    private yBalance: number = 0;
    private xBalance: number = 0;
    private vectorY = 0;
    private vectorX = 0;

    constructor(rootActor: IActor, balancedActor: IActor) {
        this.rootActor = rootActor;
        this.balancedActor = balancedActor;
        this.init();
    }

    private init() {
        this.yBalance = this.rootActor.yPos;
        this.xBalance = this.rootActor.xPos;
        this.vectorY = -1;
        this.vectorX = -1;
    }

    public handle(xCorrection = 0, yCorrection = 0) {
        if (!this.rootActor || !this.balancedActor) {
            return;
        }

        let xDelta = this.xBalance - this.rootActor.xPos;
        let yDelta = this.yBalance - this.rootActor.yPos;

        if (!this.vectorY &&
            !this.vectorX &&
            !yDelta &&
            !xDelta
        ) {
            return;
        }

        this.vectorY = yDelta;
        this.vectorX = xDelta;

        this.balancedActor.xPos = this.rootActor.xPos - this.vectorX + xCorrection;
        this.balancedActor.yPos = this.rootActor.yPos - this.vectorY + yCorrection;

        this.yBalance = this.rootActor.yPos;
        this.xBalance = this.rootActor.xPos;
    }
}
