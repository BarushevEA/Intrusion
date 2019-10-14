import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyRed} from "./Empty/ButtonEmptyRed";

export class ButtonRedWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, text: string) {
        super(canvas, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyRed(this.generalLayer);
    }
}
