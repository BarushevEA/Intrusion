import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./background";
import {handleMiddle} from "./middle";
import {handleButtons} from "./buttons";

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
