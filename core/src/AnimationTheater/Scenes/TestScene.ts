import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {HexagonGreed} from "../AnimationModels/HexagonGreed";
import {SnakeSpiral} from "../AnimationModels/SnakeSpiral";
import {MovedCircle} from "../AnimationModels/MovedCircle";
import {AnimatedRectangleLightGray} from "../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {AnimatedRectangleLightCyan} from "../AnimationModels/rectangles/AnimatedRectangleLightCyan";
import {AbstractCustomDraw} from "../../AnimationCore/AnimationEngine/rootModels/AbstractCustomDraw";
import {AnimatedRectangleLightYellow} from "../AnimationModels/rectangles/AnimatedRectangleLightYellow";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {AnimatedRectangleLightGreen} from "../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedWave} from "../AnimationModels/AnimatedWave";
import {AnimatedWaveDark} from "../AnimationModels/AnimatedWaveDark";

export class TestScene extends AbstractScene {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const hexagon = new HexagonGreed(this.generalLayer);
        this.setActor(hexagon);
        const wave = new AnimatedWave(this.generalLayer);
        const wave1 = new AnimatedWaveDark(this.generalLayer);
        const wave2 = new AnimatedWave(this.generalLayer);
        const wave3 = new AnimatedWaveDark(this.generalLayer);
        wave1.elementY = 470;
        wave2.elementY = 485;
        wave.elementY = 500;
        wave3.elementY = 515;
        wave1.setFramesDelay(0);
        wave2.setFramesDelay(1);
        wave.setFramesDelay(2);
        wave3.setFramesDelay(3);

        wave1.setShowedFrame(15);
        wave2.setShowedFrame(43);
        wave3.setShowedFrame(56);

        console.log(wave2.framePool);

        const arr: AbstractCustomDraw[] = [];
        for (let k = 0; k < 6; k++) {
            for (let i = 0; i < 10; i++) {
                let rectangle0;
                if (i === 9 && k == 5) {
                    rectangle0 = new AnimatedRectangleLightYellow(this.generalLayer);
                } else {
                    if (i < 7) {
                        rectangle0 = new AnimatedRectangleLightGray(this.generalLayer);
                    } else {
                        if (i === 7 && k == 5) {
                            rectangle0 = new AnimatedRectangleLightGreen(this.generalLayer);
                        } else if (i === 8 && k == 5) {
                            rectangle0 = new AnimatedRectangleLightRed(this.generalLayer);
                        } else {
                            rectangle0 = new AnimatedRectangleLightCyan(this.generalLayer);
                        }
                    }
                }
                rectangle0.elementX = i * 100 - 50;
                rectangle0.elementY = k * 100;
                arr.push(rectangle0);
            }
        }

        let counter = 100;
        let dx = 3;
        let move = <any>0;

        const recMoveStart = () => {
            if (!move) {
                move = AbstractCustomDraw.tickCount$.subscribe(recMove.bind(this));
                this.collect(move);
            }
        };

        const recMove = () => {
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

        this.setActor(wave3);
        this.setActor(wave);

        arr.forEach(el => {
            this.setActor(el)
        });

        this.setActor(wave1);

        const snakeSpiral = new SnakeSpiral(this.generalLayer);
        this.setActor(snakeSpiral);

        for (let i = 0; i < 50; i++) {
            const circle = new MovedCircle(this.generalLayer);
            this.collect(circle.isMouseOver$.subscribe(() => {
                circle.moreSpeed();
            }));
            this.setActor(circle);
        }

        arr.forEach(el => {
            this.collect(el.isMouseOver$.subscribe(isOver => {
                if (isOver) {
                    el.setAnimationReverse();
                } else {
                    el.setAnimationOriginal();
                }
            }));
        });

        this.collect(
            arr[59].isMouseClick$.subscribe(() => {
                recMoveStart();
            }),
            arr[58].isMouseClick$.subscribe(() => {
                this.destroySubscriber(move);
                move = <any>0;
            }),
            arr[57].isMouseClick$.subscribe(() => {
                this.renderStop();
            }),
            arr[56].isMouseClick$.subscribe(() => {
                this.renderStart(true);
            }),
            arr[55].isMouseClick$.subscribe(() => {
                this.exit();
            }),
        );

        this.setActor(wave2);

        this.userData = {
            test: 123,
            status: 'Ok'
        }
    }
}
