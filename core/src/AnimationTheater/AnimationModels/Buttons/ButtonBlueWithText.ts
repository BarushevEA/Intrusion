import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyBlue} from "./Empty/ButtonEmptyBlue";

export class ButtonBlueWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, text: string) {
        super(canvas, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyBlue(this.generalLayer);
    }
}
