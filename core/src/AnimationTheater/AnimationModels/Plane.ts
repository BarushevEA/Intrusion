import {AbstractFramedShape} from "../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";


export class Plane extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Plane');
    }

    protected initShape(): void {
        const multiplier = 1;

        for (let i = 0; i < 2; i++) {
            this.createFrame(20);
            this.getPlane();

            this.createFrame(10);
            this.getPlane(multiplier);
        }
        this.createFrame(30);
        this.getPlane();
    }

    getPlane(sizeMultiplier = 1) {
        this.shape
            .lineWidth(2)
            .colors('rgb(175,175,175)', 'rgb(125,125,125)')

            .advancedPolygon()
            .startPoint(100 - 15 * sizeMultiplier, 42 * sizeMultiplier)
            .quadraticCurveTo(100 - 5 * sizeMultiplier, 40 * sizeMultiplier, 100 - 0 * sizeMultiplier, 50 * sizeMultiplier)
            .quadraticCurveTo(100 - 5 * sizeMultiplier, 60 * sizeMultiplier, 100 - 15 * sizeMultiplier, 58 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(125,0,255)', 'rgb(80,0,155)')
            .advancedPolygon()
            .startPoint(100 - 20 * sizeMultiplier, 35 * sizeMultiplier)
            .quadraticCurveTo(100 - 15 * sizeMultiplier, 35 * sizeMultiplier, 100 - 15 * sizeMultiplier, 40 * sizeMultiplier)
            .quadraticCurveTo(100 - 15 * sizeMultiplier, 50 * sizeMultiplier, 100 - 15 * sizeMultiplier, 60 * sizeMultiplier)
            .quadraticCurveTo(100 - 15 * sizeMultiplier, 65 * sizeMultiplier, 100 - 20 * sizeMultiplier, 65 * sizeMultiplier)
            .quadraticCurveTo(100 - 62 * sizeMultiplier, 65 * sizeMultiplier, 100 - 75 * sizeMultiplier, 60 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 40 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 40 * sizeMultiplier)
            .quadraticCurveTo(100 - 62 * sizeMultiplier, 35 * sizeMultiplier, 100 - 20 * sizeMultiplier, 35 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(175,175,175)', 'rgb(125,125,125)')
            .advancedPolygon()
            .startPoint(100 - 62 * sizeMultiplier, 37 * sizeMultiplier)
            .lineTo(100 - 62 * sizeMultiplier, 22 * sizeMultiplier)
            .lineTo(100 - 70 * sizeMultiplier, 0 * sizeMultiplier)
            .lineTo(100 - 55 * sizeMultiplier, 0 * sizeMultiplier)
            .lineTo(100 - 30 * sizeMultiplier, 20 * sizeMultiplier)
            .lineTo(100 - 20 * sizeMultiplier, 35 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(175,175,175)', 'rgb(125,125,125)')
            .advancedPolygon()
            .startPoint(100 - 62 * sizeMultiplier, 62 * sizeMultiplier)
            .lineTo(100 - 62 * sizeMultiplier, 78 * sizeMultiplier)
            .lineTo(100 - 70 * sizeMultiplier, 100 * sizeMultiplier)
            .lineTo(100 - 55 * sizeMultiplier, 100 * sizeMultiplier)
            .lineTo(100 - 30 * sizeMultiplier, 80 * sizeMultiplier)
            .lineTo(100 - 20 * sizeMultiplier, 65 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(255,0,0)', 'rgb(155,0,80)')
            .advancedPolygon()
            .startPoint(100 - 90 * sizeMultiplier, 27 * sizeMultiplier)
            .quadraticCurveTo(100 - 90 * sizeMultiplier, 25 * sizeMultiplier, 100 - 87 * sizeMultiplier, 25 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 25 * sizeMultiplier, 100 - 75 * sizeMultiplier, 35 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 65 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 75 * sizeMultiplier, 100 - 87 * sizeMultiplier, 75 * sizeMultiplier)
            .quadraticCurveTo(100 - 90 * sizeMultiplier, 75 * sizeMultiplier, 100 - 90 * sizeMultiplier, 72 * sizeMultiplier)
            .quadraticCurveTo(100 - 90 * sizeMultiplier, 50 * sizeMultiplier, 100 - 90 * sizeMultiplier, 27 * sizeMultiplier)
            .stopExecution()
            .colors('rgb(0,0,0)', 'rgb(255,255,0)')
            .line(100 - 75, 45, 100 - 70, 45)
            .line(100 - 75, 55, 100 - 70, 55)
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(0,125,255)', 'rgb(0,80,155)')
            .circle(50, 50, 15)
            .stopDrawing();
    }
}
