import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {IBackgroundMap} from "../../../AnimationModels/DimensionBackground/DimensionTypes";
import {Cells, ExperimentalDraw} from "../../../AnimationModels/DimensionBackground/DimensionUtils";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {GreenRectangle} from "../../../AnimationModels/GreenRectangle";
import {GreenTriangle} from "../../../AnimationModels/GreenTriangle";
import {BrickWall} from "../../../AnimationModels/briks/BrickWall";

let cells: IBackgroundMap = <any>0;

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
    prepareCells();
    console.log(cells.cells);
    cells.initActors(scene.generalLayer);
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
    let greenRectangle: AbstractActor = <any>GreenRectangle;
    let greenTriangle: AbstractActor = <any>GreenTriangle;
    let brickWall: AbstractActor = <any>BrickWall;
    cells = new Cells(100, 100, 4, 4);
    cells
        .replaceRectangleAt([brickWall], 0, 1, 3, 4)
        .addRowAt([greenTriangle], 0, 0, 4)
        .addRowAt([greenRectangle], 0, 1, 4)
        .add([<any>greenRectangle, 0, 0, greenRectangle], 0, 2)
        .addRowAt([greenRectangle], 0, 3, 4);
}
