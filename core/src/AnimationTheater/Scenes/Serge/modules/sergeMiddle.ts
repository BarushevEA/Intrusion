import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {ELayers} from "../../scenesEnvironment";
import {CombinedRectangle} from "../../../AnimationModels/rectangles/CombinedRectangle";
import {Heart} from "../../../AnimationModels/Heart";

let combinedRectangle: CombinedRectangle,
    heart: Heart;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    combinedRectangle = <any>0;
    heart = <any>0;
}

function initActors(scene: AbstractScene) {
    combinedRectangle = new CombinedRectangle(scene.generalLayer);
    heart = new Heart(scene.generalLayer);

    heart.yPos = scene.generalLayer.height - heart.height;
    combinedRectangle.xPos = scene.generalLayer.width - combinedRectangle.width;
    combinedRectangle.yPos = scene.generalLayer.height - combinedRectangle.height;

    scene.setActors(combinedRectangle);
    scene.setActors(heart);
}

function initActions(scene: AbstractScene) {
    scene.moveOnMouseDrag(heart);
    scene.moveOnMouseDrag(combinedRectangle);
    scene.collect(
        combinedRectangle.isMouseClick$.subscribe(() => {
            combinedRectangle.nextRectangle();
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
