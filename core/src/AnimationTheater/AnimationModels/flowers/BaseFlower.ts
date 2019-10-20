import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IPoint} from "../../../AnimationCore/AnimationEngine/LayerHandler/ShapeHandler";

export class Flower extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 35, 20);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Flower');
    }

    protected initShape(): void {
        const sizeMultiplier = 1;
        this.elementWidth *= sizeMultiplier;
        this.elementHeight *= sizeMultiplier;

        const stem: IPoint[] = [
            {x: 4, y: 35},
            {x: 4, y: 33},
            {x: 6, y: 30},
            {x: 8, y: 28},
            {x: 8, y: 25},
            {x: 6, y: 23},
            {x: 4, y: 20},
            {x: 4, y: 18},
        ];
        const leaf: IPoint[] = [
            {x: 10, y: 28},
            {x: 13, y: 22},
            {x: 16, y: 12},
            {x: 10, y: 20},
        ];
        const petal1: IPoint[] = [
            {x: 4, y: 18},
            {x: 1, y: 17},
            {x: 0, y: 15},
            {x: 0, y: 7},
            {x: 2, y: 10},
            {x: 3, y: 15},
        ];
        const petal2: IPoint[] = [
            {x: 4, y: 18},
            {x: 6, y: 17},
            {x: 8, y: 15},
            {x: 8, y: 7},
            {x: 6, y: 10},
            {x: 5, y: 15},
        ];
        const petal3: IPoint[] = [
            {x: 4, y: 18},
            {x: 5, y: 15},
            {x: 6, y: 10},
            {x: 4, y: 5},
            {x: 2, y: 10},
            {x: 3, y: 15},
        ];

        multiply(stem);
        multiply(leaf);
        multiply(petal1);
        multiply(petal2);
        multiply(petal3);

        this.shape.setLineWidth(1);
        this.createFrame(0);
        this.shape.isCustomStroke = true;
        this.shape.setColors('', 'rgb(0,255,0)');
        this.shape.drawPolygon(stem);
        this.shape.isCustomStroke = false;

        this.shape.setColors('rgb(0,255,0)', 'rgba(0,0,0,0.5)');
        this.shape.drawPolygon(leaf);

        this.shape.setColors('rgb(255,0,100)', 'rgb(50,0,5)');
        this.shape.drawPolygon(petal1);
        this.shape.drawPolygon(petal2);
        this.shape.drawPolygon(petal3);

        function multiply(arr: IPoint[]) {
            arr.forEach(element => {
                element.x *= sizeMultiplier;
                element.y *= sizeMultiplier;
            });
        }
    }
}
