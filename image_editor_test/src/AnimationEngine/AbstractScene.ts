import {IRenderController} from "./RenderController";
import {AbstractCustomDraw} from "./rootModels/AbstractCustomDraw";

export abstract class AbstractScene {
    protected renderController: IRenderController;
    protected customCanvas: HTMLCanvasElement;
    protected actors: AbstractCustomDraw[] = [];

    protected constructor(canvas: HTMLCanvasElement, renderController: IRenderController) {
        this.customCanvas = canvas;
        this.renderController = renderController;
        this.createScene();
    }

    protected setActor(actor: AbstractCustomDraw): void {
        this.actors.push(actor);
        this.renderController.setDrawElement(actor);
    }
    protected abstract createScene(): void;

    public renderStart(): void {
        this.renderController.renderStart();
    }

    public renderStop(): void {
        this.renderController.renderStop();
        this.actors.forEach(actor => this.renderController.deleteDrawElement(actor.name));
    }
}
