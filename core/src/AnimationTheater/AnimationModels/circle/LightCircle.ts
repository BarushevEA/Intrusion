import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {getCenterX, getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class LightCircle extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('LightCircle');
    }

    protected initShape(): void {
        const x = getCenterX(0, this.width);
        const y = getCenterY(0, this.height);
        let length = 20;
        for (let i = 0; i < length; i++) {
            this.createFrame(1);
            this.shape
                .colors('rgba(0,0,0,0)', 'rgba(0,0,0,0)')
                .lineWidth(0)
                .radialGradient()
                .setGradientDirectionPoints(
                    x, y, i,
                    x, y, 30 + i)
                .addColorStop(0, 'rgba(195,187,58,0.1)')
                .addColorStop(0.5, 'rgba(195,187,58,0.03)')
                .addColorStop(1, 'rgba(0,0,0,0)')
                .stopExecution()
                .rectangle(0, 0, this.height, this.width)
                .stopDrawing();
        }
        for (let i = length; i > -1; i--) {
            this.createFrame(0);
            this.shape
                .colors('rgba(0,0,0,0)', 'rgba(0,0,0,0)')
                .lineWidth(0)
                .radialGradient()
                .setGradientDirectionPoints(
                    x, y, i,
                    x, y, 30 + i)
                .addColorStop(0, 'rgba(195,187,58,0.1)')
                .addColorStop(0.2, 'rgba(195,187,58,0.03)')
                .addColorStop(1, 'rgba(0,0,0,0)')
                .stopExecution()
                .rectangle(0, 0, this.height, this.width)
                .stopDrawing();
        }

        // this.setLastFrameToStop();
    }
}
