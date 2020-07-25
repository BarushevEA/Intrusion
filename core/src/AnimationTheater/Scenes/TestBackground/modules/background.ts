import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {HorizontalBackground} from "../../../AnimationModels/HorizontalBackground";
import {HorizontalBackground1} from "../../../AnimationModels/HorizontalBackground1";
import {E_Cells, IBackgroundMap, ICellScheme} from "../../../AnimationModels/DimensionBackground/DimensionTypes";
import {ButtonRedWithText} from "../../../AnimationModels/Buttons/ButtonRedWithText";
import {getCenterX, getCenterY} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {Cells, DrawHelper} from "../../../AnimationModels/DimensionBackground/DimensionUtils";
import {GreenRectangle} from "../../../AnimationModels/GreenRectangle";
import {GreenTriangleLeft} from "../../../AnimationModels/GreenTriangle/GreenTriangleLeft";
import {GreenTriangleRight} from "../../../AnimationModels/GreenTriangle/GreenTriangleRight";
import {PointerAndDragCursorPlugin} from "../../../../AnimationCore/AnimationEngine/Plugins/keyPlugins/PointerAndDragCursorPlugin";
import {BounceOffTheWall} from "../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/BounceOffTheWall";
import {tickGenerator} from "../../../../AnimationCore/Libraries/TickGenerator";
import {HealthPlugin} from "../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../Plugins/HLProgress/HealthType";
import {BrickWall} from "../../../AnimationModels/briks/BrickWall";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let background: HorizontalBackground;
let background1: HorizontalBackground1;
let cells: IBackgroundMap = <any>0,
    redButton: ButtonRedWithText = <any>0;

enum $ {
    NUL = 0,
    REC = 'REC',
    TRR = 'TRR',
    TRL = 'TRL',
    WAL = 'WAL'
}

export function handleBackgrounds(scene: IScene): void {
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

function initActors(scene: IScene) {
    background = new HorizontalBackground(scene.generalLayer);
    background1 = new HorizontalBackground1(scene.generalLayer);

    background.isEventsBlock = true;
    background1.isEventsBlock = true;

    background.disableEvents();
    background1.disableEvents();

    scene.setActors(background1);
    scene.setActors(background);

    initDynamical(scene);
}

function initActions(scene: IScene) {
    initDynamicalActions(scene);
    clearOnSceneDestroy(scene, clearVariables);
}

function initDynamical(scene: IScene) {
    redButton = new ButtonRedWithText(scene.generalLayer, 'BOOM !!!');
    redButton.xPos = getCenterX(0, scene.generalLayer.width - redButton.width);
    redButton.yPos = getCenterY(0, scene.generalLayer.height - redButton.height);

    const scheme: ICellScheme = {};
    scheme[$.REC] = <any>GreenRectangle;
    scheme[$.WAL] = <any>BrickWall;
    scheme[$.TRL] = <any>GreenTriangleLeft;
    scheme[$.TRR] = <any>GreenTriangleRight;

    prepareCells();
    cells.setScheme(scheme, E_Cells.SCENE_USE, scene.generalLayer);
    (new DrawHelper(scene, cells, 400, 50)).setToScene();
    scene.setActors(redButton);
}

function prepareCells() {
    cells = new Cells(100, 100, 5, 4);
    cells
        .replaceRectangleAt([<any>$.WAL], 0, 2, 3, 4)
        .add([<any>$.NUL, $.TRL, $.TRR, $.NUL], 0, 0)
        .add([<any>$.TRL, $.REC, $.REC, $.TRR], 0, 1)
        .add([<any>$.REC], 1, 3)
        .add([<any>$.REC], 1, 4);
}

function initDynamicalActions(scene: IScene) {
    const cursorOver = new PointerAndDragCursorPlugin(scene);
    redButton.pluginDock.add(cursorOver);
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
                            actor.disableEvents();
                            tickGenerator.executeTimeout(() => {
                                if (!health.isDestroyed) {
                                    health.setDamage(100);
                                }
                            }, 300);
                        }
                    }
                }
            }
            scene.destroyActor(redButton);
        })
    );
}
