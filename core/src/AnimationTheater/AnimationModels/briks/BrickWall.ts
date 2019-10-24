import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class BrickWall extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('BrickWall');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.drawBrick(50, 0);
        this.drawBrick(-50, 0);
        this.drawBrick(0, 50);
    }

    drawBrick(x: number, y: number) {
        this.shape
            .setColors('rgb(255,134,16)', 'rgba(84,84,84,1)')
            .setLineWidth(6)
            .drawRectangle(x, y, 100, 50)

            .setLinearGradient()
            .setGradientDirectionPoints(x + 0, y + 0, x + 100, y + 50)
            .addColorStop(0, 'rgb(255,134,16)')
            .addColorStop(0.5, 'rgb(208,104,16)')
            .addColorStop(1, 'rgb(255,134,16)')
            .stopExecution()

            .setColors('', 'rgb(255,170,73)')
            .setLineWidth(3)
            .line(x + 5, y + 5, x + 95, y + 5)
            .line(x + 5, y + 5, x + 5, y + 45)

            .setColors('', 'rgb(168,88,12)')
            .setLineWidth(3)
            .line(x + 95, y + 5, x + 95, y + 45)
            .line(x + 95, y + 45, x + 5, y + 45)

            .stopDrawing();
    }
}
