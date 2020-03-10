import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {HorizontalBackground} from "../../../AnimationModels/HorizontalBackground";
import {HorizontalBackground1} from "../../../AnimationModels/HorizontalBackground1";
import {IBackgroundMap} from "../../../AnimationModels/DimensionBackground/DimensionTypes";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {getCenterX, getCenterY} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {Cells, ExperimentalDraw} from "../../../AnimationModels/DimensionBackground/DimensionUtils";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {GreenRectangle} from "../../../AnimationModels/GreenRectangle";
import {GreenTriangleLeft} from "../../../AnimationModels/GreenTriangle/GreenTriangleLeft";
import {GreenTriangleRight} from "../../../AnimationModels/GreenTriangle/GreenTriangleRight";
import {PointerAndDragCursorPlugin} from "../../../Plugins/PointerAndDragCursorPlugin";
import {BounceOffTheWall} from "../../../Plugins/BounceOffTheWall";
import {tickGenerator} from "../../../../AnimationCore/Libraries/TickGenerator";
import {HealthPlugin} from "../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../Plugins/HLProgress/HealthType";
import {AnimatedRectangleLightGreen} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {ISubscriptionLike} from "../../../../AnimationCore/Libraries/Observable";

let background: HorizontalBackground;
let background1: HorizontalBackground1;
let cells: IBackgroundMap = <any>0,
    redButton: ButtonRedWithText = <any>0;

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    if (background) {
        background = <any>0;
    }
    if (background1) {
        background1 = <any>0;
    }
    if (cells) {
        cells.destroy();
    }
    if (redButton) {
        redButton.destroy();
    }
    cells = <any>0;
    redButton = <any>0;
}

function initActors(scene: AbstractScene) {
    background = new HorizontalBackground(scene.generalLayer);
    background1 = new HorizontalBackground1(scene.generalLayer);

    background.isEventsBlock = true;
    background1.isEventsBlock = true;

    scene.setActors(background1);
    scene.setActors(background);

    initDynamical(scene);
}

function initActions(scene: AbstractScene) {
    initDynamicalActions(scene);
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}

function initDynamical(scene: AbstractScene) {
    redButton = new ButtonRedWithText(scene.generalLayer, 'BOOM !!!');
    redButton.xPos = getCenterX(0, scene.generalLayer.width - redButton.width);
    redButton.yPos = getCenterY(0, scene.generalLayer.height - redButton.height);
    prepareCells();
    cells.initActors(scene.generalLayer);
    (new ExperimentalDraw(scene, cells, 400, 50)).setToScene();
    scene.setActors(redButton);
}

function prepareCells() {
    let greenRectangle: AbstractActor = <any>GreenRectangle;
    let brickWall: AbstractActor = <any>AnimatedRectangleLightGreen;
    cells = new Cells(100, 100, 5, 4);
    cells
        .replaceRectangleAt([brickWall], 0, 2, 3, 4)
        .add([<any>0, GreenTriangleLeft, GreenTriangleRight, 0], 0, 0)
        .add([<any>GreenTriangleLeft, greenRectangle, greenRectangle, GreenTriangleRight], 0, 1)
        .addRowAt([greenRectangle], 0, 2, 4)
        .add([<any>greenRectangle, 0, 0, greenRectangle], 0, 3)
        .addRowAt([greenRectangle], 0, 4, 4);
}

function initDynamicalActions(scene: AbstractScene) {
    const cursorBehaviorHeart = new PointerAndDragCursorPlugin(scene);
    redButton.pluginDock.add(cursorBehaviorHeart);
    scene.collect(
        redButton.isMouseClick$.subscribe(() => {
            const arr = cells.cells;
            for (let i = 0; i < arr.length; i++) {
                const arrElement = arr[i];
                for (let j = 0; j < arrElement.length; j++) {
                    const arrElementElement = arrElement[j];
                    for (let k = 0; k < arrElementElement.length; k++) {
                        const actor = arrElementElement[k];
                        if (actor) {
                            const health = new HealthPlugin(scene, HealthType.ENEMY_MINI_BOSS, 10);
                            const bounce = new BounceOffTheWall(scene);
                            actor.pluginDock.add(health);
                            actor.pluginDock.add(bounce);
                            let intervalSub: ISubscriptionLike = <any>0;
                            scene.collect(
                                intervalSub = tickGenerator.execute100MsInterval(() => {
                                    if (!health.isDestroyed) {
                                        health.setDamage(1);
                                    } else {
                                        intervalSub.unsubscribe();
                                    }
                                }, 3)
                            );
                        }
                    }
                }
            }
            scene.destroyActor(redButton);
        })
    );
}
