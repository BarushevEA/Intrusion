import {AbstractScene, IDragDropOptions} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {HexagonGreed} from "../AnimationModels/HexagonGreed";
import {SnakeSpiral} from "../AnimationModels/SnakeSpiral";
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
import {E_Scene} from "../Scenario/types";

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
        heart.xPos = this.generalLayer.width - buttonExit.width - heart.width;
        buttonExit.xPos = this.generalLayer.width - buttonExit.width;
        buttonPause.xPos = buttonPause.width;
        buttonPlay.xPos = 0;
        buttonMove.xPos = buttonMove.width * 2;
        buttonStop.xPos = buttonStop.width * 3;
        buttonInvisible.xPos = buttonInvisible.width * 5;
        let isStopMove = false;

        this.userData = {
            test: 123,
            status: 'Ok'
        };

        const hexagon = new HexagonGreed(this.generalLayer);
        this.setActors(hexagon);
        this.setActiveLayer('middle');

        const wave = new AnimatedWave(this.generalLayer);
        const wave1 = new AnimatedWaveDark(this.generalLayer);
        const wave2 = new AnimatedWave(this.generalLayer);
        const wave3 = new AnimatedWaveDark(this.generalLayer);
        wave1.yPos = 470;
        wave2.yPos = 485;
        wave.yPos = 500;
        wave3.yPos = 515;
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
            newHeart.xPos = Math.round(Math.random() * this.generalLayer.width / 2);
            newHeart.yPos = Math.round(Math.random() * this.generalLayer.height / 2);
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
                rectangle0.xPos = i * 100 - 50;
                rectangle0.yPos = k * 100;
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
            if (isStopMove) {
                return;
            }
            draws.forEach(el => {
                el.xPos += dx;
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

        this.setActors(wave3);
        this.setActors(wave);

        draws.forEach(el => {
            this.setActors(el)
        });

        this.setActors(wave1);

        const snakeSpiral = new SnakeSpiral(this.generalLayer);
        this.setActors(snakeSpiral);

        this.setActors(wave2);
        this.setActors(heart);
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
                this.userData.nextScene = E_Scene.MENU;
                this.exit();
            }),
            buttonMove.isMouseClick$.subscribe(() => {
                recMoveStart();
            }),
            buttonStop.isMouseClick$.subscribe(() => {
                this.unsubscribe(move);
                move = <any>0;
            }),
            buttonPlay.isMouseClick$.subscribe(() => {
                this.start(true);
            }),
            buttonPause.isMouseClick$.subscribe(() => {
                this.stop();
            }),
            buttonInvisible.isMouseClick$.subscribe(() => {
                toggleReverse();
            }),
            this.onStart$.subscribe(() => {
                isStopMove = false;
            }),
            this.onExit$.subscribe(() => {
                isStopMove = true;
            })
        );

        this.setActiveLayer('buttons');
        this.setActors(buttonExit);
        this.setActors(buttonPause);
        this.setActors(buttonPlay);
        this.setActors(buttonMove);
        this.setActors(buttonStop);
        this.setActors(buttonInvisible);
    }
}
