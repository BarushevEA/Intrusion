import {AbstractActor} from "./AbstractActor";
import {AbstractFramedShape} from "./AbstractFramedShape";
import {EAlign} from "../LayerHandler/TextHandler";
import {AbstractButton} from "./AbstractButton";


export abstract class AbstractButtonWithText extends AbstractActor {
    private emptyButton: AbstractFramedShape = this.getButton();
    private textLayerName = 'text';

    protected constructor(canvas: HTMLCanvasElement, text: string) {
        super(canvas, 0, 0);
        this.init(text);
    }

    protected abstract getButton(): AbstractButton;

    private init(text: string) {
        this.setSize(this.emptyButton.elementHeight, this.emptyButton.elementWidth);
        this.setVirtualLayer(this.textLayerName);
        this.shape.setColors('rgba(202,202,202, 0.8)', 'rgba(0,0,0,0.5)');
        this.shape.setLineWidth(5);
        this.text.x = 15;
        this.text.y = 35;
        this.text.options = {
            textAlign: EAlign.left,
            maxWidth: 100
        };
        const outerText = text.split('').join(String.fromCharCode(8202));
        this.text.fontSize = '24px';
        this.text.fontFamily = 'Comic Sans MS';
        this.text.strokeText(outerText);
        this.text.fillText(outerText);
        this.restorePreviousLayer();
    }

    renderFrame(): void {
        this.emptyButton.elementX = this.elementX;
        this.emptyButton.elementY = this.elementY;
        this.emptyButton.renderFrame();
        this.drawVirtualOnGeneral(this.textLayerName, this.elementX, this.elementY);
    }
}
