import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyGray} from "./Empty/ButtonEmptyGray";

export class ButtonGrayWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, text: string) {
        super(canvas, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyGray(this.generalLayer);
    }
}
