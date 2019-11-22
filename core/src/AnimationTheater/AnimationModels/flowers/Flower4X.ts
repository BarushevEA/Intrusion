import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IPoint} from "../../../AnimationCore/AnimationEngine/LayerHandler/ShapeHandler";

export class Flower4X extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 35, 20);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Flower4X');
    }

    protected initShape(): void {
        const sizeMultiplier = 4;
        this.width *= sizeMultiplier;
        this.height *= sizeMultiplier;

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

        this.createFrame(0);
        this.shape
            .lineWidth(1)
            .customStroke(true)
            .colors('', 'rgb(0,255,0)')
            .polygon(stem)
            .customStroke(false)
            .colors('rgb(0,255,0)', 'rgba(0,0,0,0.5)')
            .polygon(leaf)
            .colors('rgb(255,0,100)', 'rgb(50,0,5)')
            .polygon(petal1)
            .polygon(petal2)
            .polygon(petal3);

        function multiply(arr: IPoint[]) {
            arr.forEach(element => {
                element.x *= sizeMultiplier;
                element.y *= sizeMultiplier;
            });
        }
    }
}
