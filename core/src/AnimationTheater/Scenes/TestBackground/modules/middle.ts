import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {LightCircle} from "../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../Plugins/BounceOffTheWall";
import {PolygonWeb} from "../../../Plugins/PolygonWeb";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {MoveKeyControls} from "../../../Plugins/MoveKeyControls";
import {RectangleHighlighting} from "../../../Plugins/RectangleHighlighting";
import {BlueFirePlugin} from "../../../Plugins/BlueFire/BlueFirePlugin";
import {getCenterY} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {MovePlaneFramePlugin} from "../../../Plugins/MovePlaneFramePlugin";
import {ShotLightingPlugin} from "../../../Plugins/ShotLighting/ShotLightingPlugin";
import {keyDownCode$, keyUpCode$} from "../../../../AnimationCore/Store/EventStore";
import {IKeyCode} from "../../../../AnimationCore/Store/Types";
import {Plane} from "../../../AnimationModels/Plane/Plane";
import {FatherFrost} from "../../../AnimationModels/FatherFrost/FatherFrost";
import {PointerAndDragCursorPlugin} from "../../../Plugins/PointerAndDragCursorPlugin";

let circles: AbstractActor[] = <any>0;
let plane: AbstractActor = <any>0;
let fatherFrost: AbstractActor = <any>0;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    plane = <any>0;
    fatherFrost = <any>0;
    if (circles) {
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            circle.destroy();
        }
        circles = <any>0;
    }
}

function initActors(scene: AbstractScene) {
    initCircles(scene);
    initFatherFrost(scene);
    initPlane(scene);
}

function initActions(scene: AbstractScene) {
    fatherFrostAction(scene);
    planeAction(scene);
    circlesAction(scene);
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}

function initCircles(scene: AbstractScene) {
    circles = [];
    for (let i = 0; i < 9; i++) {
        const circle = new LightCircle(scene.generalLayer);
        circles.push(circle);
        scene.setActors(circle);
    }
}

function initFatherFrost(scene: AbstractScene) {
    fatherFrost = new FatherFrost(scene.generalLayer);
    fatherFrost.xPos = scene.generalLayer.width - fatherFrost.width;
    fatherFrost.yPos = scene.generalLayer.height - fatherFrost.height;
    scene.setActors(fatherFrost);
}

function initPlane(scene: AbstractScene) {
    plane = new Plane(scene.generalLayer);
    plane.xPos = plane.width;
    plane.yPos = getCenterY(0, scene.generalLayer.height) - Math.round(plane.height / 2);
    scene.setActors(plane);
}

function fatherFrostAction(scene: AbstractScene) {
    const highlighting = new RectangleHighlighting(scene);
    const cursorBehavior = new PointerAndDragCursorPlugin(scene);
    const bounce = new BounceOffTheWall(scene);
    scene.moveOnMouseDrag(fatherFrost);
    fatherFrost.pluginDock.add(highlighting);
    fatherFrost.pluginDock.add(bounce);
    fatherFrost.pluginDock.add(cursorBehavior);
    scene.collect(
        fatherFrost.isMouseOver$.subscribe(() => {
            fatherFrost.pluginDock.unLink(bounce);
            fatherFrost.pluginDock.add(bounce);
        })
    );
}

function planeAction(scene: AbstractScene) {
    const moveKeys = new MoveKeyControls(scene, 'w', 's', 'a', 'd');
    const highlighting = new RectangleHighlighting(scene);
    const fire = new BlueFirePlugin(scene);
    const moveFrame = new MovePlaneFramePlugin(scene);
    const shotLighting = new ShotLightingPlugin(scene);
    plane.pluginDock.add(fire);
    plane.pluginDock.add(moveKeys);
    plane.pluginDock.add(moveFrame);
    plane.pluginDock.add(highlighting);
    scene.collect(
        keyDownCode$.subscribe((code: IKeyCode) => {
                if (code.code === 'Space') {
                    plane.pluginDock.add(shotLighting);
                }
            }
        ),
        keyUpCode$.subscribe((code: IKeyCode) => {
                if (code.code === 'Space') {
                    plane.pluginDock.unLink(shotLighting);
                }
            }
        )
    );
}

function circlesAction(scene: AbstractScene) {
    let counter = 0;
    for (let j = 0; j < 3; j++) {
        const web = new PolygonWeb(
            scene,
            'rgba(195,195,20,0.5)',
            'rgba(5,4,195,0)');
        for (let i = 0; i < 3; i++) {
            const circle = circles[counter];
            const bounce = new BounceOffTheWall(scene);
            const cursorBehavior = new PointerAndDragCursorPlugin(scene);
            const highlighting = new RectangleHighlighting(scene);
            circle.pluginDock.add(bounce);
            circle.pluginDock.add(highlighting);
            circle.pluginDock.add(web);
            circle.pluginDock.add(cursorBehavior);
            scene.moveOnMouseDrag(circle);
            counter++;
        }
    }
}
