import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyGray} from "./Empty/ButtonEmptyGray";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class ButtonGrayWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore, text: string) {
        super(canvas, eventStore, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyGray(this.generalLayer, this.eventStore);
    }
}
