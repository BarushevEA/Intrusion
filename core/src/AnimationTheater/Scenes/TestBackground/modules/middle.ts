import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {LightCircle} from "../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../Plugins/BounceOffTheWall";
import {PolygonWeb} from "../../../Plugins/PolygonWeb";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {cursorHandler} from "./cursor";
import {ECursor} from "../../../../AnimationCore/AnimationEngine/rootModels/Types";
import {MoveKeyControls} from "../../../Plugins/MoveKeyControls";
import {RectangleHighlighting} from "../../../Plugins/RectangleHighlighting";
import {BlueFirePlugin} from "../../../Plugins/BlueFirePlugin";
import {getCenterY} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {MovePlaneFramePlugin} from "../../../Plugins/MovePlaneFramePlugin";
import {ShotLightingPlugin} from "../../../Plugins/ShotLightingPlugin";
import {keyDownCode$, keyUpCode$} from "../../../../AnimationCore/Store/EventStore";
import {IKeyCode} from "../../../../AnimationCore/Store/Types";
import {Plane} from "../../../AnimationModels/Plane/Plane";
import {FatherFrost} from "../../../AnimationModels/FatherFrost/FatherFrost";

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
    scene.moveOnMouseDrag(fatherFrost);
    fatherFrost.pluginDock.add(highlighting);
    scene.collect(
        fatherFrost.isMouseOver$.subscribe(() => {
            cursorHandler.pointerOrDefaultChange(scene, fatherFrost);
        }),
        fatherFrost.isMouseLeftDrag$.subscribe(() => {
            scene.cursor.setType(ECursor.CATCH);
        }),
        fatherFrost.isMouseLeftDrop$.subscribe(() => {
            scene.cursor.setType(ECursor.POINTER);
        }),
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
        let backgroundColor: string = '',
            borderColor: string = '';
        switch (j) {
            case 0:
                backgroundColor = 'rgba(195,5,7,0.5)';
                borderColor = 'rgba(5,4,195,0)';
                break;
            case 1:
                backgroundColor = 'rgba(0,195,15,0.5)';
                borderColor = 'rgba(5,4,195,0)';
                break;
            case 2:
                backgroundColor = 'rgba(5,4,195,0.5)';
                borderColor = 'rgba(195,187,58,0)';
                break;
            default:
                backgroundColor = 'rgba(255,255,255,0.3)';
                borderColor = 'rgba(255,255,255,0)';
        }
        const web = new PolygonWeb(scene, backgroundColor, borderColor);
        for (let i = 0; i < 3; i++) {
            const circle = circles[counter];
            const bounce = new BounceOffTheWall(scene);
            const highlighting = new RectangleHighlighting(scene);
            circle.pluginDock.add(bounce);
            circle.pluginDock.add(highlighting);
            circle.pluginDock.add(web);
            scene.moveOnMouseDrag(circle);
            scene.collect(
                circle.isMouseOver$.subscribe(() => {
                    cursorHandler.pointerOrDefaultChange(scene, circle);
                }),
                circle.isMouseLeftDrag$.subscribe(() => {
                    scene.cursor.setType(ECursor.CATCH);
                }),
                circle.isMouseLeftDrop$.subscribe(() => {
                    scene.cursor.setType(ECursor.POINTER);
                }),
            );
            counter++;
        }
    }
}
