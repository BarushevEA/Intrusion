import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyRed} from "./Empty/ButtonEmptyRed";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class ButtonRedWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore, text: string) {
        super(canvas, eventStore, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyRed(this.generalLayer, this.eventStore);
    }
}
