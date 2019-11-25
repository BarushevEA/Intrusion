import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {BrickWall} from "./briks/BrickWall";

enum ELayer {
    WORK = 'WORK',
    COPY = 'COPY'
}

export class HorizontalBackground1 extends AbstractActor {
    private step = 2;
    private number = 100;
    private counter = 100;

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height),
            Math.round(canvas.width));
        this.init();
    }

    init(): void {
        getWork(this);
        getCopy(this);
    }

    renderFrame() {
        if (this.counter >= this.number) {
            getWork(this);
            this.drawVirtualOnVirtual(ELayer.WORK, ELayer.COPY, 0 - this.counter, 0);
            this.setVirtualLayer(ELayer.COPY);
            this.clearLayer();
            this.drawVirtualOnVirtual(ELayer.COPY, ELayer.WORK, 0, 0);
            this.counter = 0;
        }
        this.drawVirtualOnGeneral(ELayer.COPY, 0 - this.counter, 0);
        this.counter += this.step;
    }
}

function getWork($: AbstractActor) {
    const layer = $.setVirtualLayer(ELayer.WORK, $.height, $.width + 100);
    $.clearLayer();
    for (let i = 0; i < $.height; i += 100) {
        const brickWall = new BrickWall(layer);
        brickWall.xPos = layer.width - brickWall.width;
        brickWall.yPos = i;
        brickWall.setShowedFrame(399);
        brickWall.renderFrame();
    }
}

function getCopy($: AbstractActor) {
    $.setVirtualLayer(ELayer.COPY, $.height, $.width + 100);
}
