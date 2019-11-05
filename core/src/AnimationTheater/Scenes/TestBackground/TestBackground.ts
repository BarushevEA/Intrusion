import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./modules/background";
import {handleMiddle} from "./modules/middle";
import {handleButtons} from "./modules/buttons";

export class TestBackground extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
        sceneEvents(this);
    }
}

function sceneEvents(scene: AbstractScene) {
    scene.collect();
}
