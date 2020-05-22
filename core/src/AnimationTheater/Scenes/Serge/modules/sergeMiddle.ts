import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {CombinedRectangle} from "../../../AnimationModels/rectangles/CombinedRectangle";
import {Heart} from "../../../AnimationModels/Heart";
import {PointerAndDragCursorPlugin} from "../../../../AnimationCore/AnimationEngine/Plugins/keyPlugins/PointerAndDragCursorPlugin";
import {AnimatedRectangleLightGreen} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedRectangleLightRed} from "../../../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {Link} from "../../../Plugins/Link";

let combinedRectangle: CombinedRectangle,
    linkRectangle: AnimatedRectangleLightGreen,
    unLinLinkRectangle: AnimatedRectangleLightRed,
    heart: Heart;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    linkRectangle = <any>0;
    unLinLinkRectangle = <any>0;
    combinedRectangle = <any>0;
    heart = <any>0;
}

function initActors(scene: AbstractScene) {
    linkRectangle = new AnimatedRectangleLightGreen(scene.generalLayer);
    unLinLinkRectangle = new AnimatedRectangleLightRed(scene.generalLayer);
    linkRectangle.xPos = 0;
    unLinLinkRectangle.xPos = linkRectangle.xPos + linkRectangle.width + 20;


    combinedRectangle = new CombinedRectangle(scene.generalLayer);
    heart = new Heart(scene.generalLayer);

    heart.yPos = scene.generalLayer.height - heart.height;
    combinedRectangle.xPos = scene.generalLayer.width - combinedRectangle.width;
    combinedRectangle.yPos = scene.generalLayer.height - combinedRectangle.height;

    scene.setActors(
        linkRectangle,
        unLinLinkRectangle,
        heart,
        combinedRectangle
    );
}

function initActions(scene: AbstractScene) {
    const link = new Link(scene);
    const cursorBehaviorHeart = new PointerAndDragCursorPlugin(scene);
    const cursorBehaviorCombined = new PointerAndDragCursorPlugin(scene);
    heart.pluginDock.add(cursorBehaviorHeart);
    combinedRectangle.pluginDock.add(cursorBehaviorCombined);
    scene.moveOnMouseDrag(heart);
    scene.moveOnMouseDrag(combinedRectangle);

    link.setActorToLink(combinedRectangle);

    scene.collect(
        combinedRectangle.isMouseClick$.subscribe(() => {
            combinedRectangle.nextRectangle();
        }),
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        }),
        linkRectangle.isMouseClick$.subscribe(() => {
            heart.pluginDock.add(link);
            console.log(heart.pluginDock.getNameList());
        }),
        unLinLinkRectangle.isMouseClick$.subscribe(() => {
            heart.pluginDock.unLink(link);
            console.log(heart.pluginDock.getNameList());
        })
    );
}
