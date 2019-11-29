import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {LightCircle} from "../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../Plugins/BounceOffTheWall";
import {PolygonWeb} from "../../../Plugins/PolygonWeb";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {cursorHandler} from "./cursor";

let circles: AbstractActor[] = <any>0;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
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
}

function initActions(scene: AbstractScene) {
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
            circle.pluginDock.add(bounce);
            circle.pluginDock.add(web);
            scene.moveOnMouseDrag(circle);
            scene.collect(
                circle.isMouseOver$.subscribe(() => {
                    cursorHandler.pointerOrDefaultChange(scene, circle);
                })
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
