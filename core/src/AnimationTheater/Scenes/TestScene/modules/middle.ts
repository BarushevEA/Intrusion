import {AbstractScene, IDragDropOptions} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {ISubscriptionLike} from "../../../../AnimationCore/CustomeLibraries/Observable";
import {Heart} from "../../../AnimationModels/Heart";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {AnimatedRectangleLightYellow} from "../../../AnimationModels/rectangles/AnimatedRectangleLightYellow";
import {AnimatedRectangleLightGray} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {AnimatedRectangleLightGreen} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedRectangleLightRed} from "../../../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {AnimatedRectangleLightCyan} from "../../../AnimationModels/rectangles/AnimatedRectangleLightCyan";
import {AnimatedWave} from "../../../AnimationModels/waves/AnimatedWave";
import {AnimatedWaveDark} from "../../../AnimationModels/waves/AnimatedWaveDark";
import {AbstractFramedShape} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {SnakeSpiral} from "../../../AnimationModels/SnakeSpiral";

export const isStopMove = {value: true};
export const move = {value: <ISubscriptionLike><any>0};

let isReverse = true;
let counter = 100;
let dx = 3;

let heart: AbstractActor = <any>0;
const draws: AbstractActor[] = [];
let wave: AbstractFramedShape = <any>0;
let wave1: AbstractFramedShape = <any>0;
let wave2: AbstractFramedShape = <any>0;
let wave3: AbstractFramedShape = <any>0;
let snakeSpiral: AbstractFramedShape = <any>0;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    initActors(scene);
    initActions(scene);
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
        draws.push(newHeart);
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
            draws.push(rectangle0);
        }
    }

    draws.forEach(el => {
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
    const movedOptions: IDragDropOptions = {};

    draws.forEach(el => {
        movedOptions.callbackOnDrag = el.setAnimationOriginal.bind(el);

        scene.moveOnMouseDrag(el, movedOptions);
        scene.collect(
            el.isMouseOver$.subscribe(isOver => {
                if (isOver) {
                    el.setAnimationReverse();
                } else {
                    el.setAnimationOriginal();
                }
            }));
    });
}

const recMove = () => {
    if (isStopMove.value) {
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

export function recMoveStart(scene: AbstractScene) {
    if (!move.value) {
        move.value = AbstractActor.tickCount$.subscribe(recMove.bind(scene));
        scene.collect(move.value);
    }
}

export function toggleReverse() {
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
