import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {HexagonGreed} from "../AnimationModels/HexagonGreed";
import {SnakeSpiral} from "../AnimationModels/SnakeSpiral";
import {MovedCircle} from "../AnimationModels/MovedCircle";
import {AnimatedRectangleLightGray} from "../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {AnimatedRectangleLightCyan} from "../AnimationModels/rectangles/AnimatedRectangleLightCyan";
import {AbstractCustomDraw} from "../../AnimationCore/AnimationEngine/rootModels/AbstractCustomDraw";
import {AnimatedRectangleLightYellow} from "../AnimationModels/rectangles/AnimatedRectangleLightYellow";

export class TestScene extends AbstractScene {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const hexagon = new HexagonGreed(this.customCanvas);
        hexagon.setName('hexagon');
        this.setActor(hexagon);

        const arr: AbstractCustomDraw[] = [];
        for (let k = 0; k < 6; k++) {
            for (let i = 0; i < 10; i++) {
                let rectangle0;
                if (i === 9 && k == 5) {
                    rectangle0 = new AnimatedRectangleLightYellow(this.customCanvas);
                } else {
                    if (i < 8) {
                        rectangle0 = new AnimatedRectangleLightGray(this.customCanvas);
                    } else {
                        rectangle0 = new AnimatedRectangleLightCyan(this.customCanvas);
                    }
                }
                rectangle0.setName('rectangle' + i);
                rectangle0.elementX = i * 100 - 50;
                rectangle0.elementY = k * 100;
                arr.push(rectangle0);
            }
        }

        let counter = 100;
        let dx = 3;
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

        let isReverse = true;

        setInterval(() => {
            if (isReverse) {
                arr.forEach(el => {
                    el.setAnimationReverse();
                });
            } else {
                arr.forEach(el => {
                    el.setAnimationOriginal();
                });
            }
            isReverse = !isReverse;
        }, 10000);

        arr.forEach(el => {
            this.setActor(el)
        });

        const snakeSpiral = new SnakeSpiral(this.customCanvas);
        snakeSpiral.setName('spaceSpiral');
        this.setActor(snakeSpiral);

        for (let i = 0; i < 50; i++) {
            const circle = new MovedCircle(this.customCanvas);
            circle.setName('circles' + i);
            this.collect(circle.isMouseOver$.subscribe(() => {
                circle.moreSpeed();
            }));
            this.setActor(circle);
        }

        arr.forEach(el => {
            this.collect(el.isMouseOver$.subscribe(isOver => {
                if (isOver) {
                    el.setAnimationReverse();
                    // setTimeout(() => {
                    //     el.setAnimationOriginal();
                    // }, 300);
                } else {
                    el.setAnimationOriginal();
                }
            }));
        });

        this.collect(arr[59].isMouseClick$.subscribe(() => {
            requestAnimationFrame(recMove);
        }));

        this.userData = {
            test: 123,
            status: 'Ok'
        }
    }
}
