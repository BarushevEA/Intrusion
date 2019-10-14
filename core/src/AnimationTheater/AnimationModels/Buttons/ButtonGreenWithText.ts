import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyGreen} from "./Empty/ButtonEmptyGreen";

export class ButtonGreenWithText extends AbstractButtonWithText {

    constructor(canvas: HTMLCanvasElement, text: string) {
        super(canvas, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyGreen(this.generalLayer);
    }
}
