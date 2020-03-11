import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {E_Cells, IBackgroundMap, ICellScheme} from "../../../AnimationModels/DimensionBackground/DimensionTypes";
import {Cells, ExperimentalDraw} from "../../../AnimationModels/DimensionBackground/DimensionUtils";
import {GreenRectangle} from "../../../AnimationModels/GreenRectangle";
import {BrickWall} from "../../../AnimationModels/briks/BrickWall";
import {GreenTriangle} from "../../../AnimationModels/GreenTriangle/GreenTriangle";

let cells: IBackgroundMap = <any>0;

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
    }
    cells = <any>0;
}

function initActors(scene: AbstractScene) {
    const scheme: ICellScheme = {};
    scheme[$.REC] = <any>GreenRectangle;
    scheme[$.TRI] = <any>GreenTriangle;
    scheme[$.WAL] = <any>BrickWall;
    prepareCells();
    cells.setScheme(scheme, E_Cells.SCENE_USE, scene.generalLayer);
    (new ExperimentalDraw(scene, cells, 100, 100)).setToScene();
    scene.setActors();
}

function initActions(scene: AbstractScene) {
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
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
