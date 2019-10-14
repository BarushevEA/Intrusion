import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyYellow} from "./Empty/ButtonEmptyYellow";

export class ButtonYellowWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, text: string) {
        super(canvas, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyYellow(this.generalLayer);
    }
}
