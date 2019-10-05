import {IRenderController, RenderController} from "./RenderController";
import {AbstractCustomDraw} from "./rootModels/AbstractCustomDraw";
import {ISubscriptionLike} from "../CustomeLibraries/CTMObservable";

export type IScene = {
    renderStart(): void;
    renderStop(): void;
    destroy(): void;
}

export abstract class AbstractScene implements IScene {
    protected renderController: IRenderController;
    protected customCanvas: HTMLCanvasElement;
    protected actors: AbstractCustomDraw[] = [];
    private subscribersCollector: ISubscriptionLike[] = [];

    protected constructor(canvas: HTMLCanvasElement) {
        this.customCanvas = canvas;
        this.renderController = new RenderController();
        this.renderController.setCanvas(canvas);
        this.createScene();
    }

    protected setActor(actor: AbstractCustomDraw): void {
        this.actors.push(actor);
        this.renderController.setDrawElement(actor);
    }

    protected setToCollector(subscriber: ISubscriptionLike) {
        this.subscribersCollector.push(subscriber);
    }

    protected abstract createScene(): void;

    public renderStart(): void {
        this.renderController.renderStart();
    }

    public renderStop(): void {
        this.renderController.renderStop();
    }

    public destroy(): void {
        for (let i = 0; i < this.subscribersCollector.length; i++) {
            const subscriber = this.subscribersCollector.pop();
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        this.subscribersCollector.length = 0;
        this.renderController.destroyElements();
    }
}
