import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./modules/background";
import {handleMiddle} from "./modules/middle";
import {handleButtons} from "./modules/buttons";
import {handleCursor} from "./modules/cursor";

export class Empty extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
        handleCursor(this);
        sceneEvents(this);
    }
}

function sceneEvents(scene: AbstractScene) {
    scene.collect();
}
