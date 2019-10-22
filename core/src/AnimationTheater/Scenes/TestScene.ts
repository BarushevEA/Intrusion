import {AbstractScene, IDragDropOptions} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {HexagonGreed} from "../AnimationModels/HexagonGreed";
import {SnakeSpiral} from "../AnimationModels/SnakeSpiral";
import {MovedCircle} from "../AnimationModels/MovedCircle";
import {AnimatedRectangleLightGray} from "../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {AnimatedRectangleLightCyan} from "../AnimationModels/rectangles/AnimatedRectangleLightCyan";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {AnimatedRectangleLightYellow} from "../AnimationModels/rectangles/AnimatedRectangleLightYellow";
import {AnimatedRectangleLightRed} from "../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {AnimatedRectangleLightGreen} from "../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedWave} from "../AnimationModels/waves/AnimatedWave";
import {AnimatedWaveDark} from "../AnimationModels/waves/AnimatedWaveDark";
import {ButtonExit} from "../AnimationModels/Buttons/ButtonExit";
import {ButtonGreenWithText} from "../AnimationModels/Buttons/ButtonGreenWithText";
import {ButtonRedWithText} from "../AnimationModels/Buttons/ButtonRedWithText";
import {ButtonBlueWithText} from "../AnimationModels/Buttons/ButtonBlueWithText";
import {ButtonYellowWithText} from "../AnimationModels/Buttons/ButtonYellowWithText";
import {ButtonGrayWithText} from "../AnimationModels/Buttons/ButtonGrayWithText";
import {Heart} from "../AnimationModels/Heart";

export class TestScene extends AbstractScene {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        const buttonExit = new ButtonExit(this.generalLayer);
        const buttonMove = new ButtonGreenWithText(this.generalLayer, 'Move');
        const buttonStop = new ButtonRedWithText(this.generalLayer, 'Stop');
        const buttonPlay = new ButtonBlueWithText(this.generalLayer, 'Play');
        const buttonPause = new ButtonYellowWithText(this.generalLayer, 'Pause');
        const buttonInvisible = new ButtonGrayWithText(this.generalLayer, 'Invert');
        const heart = new Heart(this.generalLayer);
        heart.elementX = this.generalLayer.width - buttonExit.elementWidth - heart.elementWidth;
        buttonExit.elementX = this.generalLayer.width - buttonExit.elementWidth;
        buttonPause.elementX = buttonPause.elementWidth;
        buttonPlay.elementX = 0;
        buttonMove.elementX = buttonMove.elementWidth * 2;
        buttonStop.elementX = buttonStop.elementWidth * 3;
        buttonInvisible.elementX = buttonInvisible.elementWidth * 5;

        this.userData = {
            test: 123,
            status: 'Ok'
        };

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

        const draws: AbstractActor[] = [];
        for (let i = 0; i < 3; i++) {
            const newHeart = new Heart(this.generalLayer);
            newHeart.elementX = Math.round(Math.random() * this.generalLayer.width / 2);
            newHeart.elementY = Math.round(Math.random() * this.generalLayer.height / 2);
            draws.push(newHeart);
        }
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
                draws.push(rectangle0);
            }
        }

        let counter = 100;
        let dx = 3;
        let move = <any>0;

        const recMoveStart = () => {
            if (!move) {
                move = AbstractActor.tickCount$.subscribe(recMove.bind(this));
                this.collect(move);
            }
        };

        const recMove = () => {
            draws.forEach(el => {
                el.elementX += dx;
            });
            counter--;
            if (counter < 1) {
                counter = 100;
                dx *= -1;
            }
        };

        let isReverse = true;

        function toggleReverse() {
            if (isReverse) {
                draws.forEach(el => {
                    el.setAnimationReverse();
                });
            } else {
                draws.forEach(el => {
                    el.setAnimationOriginal();
                });
            }
            isReverse = !isReverse;
        }

        this.setActor(wave3);
        this.setActor(wave);

        draws.forEach(el => {
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

        this.setActor(wave2);
        this.setActor(buttonExit);
        this.setActor(buttonPause);
        this.setActor(buttonPlay);
        this.setActor(buttonMove);
        this.setActor(buttonStop);
        this.setActor(heart);
        this.setActor(buttonInvisible);

        this.moveOnMouseDrag(heart);

        const movedOptions: IDragDropOptions = {};

        draws.forEach(el => {
            movedOptions.callbackOnDrag = el.setAnimationOriginal.bind(el);

            this.moveOnMouseDrag(el, movedOptions);
            this.collect(
                el.isMouseOver$.subscribe(isOver => {
                    if (isOver) {
                        el.setAnimationReverse();
                    } else {
                        el.setAnimationOriginal();
                    }
                }));
        });

        this.collect(
            buttonExit.isMouseClick$.subscribe(() => {
                this.userData.test++;
                this.exit();
            }),
            buttonMove.isMouseClick$.subscribe(() => {
                recMoveStart();
            }),
            buttonStop.isMouseClick$.subscribe(() => {
                this.destroySubscriber(move);
                move = <any>0;
            }),
            buttonPlay.isMouseClick$.subscribe(() => {
                this.renderStart(true);
            }),
            buttonPause.isMouseClick$.subscribe(() => {
                this.renderStop();
            }),
            buttonInvisible.isMouseClick$.subscribe(() => {
                toggleReverse();
            })
        );
    }
}
