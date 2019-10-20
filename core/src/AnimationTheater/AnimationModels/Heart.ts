import {AbstractFramedShape} from "../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";


export class Heart extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 130, 135);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Heart');
    }

    protected initShape(): void {
        const multiplier = 1.2;

        for (let i = 0; i < 2; i++) {
            this.createFrame(20);
            this.getHeart();

            this.createFrame(10);
            this.getHeart(multiplier);
        }
        this.createFrame(30);
        this.getHeart();
    }

    getHeart(sizeMultiplier = 1) {
        this.shape.setLineWidth(4);
        this.shape.setColors('rgb(255,115,133)', 'rgb(146,10,16)');
        this.shape.drawAdvancedPolygon()
            .startPoint(75 / sizeMultiplier, 40 / sizeMultiplier)
            .bezierCurveTo(75 / sizeMultiplier, 37 / sizeMultiplier, 70 / sizeMultiplier, 25 / sizeMultiplier, 50 / sizeMultiplier, 25 / sizeMultiplier)
            .bezierCurveTo(20 / sizeMultiplier, 25 / sizeMultiplier, 20 / sizeMultiplier, 62.5 / sizeMultiplier, 20 / sizeMultiplier, 62.5 / sizeMultiplier)
            .bezierCurveTo(20 / sizeMultiplier, 80 / sizeMultiplier, 40 / sizeMultiplier, 102 / sizeMultiplier, 75 / sizeMultiplier, 120 / sizeMultiplier)
            .bezierCurveTo(110 / sizeMultiplier, 102 / sizeMultiplier, 130 / sizeMultiplier, 80 / sizeMultiplier, 130 / sizeMultiplier, 62.5 / sizeMultiplier)
            .bezierCurveTo(130 / sizeMultiplier, 62.5 / sizeMultiplier, 130 / sizeMultiplier, 25 / sizeMultiplier, 100 / sizeMultiplier, 25 / sizeMultiplier)
            .bezierCurveTo(85 / sizeMultiplier, 25 / sizeMultiplier, 75 / sizeMultiplier, 37 / sizeMultiplier, 75 / sizeMultiplier, 40 / sizeMultiplier)
            .stopDrawing();
    }
}
