import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {BrickWall} from "./briks/BrickWall";
import {IActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {EventStore} from "../../AnimationCore/Store/EventStore";

enum ELayer {
    WORK = 'WORK',
    COPY = 'COPY'
}

export class HorizontalBackground1 extends AbstractActor {
    private step = 2;
    private number = 100;
    private counter = 100;
    private copyLayerCounter = 0;
    private arrayCounter = 0;
    private arr: IActor[] = [];

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(
            canvas,
            eventStore,
            Math.round(canvas.height),
            Math.round(canvas.width));
        this.init();
    }

    init(): void {

    }

    renderFrame() {
        if (this.counter >= this.number) {
            this.counter = 0;
            setDataToCopy(this, this.arrayCounter, this.arr);
            this.arrayCounter++;
        }
        if (this.copyLayerCounter >= this.generalLayer.width) {
            this.copyLayerCounter = 0;
            this.arrayCounter = 0;
            this.counter = this.number;
            this.clearLayer(0, 0, this.generalLayer.width, this.generalLayer.height);
            this.drawVirtualOnVirtual(ELayer.COPY, ELayer.COPY, 0 - this.generalLayer.width, 0);
            this.clearLayer(this.generalLayer.width, 0, this.generalLayer.width, this.generalLayer.height);
        }
        this.drawVirtualOnGeneral(ELayer.COPY, 0 - this.copyLayerCounter, 0);
        this.counter += this.step;
        this.copyLayerCounter += this.step;
    }
}

function setDataToCopy($: IActor, delta: number, arr: IActor[]) {
    if (!arr.length) {
        const layer = $.setVirtualLayer(ELayer.COPY, $.height, $.width * 2);
        for (let i = 0; i < $.height; i += 100) {
            const brickWall = new BrickWall(layer, $.eventStore);
            brickWall.isEventsBlock = true;
            arr.push(brickWall);
            brickWall.xPos = $.width + delta * brickWall.width;
            brickWall.yPos = i;
            brickWall.setShowedFrame(399);
            brickWall.renderFrame();
        }
        const tmpX = arr[0].xPos;
        const tmpY = arr[0].yPos;
        for (let i = 0; i < layer.height; i += 100) {
            for (let j = 0; j < layer.width; j += 100) {
                arr[0].xPos = j;
                arr[0].yPos = i;
                arr[0].renderFrame();
            }
        }
        arr[0].xPos = tmpX;
        arr[0].yPos = tmpY;
    } else {
        for (let i = 0; i < arr.length; i++) {
            const actor = arr[i];
            actor.xPos = $.width + delta * actor.width;
            actor.renderFrame();
        }
    }
}
