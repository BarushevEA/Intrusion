import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleButtons} from "./segeButtons";
import {handleMiddle} from "./sergeMiddle";
import {handleBackgrounds} from "./sergeBackground";

export class SergeScene extends AbstractScene {

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
    scene.collect(
        scene.onSetUserData$.subscribe(() => {
            console.log(scene.userData);
        }),
    );
}
