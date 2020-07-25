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
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {ButtonGreenWithText} from "../../../AnimationModels/Buttons/ButtonGreenWithText";
import {ButtonYellowWithText} from "../../../AnimationModels/Buttons/ButtonYellowWithText";
import {ButtonBlueWithText} from "../../../AnimationModels/Buttons/ButtonBlueWithText";
import {ButtonGrayWithText} from "../../../AnimationModels/Buttons/ButtonGrayWithText";
import {GreenTriangleLeft} from "../../../AnimationModels/GreenTriangle/GreenTriangleLeft";
import {GreenTriangleRight} from "../../../AnimationModels/GreenTriangle/GreenTriangleRight";
import {AnimatedRectangleLightGray} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGray";
import {IActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";

let cells: IBackgroundMap = <any>0,
    cellsString: IBackgroundMap = <any>0,
    bg: DimensionBackground = <any>0,
    left: IActor = <any>0,
    right: IActor = <any>0,
    top: IActor = <any>0,
    bottom: IActor = <any>0;

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
    if (cellsString) {
        cellsString.destroy();
        cellsString = <any>0;
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

    left = new ButtonGreenWithText(scene.generalLayer, 'Move left');
    right = new ButtonYellowWithText(scene.generalLayer, 'Move right');
    top = new ButtonBlueWithText(scene.generalLayer, 'Move top');
    bottom = new ButtonGrayWithText(scene.generalLayer, 'Move bottom');

    left.xPos = scene.generalLayer.width - left.width * 5;
    right.xPos = scene.generalLayer.width - right.width * 4;
    top.xPos = scene.generalLayer.width - top.width * 3;
    bottom.xPos = scene.generalLayer.width - bottom.width * 2;

    bg = new DimensionBackground(scene.generalLayer);
    bg.xPos = 400;
    bg.yPos = 50;
    bg.draw.options = bgOptions;

    prepareCells(scene);
    prepareCellsString(scene);

    cells.addCells(cellsString, 1, 1);
    (new DrawHelper(scene, cells, 0, 0)).setToScene();

    scene.setActors(
        bg,
        left,
        right,
        top,
        bottom
    );
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

function prepareCells(scene: AbstractScene) {
    const scheme: ICellScheme = {};
    scheme[$.REC] = <any>GreenRectangle;
    scheme[$.TRI] = <any>GreenTriangle;
    scheme[$.WAL] = <any>BrickWall;

    cells = new Cells(100, 100, 6, 12);
    cells
        .replaceRectangleAt([<any>$.REC], 0, 0, 6, 12)
        .replaceRectangleAt([<any>$.WAL], 1, 1, 4, 10)
        .addRowAt([<any>$.TRI], 0, 0, 12);

    cells.setScheme(scheme, E_Cells.SCENE_USE, scene.generalLayer);
}

function prepareCellsString(scene: AbstractScene) {
    const cellsStringScheme: ICellScheme = {};
    cellsStringScheme[' '] = <any>0;
    cellsStringScheme['0'] = <any>GreenRectangle;
    cellsStringScheme['['] = <any>GreenTriangleLeft;
    cellsStringScheme[`]`] = <any>GreenTriangleRight;
    cellsStringScheme[`#`] = <any>AnimatedRectangleLightGray;

    cellsString = new Cells(100, 100, 4, 4);
    cellsString
        .addStringDimension(
            [
                ' [] ',
                '[00]',
                '####',
                '####'
            ])
        .addStringDimension(
            [
                '    ',
                '    ',
                '0  0',
                '0  0'
            ]
        );

    cellsString.setScheme(cellsStringScheme, E_Cells.SCENE_USE, scene.generalLayer);
}
