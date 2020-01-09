import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {AbstractScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {LightCircle} from "../../../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../../../Plugins/BounceOffTheWall";
import {randomize} from "../../../../../../AnimationCore/Libraries/FunctionLibs";

let circles: AbstractActor[] = <any>0;

class Decoration extends AbstractActorGroup {
    initActors(scene: AbstractScene): void {
        circles = [];
        for (let i = 0; i < 10; i++) {
            const circle = new LightCircle(scene.generalLayer);
            circle.xPos = randomize(scene.generalLayer.width);
            circle.yPos = randomize(scene.generalLayer.height);
            circles.push(circle);
            circle.setShowedFrame(randomize(19));
        }
    }

    initActions(scene: AbstractScene): void {
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            const bounce = new BounceOffTheWall(scene);
            scene.setActors(circle);
            circle.pluginDock.add(bounce);
            circle.isEventsBlock = true;
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
