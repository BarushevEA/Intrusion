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

let circles: AbstractActor[] = <any>0;
let plane: AbstractActor = <any>0;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    plane = <any>0;
    if (circles) {
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            circle.destroy();
        }
        circles = <any>0;
    }
}

function initActors(scene: AbstractScene) {
    circles = [];
    for (let i = 0; i < 9; i++) {
        const circle = new LightCircle(scene.generalLayer);
        circles.push(circle);
        scene.setActors(circle);
    }
    plane = new Plane(scene.generalLayer);
    plane.xPos = plane.width;
    plane.yPos = getCenterY(0, scene.generalLayer.height) - Math.round(plane.height / 2);
    scene.setActors(plane);
}

function planeAction(scene: AbstractScene) {
    const moveKeys = new MoveKeyControls(scene, 'w', 's', 'a', 'd');
    const highlighting = new RectangleHighlighting(scene);
    const fire = new BlueFirePlugin(scene);
    const moveFrame = new MovePlaneFramePlugin(scene);
    const shotLighting = new ShotLightingPlugin(scene);
    // let isFire = true;
    plane.pluginDock.add(fire);
    plane.pluginDock.add(moveKeys);
    plane.pluginDock.add(moveFrame);
    plane.pluginDock.add(highlighting);
    scene.collect(
        // plane.isMouseClick$.subscribe(
        //     () => {
        //         if (isFire) {
        //             plane.pluginDock.unLink(fire);
        //         } else {
        //             plane.pluginDock.add(fire);
        //         }
        //         isFire = !isFire;
        //     }
        // )
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

function initActions(scene: AbstractScene) {
    planeAction(scene);

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


    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
