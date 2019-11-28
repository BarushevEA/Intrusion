import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {getRectangleCenter} from "../../../AnimationCore/Libraries/FunctionLibs";

export class LightCircle extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('LightCircle');
    }

    protected initShape(): void {
        const middle = getRectangleCenter(0, 0, this.height, this.width);
        const length = 20;
        for (let i = 0; i < length; i++) {
            this.createFrame(1);
            this.shape
                .colors('rgba(0,0,0,0)', 'rgba(0,0,0,0)')
                .lineWidth(0)
                .radialGradient()
                .setGradientDirectionPoints(
                    middle.x,
                    middle.y,
                    i,
                    middle.x,
                    middle.y,
                    30 + i)
                .addColorStop(0, 'rgba(195,187,58,1)')
                .addColorStop(0.5, 'rgba(195,187,58,0.3)')
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
                    middle.x,
                    middle.y,
                    i,
                    middle.x,
                    middle.y,
                    30 + i)
                .addColorStop(0, 'rgba(195,187,58,1)')
                .addColorStop(0.2, 'rgba(195,187,58,0.3)')
                .addColorStop(1, 'rgba(0,0,0,0)')
                .stopExecution()
                .rectangle(0, 0, this.height, this.width)
                .stopDrawing();
        }

        // this.setLastFrameToStop();
    }
}
