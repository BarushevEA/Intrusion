import {AbstractButtonWithText} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButtonWithText";
import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";
import {ButtonEmptyBlue} from "./Empty/ButtonEmptyBlue";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class ButtonBlueWithText extends AbstractButtonWithText {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore, text: string) {
        super(canvas, eventStore, text);
    }

    protected getButton(): AbstractButton {
        return new ButtonEmptyBlue(this.generalLayer, this.eventStore);
    }
}
