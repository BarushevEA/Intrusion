import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/AbstractScene";
import {MovedCircle} from "../../../AnimationModels/MovedCircle";
import {ELayers} from "../../scenesEnvironment";

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    for (let i = 0; i < 50; i++) {
        const circle = new MovedCircle(scene.generalLayer);
        scene.collect(circle.isMouseOver$.subscribe(() => {
            circle.moreSpeed();
        }));
        scene.setActors(circle);
    }
}
