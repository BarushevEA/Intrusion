import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {AbstractScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {LightCircle} from "../../../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../../../Plugins/BounceOffTheWall";
import {PointerAndDragCursorPlugin} from "../../../../../Plugins/PointerAndDragCursorPlugin";
import {RectangleHighlighting} from "../../../../../Plugins/RectangleHighlighting";

let circles: AbstractActor[] = <any>0;

class Decoration extends AbstractActorGroup {
    initActors(scene: AbstractScene): void {
        circles = [];
        for (let i = 0; i < 9; i++) {
            const circle = new LightCircle(scene.generalLayer);
            circles.push(circle);
        }
    }

    initActions(scene: AbstractScene): void {
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            const bounce = new BounceOffTheWall(scene);
            const cursorBehavior = new PointerAndDragCursorPlugin(scene);
            const highlighting = new RectangleHighlighting(scene);
            scene.setActors(circle);
            scene.moveOnMouseDrag(circle);
            circle.pluginDock.add(bounce);
            circle.pluginDock.add(highlighting);
            circle.pluginDock.add(cursorBehavior);
        }
    }

    destroy(): void {
        if (!!circles) {
            for (let i = 0; i < circles.length; i++) {
                const circle = circles[i];
                circle.destroy();
            }
            circles = <any>0;
        }
    }
}

export const decoration = new Decoration();
