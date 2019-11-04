import {AbstractScene} from "../../../AnimationCore/AnimationEngine/AbstractScene";
import {handleBackgrounds} from "./menuBackground";
import {handleMiddle} from "./menuMiddle";
import {handleButtons} from "./menuButtons";

export enum ELayers {
    BACKGROUND = 'BACKGROUND',
    MIDDLE = 'MIDDLE',
    TOP = 'TOP',
}

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
