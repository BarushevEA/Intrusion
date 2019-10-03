import {AbstractScene} from "../AnimationEngine/AbstractScene";
import {IRenderController} from "../AnimationEngine/RenderController";
import {HexagonGreed} from "../AnimationModels/HexagonGreed";
import {SnakeSpiral} from "../AnimationModels/SnakeSpiral";
import {MovedCircle} from "../AnimationModels/MovedCircle";
import {AnimatedRectangle1} from "../AnimationModels/AnimatedRectangle1";

export class TestScene extends AbstractScene {
    constructor(canvas: HTMLCanvasElement, renderController: IRenderController) {
        super(canvas, renderController);
    }

    protected createScene(): void {
        const hexagon = new HexagonGreed(this.customCanvas);
        hexagon.setName('hexagon');
        this.setActor(hexagon);

        const arr: AnimatedRectangle1[] = [];
        for (let k = 0; k < 6; k++) {
            for (let i = 0; i < 10; i++) {
                const rectangle0 = new AnimatedRectangle1(this.customCanvas);
                rectangle0.setName('rectangle' + i);
                rectangle0.elementX = 100 + i * 100;
                rectangle0.elementY = k * 100;
                arr.push(rectangle0);
            }
        }

        let counter = 100;
        let dx = 5;
        const recMove = () => {
            requestAnimationFrame(recMove);
            arr.forEach(el => {
                el.elementX += dx;
            });
            counter--;
            if (counter < 1) {
                counter = 100;
                dx *= -1;
            }
        };

        setTimeout(() => {
            arr[0].resetStopFrame();
        }, 5000);

        arr.forEach(el => this.setActor(el));

        const snakeSpiral = new SnakeSpiral(this.customCanvas);
        snakeSpiral.setName('spaceSpiral');
        this.setActor(snakeSpiral);

        for (let i = 0; i < 50; i++) {
            const circle = new MovedCircle(this.customCanvas);
            circle.setName('circles' + i);
            this.setActor(circle);
        }
        requestAnimationFrame(recMove);
    }
}
