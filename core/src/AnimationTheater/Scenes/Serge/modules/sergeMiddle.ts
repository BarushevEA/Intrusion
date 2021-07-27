import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {CombinedRectangle} from "../../../AnimationModels/rectangles/CombinedRectangle";
import {Heart} from "../../../AnimationModels/Heart";
import {PointerAndDragCursorPlugin} from "../../../../AnimationCore/AnimationEngine/Plugins/keyPlugins/PointerAndDragCursorPlugin";
import {AnimatedRectangleLightGreen} from "../../../AnimationModels/rectangles/AnimatedRectangleLightGreen";
import {AnimatedRectangleLightRed} from "../../../AnimationModels/rectangles/AnimatedRectangleLightRed";
import {Link} from "../../../Plugins/Link";
import {clearOnSceneDestroy} from "../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let combinedRectangle: CombinedRectangle,
    linkRectangle: AnimatedRectangleLightGreen,
    unLinLinkRectangle: AnimatedRectangleLightRed,
    heart: Heart;

export function handleMiddle(scene: IScene): void {
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

function initActors(scene: IScene) {
    linkRectangle = new AnimatedRectangleLightGreen(scene.generalLayer, scene.eventStore);
    unLinLinkRectangle = new AnimatedRectangleLightRed(scene.generalLayer, scene.eventStore);
    linkRectangle.xPos = 0;
    unLinLinkRectangle.xPos = linkRectangle.xPos + linkRectangle.width + 20;


    combinedRectangle = new CombinedRectangle(scene.generalLayer, scene.eventStore);
    heart = new Heart(scene.generalLayer, scene.eventStore);

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

function initActions(scene: IScene) {
    const link = new Link(scene);
    const cursorBehaviorHeart = new PointerAndDragCursorPlugin(scene);
    const cursorBehaviorCombined = new PointerAndDragCursorPlugin(scene);
    heart.pluginDock.add(cursorBehaviorHeart);
    combinedRectangle.pluginDock.add(cursorBehaviorCombined);
    scene.moveOnMouseDrag(heart);
    scene.moveOnMouseDrag(combinedRectangle);

    link.setActorToLink(combinedRectangle);

    scene.collect(
        combinedRectangle.onMouseClick$.subscribe(() => {
            combinedRectangle.nextRectangle();
        }),
        linkRectangle.onMouseClick$.subscribe(() => {
            heart.pluginDock.add(link);
            console.log(heart.pluginDock.getNameList());
        }),
        unLinLinkRectangle.onMouseClick$.subscribe(() => {
            heart.pluginDock.unLink(link);
            console.log(heart.pluginDock.getNameList());
        })
    );

    clearOnSceneDestroy(scene, clearVariables);
}
