import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyGreen} from "./Empty/ButtonEmptyGreen";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class ButtonGreenWithText extends AbstractButtonWithText {

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore, text: string) {
        super(canvas, eventStore, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyGreen(this.generalLayer, this.eventStore);
    }
}
