import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyYellow} from "./Empty/ButtonEmptyYellow";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class ButtonYellowWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore, text: string) {
        super(canvas, eventStore, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyYellow(this.generalLayer, this.eventStore);
    }
}
