import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor";
import {ISubscriptionLike} from "../../../../AnimationCore/CustomeLibraries/Observable";
import {BrickWall} from "../../../AnimationModels/briks/BrickWall";
import {ELayers} from "../../scenesEnvironment";

let brickNumber: number,
    brickCounter: number,
    bricks: { actor: AbstractActor, x: number, y: number }[],
    bricksSubscriber: ISubscriptionLike;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    brickNumber = 0;
    brickCounter = brickNumber;
    bricks = [];
    bricksSubscriber = <any>0;
}

function initActors(scene: AbstractScene) {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 13; j++) {
            const brickWall = new BrickWall(scene.generalLayer);
            brickWall.xPos = brickWall.width * j;
            brickWall.yPos = brickWall.height * i;
            scene.setActors(brickWall);
            bricks.push({actor: brickWall, x: brickWall.xPos, y: brickWall.yPos});
        }
    }
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onStart$.subscribe(() => {
            startMove(scene);
            scene.collect(bricksSubscriber);
        }),
        scene.onStop$.subscribe(() => {
            stopMove(scene);
        }),
        scene.onExit$.subscribe(() => {
            stopMove(scene);
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}

const startMove = (scene: AbstractScene) => {
    const speed = 5;
    brickNumber = bricks[0].actor.width;
    brickNumber /= speed;
    brickCounter = brickNumber;
    scene.collect(bricksSubscriber = scene.tickCount$.subscribe(() => {
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i].actor;
            brick.xPos -= speed;
            if (brickCounter <= 1) {
                brick.xPos = bricks[i].x;
            }
        }
        if (brickCounter <= 1) {
            brickCounter = brickNumber;
        } else {
            brickCounter--;
        }
    }));
};

const stopMove = (scene: AbstractScene) => {
    scene.unsubscribe(bricksSubscriber);
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i].actor;
        brick.xPos = bricks[i].x;
        brick.yPos = bricks[i].y;
    }
    brickCounter = brickNumber;
};

