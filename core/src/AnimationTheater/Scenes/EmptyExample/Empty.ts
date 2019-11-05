import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "../Menu/menuBackground";
import {handleMiddle} from "../Menu/menuMiddle";
import {handleButtons} from "../Menu/menuButtons";

export class Empty extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
    }
}
