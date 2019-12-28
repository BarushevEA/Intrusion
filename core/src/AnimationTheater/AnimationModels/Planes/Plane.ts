import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class Plane extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Plane');
    }

    protected initShape(): void {
        const multiplier = 1;
        this.createFrame(10);
        this.getPlane(multiplier);
        this.createFrame(10);
        this.getPlaneVariantTwo(multiplier);
        this.createFrame(10);
        this.getPlaneVariantThree(multiplier);
        this.createFrame(10);
        this.getPlaneVariantFour(multiplier)
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
            .colors('rgb(0,0,175)', 'rgb(0,0,125)')
            .circle(50, 50, 15)
            .stopDrawing();
    }

    getPlaneVariantTwo(sizeMultiplier = 1) {

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
            .colors('rgb(0,0,175)', 'rgb(0,0,125)')
            .advancedPolygon()
            .startPoint(100 - 25 * sizeMultiplier, 35 * sizeMultiplier)
            .quadraticCurveTo(100 - 35 * sizeMultiplier, 25 * sizeMultiplier, 100 - 35 * sizeMultiplier, 25 * sizeMultiplier)
            .quadraticCurveTo(100 - 50 * sizeMultiplier, 25 * sizeMultiplier, 100 - 60 * sizeMultiplier, 38 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(250,250,0)', 'rgb(100,100,0)')
            .advancedPolygon()
            .startPoint(100 - 60 * sizeMultiplier, 38 * sizeMultiplier)
            .lineTo(100 - 80, 30)
            .lineTo(100 - 90, 30)
            .lineTo(100 - 75, 40)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(3)
            .colors('rgb(0,0,0)', 'rgb(250,0,0)')
            .advancedPolygon()
            .startPoint(100 - 90 * sizeMultiplier, 30 * sizeMultiplier)
            .lineTo(100 - 75, 30)
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
            .quadraticCurveTo(100 - 62 * sizeMultiplier, 65 * sizeMultiplier, 100 - 75 * sizeMultiplier, 50 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 40 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 40 * sizeMultiplier)
            .quadraticCurveTo(100 - 62 * sizeMultiplier, 35 * sizeMultiplier, 100 - 20 * sizeMultiplier, 35 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(175,175,175)', 'rgb(125,125,125)')
            .advancedPolygon()
            .startPoint(100 - 20 * sizeMultiplier, 50 * sizeMultiplier)
            .quadraticCurveTo(100 - 21 * sizeMultiplier, 51 * sizeMultiplier, 100 - 25 * sizeMultiplier, 52 * sizeMultiplier)
            .lineTo(100 - 70 * sizeMultiplier, 52 * sizeMultiplier)
            .lineTo(100 - 70 * sizeMultiplier, 48 * sizeMultiplier)
            .lineTo(100 - 20 * sizeMultiplier, 48 * sizeMultiplier)
            .quadraticCurveTo(100 - 19 * sizeMultiplier, 49 * sizeMultiplier, 100 - 20 * sizeMultiplier, 50 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
    }

    getPlaneVariantThree(sizeMultiplier = 1) {
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
            .startDrawing();
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
    }

    getPlaneVariantFour(sizeMultiplier = 1) {

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
            .colors('rgb(0,0,175)', 'rgb(0,0,125)')
            .advancedPolygon()
            .startPoint(100 - 25 * sizeMultiplier, 65 * sizeMultiplier)
            .quadraticCurveTo(100 - 35 * sizeMultiplier, 75 * sizeMultiplier, 100 - 35 * sizeMultiplier, 75 * sizeMultiplier)
            .quadraticCurveTo(100 - 50 * sizeMultiplier, 75 * sizeMultiplier, 100 - 60 * sizeMultiplier, 62 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(250,250,0)', 'rgb(100,100,0)')
            .advancedPolygon()
            .startPoint(100 - 60 * sizeMultiplier, 62 * sizeMultiplier)
            .lineTo(100 - 80, 70)
            .lineTo(100 - 90, 70)
            .lineTo(100 - 75, 60)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(3)
            .colors('rgb(0,0,0)', 'rgb(250,0,0)')
            .advancedPolygon()
            .startPoint(100 - 90 * sizeMultiplier, 70 * sizeMultiplier)
            .lineTo(100 - 75, 70)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(125,0,255)', 'rgb(80,0,155)')
            .advancedPolygon()
            .startPoint(100 - 20 * sizeMultiplier, 65 * sizeMultiplier)
            .quadraticCurveTo(100 - 15 * sizeMultiplier, 65 * sizeMultiplier, 100 - 15 * sizeMultiplier, 60 * sizeMultiplier)
            .quadraticCurveTo(100 - 15 * sizeMultiplier, 50 * sizeMultiplier, 100 - 15 * sizeMultiplier, 40 * sizeMultiplier)
            .quadraticCurveTo(100 - 15 * sizeMultiplier, 35 * sizeMultiplier, 100 - 20 * sizeMultiplier, 35 * sizeMultiplier)
            .quadraticCurveTo(100 - 62 * sizeMultiplier, 35 * sizeMultiplier, 100 - 75 * sizeMultiplier, 50 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 60 * sizeMultiplier)
            .quadraticCurveTo(100 - 75 * sizeMultiplier, 50 * sizeMultiplier, 100 - 75 * sizeMultiplier, 60 * sizeMultiplier)
            .quadraticCurveTo(100 - 62 * sizeMultiplier, 65 * sizeMultiplier, 100 - 20 * sizeMultiplier, 65 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
        this.shape
            .lineWidth(2)
            .colors('rgb(175,175,175)', 'rgb(125,125,125)')
            .advancedPolygon()
            .startPoint(100 - 20 * sizeMultiplier, 50 * sizeMultiplier)
            .quadraticCurveTo(100 - 21 * sizeMultiplier, 51 * sizeMultiplier, 100 - 25 * sizeMultiplier, 52 * sizeMultiplier)
            .lineTo(100 - 70 * sizeMultiplier, 52 * sizeMultiplier)
            .lineTo(100 - 70 * sizeMultiplier, 48 * sizeMultiplier)
            .lineTo(100 - 20 * sizeMultiplier, 48 * sizeMultiplier)
            .quadraticCurveTo(100 - 19 * sizeMultiplier, 49 * sizeMultiplier, 100 - 20 * sizeMultiplier, 50 * sizeMultiplier)
            .stopExecution()
            .stopDrawing();
    }
}

