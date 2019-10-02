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
        this.actors.push(hexagon);

        const snakeSpiral = new SnakeSpiral(this.customCanvas);
        snakeSpiral.setName('spaceSpiral');
        this.actors.push(snakeSpiral);


        for (let i = 0; i < 50; i++) {
            const circle = new MovedCircle(this.customCanvas);
            circle.setName('circles' + i);
            this.actors.push(circle);
        }

        const rectangle1 = new AnimatedRectangle1(this.customCanvas);
        rectangle1.setName('rectangle1');
        this.actors.push(rectangle1);
    }
}
