import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./modules/menuBackground";
import {handleMiddle} from "./modules/menuMiddle";
import {handleButtons} from "./modules/menuButtons";

export class Menu extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
    }
}
