import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {
    E_Cells,
    IBackgroundMap,
    ICellDrawOptions,
    ICellScheme
} from "../../../AnimationModels/DimensionBackground/DimensionTypes";
import {Cells, DrawHelper} from "../../../AnimationModels/DimensionBackground/DimensionUtils";
import {GreenRectangle} from "../../../AnimationModels/GreenRectangle";
import {BrickWall} from "../../../AnimationModels/briks/BrickWall";
import {GreenTriangle} from "../../../AnimationModels/GreenTriangle/GreenTriangle";
import {DimensionBackground} from "../../../AnimationModels/DimensionBackground/DimensionBackground";
import {BounceOffTheWall} from "../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/BounceOffTheWall";
import {AnimatedRectangleLightGreen} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedRectangleLightYellow} from "../../../AnimationModels/rectangles/AnimatedRectangleLightYellow";
import {AnimatedRectangleLightCyan} from "../../../AnimationModels/rectangles/AnimatedRectangleLightCyan";
import {AnimatedRectangleLightGray} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";

let cells: IBackgroundMap = <any>0,
    bg: DimensionBackground = <any>0,
    left: AnimatedRectangleLightGreen = <any>0,
    right: AnimatedRectangleLightYellow = <any>0,
    top: AnimatedRectangleLightCyan = <any>0,
    bottom: AnimatedRectangleLightGray = <any>0;

enum $ {
    NUL = 0,
    REC = 'REC',
    TRI = 'TRI',
    WAL = 'WAL'
}

export function handleBackgrounds(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.BACKGROUND);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    if (cells) {
        cells.destroy();
        cells = <any>0;
    }
    if (bg) {
        bg.destroy();
        bg = <any>0;
    }
    if (top) {
        top.destroy();
        top = <any>0;
    }
    if (bottom) {
        bottom.destroy();
        bottom = <any>0;
    }
    if (left) {
        left.destroy();
        left = <any>0;
    }
    if (right) {
        right.destroy();
        right = <any>0;
    }
}

function initActors(scene: AbstractScene) {
    const bgOptions: ICellDrawOptions = {
        width: 4,
        height: 4
    };

    left = new AnimatedRectangleLightGreen(scene.generalLayer);
    right = new AnimatedRectangleLightYellow(scene.generalLayer);
    top = new AnimatedRectangleLightCyan(scene.generalLayer);
    bottom = new AnimatedRectangleLightGray(scene.generalLayer);

    left.xPos = scene.generalLayer.width - left.width * 5;
    right.xPos = scene.generalLayer.width - right.width * 4;
    top.xPos = scene.generalLayer.width - top.width * 3;
    bottom.xPos = scene.generalLayer.width - bottom.width * 2;

    bg = new DimensionBackground(scene.generalLayer);
    bg.xPos = 400;
    bg.yPos = 50;
    bg.draw.options = bgOptions;

    scene.setActors(
        bg,
        left,
        right,
        top,
        bottom
    );

    const scheme: ICellScheme = {};
    scheme[$.REC] = <any>GreenRectangle;
    scheme[$.TRI] = <any>GreenTriangle;
    scheme[$.WAL] = <any>BrickWall;
    prepareCells();
    cells.setScheme(scheme, E_Cells.SCENE_USE, scene.generalLayer);
    (new DrawHelper(scene, cells, 100, 100)).setToScene();
}

function initActions(scene: AbstractScene) {
    const bounce = new BounceOffTheWall(scene);
    bg.pluginDock.add(bounce);
    scene.collect(
        left.isMouseClick$.subscribe(() => {
            bg.moveLeft();
        }),
        right.isMouseClick$.subscribe(() => {
            bg.moveRight();
        }),
        top.isMouseClick$.subscribe(() => {
            bg.moveTop();
        }),
        bottom.isMouseClick$.subscribe(() => {
            bg.moveBottom();
        }),
    );
    clearOnSceneDestroy(scene, clearVariables);
}

function prepareCells() {
    cells = new Cells(100, 100, 4, 4);
    cells
        .replaceRectangleAt([<any>$.WAL], 0, 1, 3, 4)
        .addRowAt([<any>$.TRI], 0, 0, 4)
        .addRowAt([<any>$.REC], 0, 1, 4)
        .add([<any>$.REC, $.NUL, $.NUL, $.REC], 0, 2)
        .addRowAt([<any>$.REC], 0, 3, 4);
}
