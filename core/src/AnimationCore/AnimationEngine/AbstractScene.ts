import {IRenderController, RenderController} from "./RenderController";
import {AbstractCustomDraw} from "./rootModels/AbstractCustomDraw";
import {CTMObservable, ISubscriptionLike} from "../CustomeLibraries/CTMObservable";

export type IScene = {
    renderStart(): void;
    renderStop(): void;
    destroy(): void;
}

export type IUserData = {
    [key: string]: any;
}

export abstract class AbstractScene implements IScene {
    protected renderController: IRenderController;
    protected generalLayer: HTMLCanvasElement;
    protected actors: AbstractCustomDraw[] = [];
    private collector: ISubscriptionLike[] = [];
    private readonly _onStop$ = new CTMObservable(<IUserData><any>null);
    private readonly _onStart$ = new CTMObservable(<IUserData><any>null);
    private readonly _onDestroy$ = new CTMObservable(<IUserData><any>null);
    private readonly _onSetUserData$ = new CTMObservable(<IUserData><any>null);
    private readonly _userData: IUserData = {};

    protected constructor(canvas: HTMLCanvasElement) {
        this.generalLayer = canvas;
        this.renderController = new RenderController();
        this.renderController.setCanvas(canvas);
        this.createScene();
    }

    set userData(data: IUserData) {
        Object.keys(data).forEach(key => {
            this._userData[key] = data[key];
        });
        this.onSetUserData$.next(this._userData);
    }

    get onSetUserData$(): CTMObservable<IUserData> {
        return this._onSetUserData$;
    }

    get userData(): IUserData {
        return this._userData;
    }

    get onStop$(): CTMObservable<IUserData> {
        return this._onStop$;
    }

    get onStart$(): CTMObservable<IUserData> {
        return this._onStart$;
    }

    get onDestroy$(): CTMObservable<IUserData> {
        return this._onDestroy$;
    }

    protected setActor(actor: AbstractCustomDraw): void {
        this.actors.push(actor);
        this.renderController.setDrawElement(actor);
    }

    public collect(...subscribers: ISubscriptionLike[]) {
        for (let i = 0; i < subscribers.length; i++) {
            this.collector.push(subscribers[i]);
        }
    }

    protected abstract createScene(): void;

    public renderStart(): void {
        this.renderController.renderStart();
        this._onStart$.next({...this._userData});
        this.actors.forEach(actor => {
            actor.enableEvents();
        });
    }

    public renderStop(): void {
        this.renderController.renderStop();
        this._onStop$.next({...this._userData});
        this.actors.forEach(actor => {
            actor.disableEvents();
        });
    }

    public destroy(): void {
        this._onDestroy$.next({...this._userData});
        for (let i = 0; i < this.collector.length; i++) {
            const subscriber = this.collector.pop();
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        this.collector.length = 0;
        this.collector = <any>0;
        this.renderController.destroyElements();
        for (let i = 0; i < this.actors.length; i++) {
            this.actors.pop();
        }
        this.actors = <any>0;
    }
}
