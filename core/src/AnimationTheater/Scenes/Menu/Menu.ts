import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./modules/menuBackground";
import {handleMiddle} from "./modules/menuMiddle";
import {handleButtons} from "./modules/menuButtons";
import {handleCursor} from "./modules/cursor";

export class Menu extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    protected createScene(): void {
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
        handleCursor(this);
    }
}
