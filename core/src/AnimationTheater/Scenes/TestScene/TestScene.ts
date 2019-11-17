import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./modules/background";
import {handleMiddle, move, recMoveStart} from "./modules/middle";
import {handleButtons} from "./modules/buttons";
import {handleCursor, initCursor} from "./modules/cursor";

export const userData = {
    test: 123,
    status: 'Ok'
};

export class TestScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        initCursor(this);
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
        handleCursor(this);
        sceneEvents(this);
    }
}

function sceneEvents(scene: AbstractScene) {
    scene.collect(
        scene.onStart$.subscribe(() => {
            recMoveStart(scene);
        }),
        scene.onExit$.subscribe(() => {
            scene.unsubscribe(move.value);
            move.value = <any>0;
        })
    );
}
