import {AbstractScene, IDragDropOptions} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {ISubscriptionLike} from "../../../../AnimationCore/Libraries/Observable";
import {Heart} from "../../../AnimationModels/Heart";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {AnimatedRectangleLightYellow} from "../../../AnimationModels/rectangles/AnimatedRectangleLightYellow";
import {AnimatedRectangleLightGray} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {AnimatedRectangleLightGreen} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedRectangleLightRed} from "../../../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {AnimatedRectangleLightCyan} from "../../../AnimationModels/rectangles/AnimatedRectangleLightCyan";
import {AnimatedWave} from "../../../AnimationModels/waves/AnimatedWave";
import {AnimatedWaveDark} from "../../../AnimationModels/waves/AnimatedWaveDark";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {SnakeSpiral} from "../../../AnimationModels/SnakeSpiral";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";
import {cursorHandler} from "./cursor";
import {MoveUpOnKeyPress} from "../../../../AnimationCore/AnimationEngine/Plugins/MoveUpOnKeyPress";
import {MoveDownOnKeyPress} from "../../../../AnimationCore/AnimationEngine/Plugins/MoveDownOnKeyPress";
import {MoveLeftOnKeyPress} from "../../../../AnimationCore/AnimationEngine/Plugins/MoveLeftOnKeyPress";
import {MoveRightOnKeyPress} from "../../../../AnimationCore/AnimationEngine/Plugins/MoveRightOnKeyPress";

export const isStopMove = {value: true};
export const move = {value: <ISubscriptionLike><any>0};
export const moveHeart = {
    up: <ISubscriptionLike><any>0,
    down: <ISubscriptionLike><any>0,
    left: <ISubscriptionLike><any>0,
    right: <ISubscriptionLike><any>0
};

let isReverse: boolean;
let counter: number;
let dx: number;

let heart: AbstractActor;
let actorGroup: AbstractActor[];
let wave: AbstractFramedShape;
let wave1: AbstractFramedShape;
let wave2: AbstractFramedShape;
let wave3: AbstractFramedShape;
let snakeSpiral: AbstractFramedShape;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    isStopMove.value = true;
    if (move.value) {
        move.value.unsubscribe();
        move.value = <any>0;
    }
    if (moveHeart.up) {
        moveHeart.up.unsubscribe();
        moveHeart.up = <any>0;
    }
    if (moveHeart.down) {
        moveHeart.down.unsubscribe();
        moveHeart.down = <any>0;
    }
    if (moveHeart.left) {
        moveHeart.left.unsubscribe();
        moveHeart.left = <any>0;
    }
    if (moveHeart.right) {
        moveHeart.right.unsubscribe();
        moveHeart.right = <any>0;
    }

    isReverse = true;
    counter = 100;
    dx = 3;

    heart = <any>0;
    actorGroup = [];
    wave = <any>0;
    wave1 = <any>0;
    wave2 = <any>0;
    wave3 = <any>0;
    snakeSpiral = <any>0;
}

function initActors(scene: AbstractScene) {
    snakeSpiral = new SnakeSpiral(scene.generalLayer);
    heart = new Heart(scene.generalLayer);
    wave = new AnimatedWave(scene.generalLayer);
    wave1 = new AnimatedWaveDark(scene.generalLayer);
    wave2 = new AnimatedWave(scene.generalLayer);
    wave3 = new AnimatedWaveDark(scene.generalLayer);

    heart.xPos = scene.generalLayer.width - heart.width;
    heart.yPos = scene.generalLayer.height - heart.height * 2;

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

    for (let i = 0; i < 3; i++) {
        const newHeart = new Heart(scene.generalLayer);
        newHeart.xPos = Math.round(Math.random() * scene.generalLayer.width / 2);
        newHeart.yPos = Math.round(Math.random() * scene.generalLayer.height / 2);
        actorGroup.push(newHeart);
    }

    for (let k = 0; k < 6; k++) {
        for (let i = 0; i < 10; i++) {
            let rectangle0;
            if (i === 9 && k == 5) {
                rectangle0 = new AnimatedRectangleLightYellow(scene.generalLayer);
            } else {
                if (i < 7) {
                    rectangle0 = new AnimatedRectangleLightGray(scene.generalLayer);
                } else {
                    if (i === 7 && k == 5) {
                        rectangle0 = new AnimatedRectangleLightGreen(scene.generalLayer);
                    } else if (i === 8 && k == 5) {
                        rectangle0 = new AnimatedRectangleLightRed(scene.generalLayer);
                    } else {
                        rectangle0 = new AnimatedRectangleLightCyan(scene.generalLayer);
                    }
                }
            }
            rectangle0.xPos = i * 100 - 50;
            rectangle0.yPos = k * 100;
            actorGroup.push(rectangle0);
        }
    }

    actorGroup.forEach(el => {
        scene.setActors(el)
    });

    scene.setActors(
        heart,
        wave3,
        wave,
        wave1,
        wave2,
        snakeSpiral
    );
}

function initActions(scene: AbstractScene) {
    scene.moveOnMouseDrag(heart);
    scene.moveOnMouseDrag(snakeSpiral);
    const movedOptions: IDragDropOptions = {};
    initHeartMoveOnKeyPress(scene);

    actorGroup.forEach(el => {
        movedOptions.callbackOnDrag = el.setAnimationOriginal.bind(el);

        scene.moveOnMouseDrag(el, movedOptions);
        scene.collect(
            el.isMouseOver$.subscribe(isOver => {
                cursorHandler.pointerOrDefaultChange(scene, el);
                if (isOver) {
                    el.setAnimationReverse();
                } else {
                    el.setAnimationOriginal();
                }
            }),
            el.isMouseLeftDrag$.subscribe(() => {
                scene.cursor.setType(ECursor.CATCH);
            }),
            el.isMouseLeftDrop$.subscribe(() => {
                scene.cursor.setType(ECursor.POINTER);
            }),
        );
    });

    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        }),
        snakeSpiral.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, snakeSpiral);
        }),
        snakeSpiral.isMouseLeftDrag$.subscribe(() => {
            scene.cursor.setType(ECursor.CATCH);
        }),
        snakeSpiral.isMouseLeftDrop$.subscribe(() => {
            scene.cursor.setType(ECursor.POINTER);
        }),
        heart.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, heart);
        }),
        heart.isMouseLeftDrag$.subscribe(() => {
            scene.cursor.setType(ECursor.CATCH);
        }),
        heart.isMouseLeftDrop$.subscribe(() => {
            scene.cursor.setType(ECursor.POINTER);
        }),
        heart.isMouseRightClick$.subscribe((isDown) => {
            if (isDown) {
                const newHeart = new Heart(scene.generalLayer);
                newHeart.xPos = heart.xPos;
                newHeart.yPos = heart.yPos;
                scene.setActors(newHeart);
                newHeart.enableEvents();
                setTimeout(() => {
                    scene.moveOnMouseDrag(newHeart);
                    scene.collect(
                        newHeart.isMouseOver$.subscribe(() => {
                            cursorHandler.pointerOrDefaultChange(scene, newHeart);
                        }),
                        newHeart.isMouseLeftDrag$.subscribe(() => {
                            scene.cursor.setType(ECursor.CATCH);
                        }),
                        newHeart.isMouseLeftDrop$.subscribe(() => {
                            scene.cursor.setType(ECursor.POINTER);
                        }),
                    );
                }, 300);
            }
        })
    );
}

const recMove = () => {
    if (isStopMove.value) {
        return;
    }
    actorGroup.forEach(el => {
        el.xPos += dx;
    });
    counter--;
    if (counter < 1) {
        counter = 100;
        dx *= -1;
    }
};

export function recMoveStart(scene: AbstractScene) {
    if (!move.value) {
        move.value = scene.tickCount$
            .subscribe(recMove.bind(scene));
        scene.collect(move.value);
    }
}

export function toggleReverse() {
    if (isReverse) {
        actorGroup.forEach(el => {
            el.setAnimationReverse();
        });
    } else {
        actorGroup.forEach(el => {
            el.setAnimationOriginal();
        });
    }
    isReverse = !isReverse;
}

function initHeartMoveOnKeyPress(scene: AbstractScene) {
    const moveHeartUp = new MoveUpOnKeyPress(scene, 'w');
    const moveHeartDown = new MoveDownOnKeyPress(scene, 's');
    const moveHeartLeft = new MoveLeftOnKeyPress(scene, 'a');
    const moveHeartRight = new MoveRightOnKeyPress(scene, 'd');
    heart.pluginDock.add(moveHeartUp);
    heart.pluginDock.add(moveHeartDown);
    heart.pluginDock.add(moveHeartLeft);
    heart.pluginDock.add(moveHeartRight);
}
