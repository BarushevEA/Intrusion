import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {LightCircle} from "../../../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/BounceOffTheWall";
import {randomize} from "../../../../../../AnimationCore/Libraries/FunctionLibs";
import {IActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let circles: IActor[] = <any>0;

class Decoration extends AbstractActorGroup {
    initActors(scene: IScene): void {
        circles = [];
        for (let i = 0; i < 10; i++) {
            const circle = new LightCircle(scene.generalLayer);
            circle.xPos = randomize(scene.generalLayer.width);
            circle.yPos = randomize(scene.generalLayer.height);
            circles.push(circle);
            circle.setShowedFrame(randomize(19));
        }
    }

    initActions(scene: IScene): void {
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
