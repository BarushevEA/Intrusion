import {IRenderController, RenderController} from "./RenderController";
import {AbstractCustomDraw, ICustomDraw} from "./rootModels/AbstractCustomDraw";
import {Observable, ISubscriptionLike} from "../CustomeLibraries/Observable";

export type IScene = {
    renderStart(isBackgroundLayerPresent: boolean): void;
    renderStop(): void;
    exit(): void;
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
    private readonly _onStop$ = new Observable(<IUserData><any>0);
    private readonly _onExit$ = new Observable(<IUserData><any>0);
    private readonly _onStart$ = new Observable(<IUserData><any>0);
    private readonly _onStartOnce$ = new Observable(<IUserData><any>0);
    private readonly _onDestroy$ = new Observable(<IUserData><any>0);
    private readonly _onSetUserData$ = new Observable(<IUserData><any>0);
    private readonly _userData: IUserData = {};
    private isFirstStart = true;

    protected constructor(canvas: HTMLCanvasElement) {
        this.generalLayer = canvas;
        this.renderController = new RenderController();
        this.renderController.setCanvas(canvas);
        this.run();
    }

    run() {
        this.collect(
            this._onStartOnce$.subscribe(this.createScene.bind(this))
        );
    }

    set userData(data: IUserData) {
        Object.keys(data).forEach(key => {
            this._userData[key] = data[key];
        });
        this.onSetUserData$.next(this._userData);
    }

    get onSetUserData$(): Observable<IUserData> {
        return this._onSetUserData$;
    }

    get userData(): IUserData {
        return this._userData;
    }

    get onStop$(): Observable<IUserData> {
        return this._onStop$;
    }

    get onExit$(): Observable<IUserData> {
        return this._onExit$;
    }

    get onStartOnce$(): Observable<IUserData> {
        return this._onStartOnce$;
    }

    get onStart$(): Observable<IUserData> {
        return this._onStart$;
    }

    get onDestroy$(): Observable<IUserData> {
        return this._onDestroy$;
    }

    protected setActor(actor: AbstractCustomDraw): void {
        actor.disableEvents();
        this.actors.push(actor);
        this.renderController.setDrawElement(actor);
    }

    protected setActorOnTop(actor: AbstractCustomDraw): void {
        this.renderController.setElementOnTop(actor);
    }

    protected setActorZIndex(actor: AbstractCustomDraw, z_index: number): void {
        this.renderController.setElementZIndex(actor, z_index);
    }

    protected setActorsGroupOnTop(actors: ICustomDraw[]): void {
        this.renderController.setElementsGroupOnTop(actors);
    }

    protected setActorsGroupByZIndex(actors: ICustomDraw[], z_index: number): void {
        this.renderController.setElementsGroupByZIndex(actors, z_index);
    }

    protected sortActorsByZIndex() {
        this.renderController.sortElementsByZIndex();
    }

    public collect(...subscribers: ISubscriptionLike[]) {
        for (let i = 0; i < subscribers.length; i++) {
            this.collector.push(subscribers[i]);
        }
    }

    protected abstract createScene(): void;

    public renderStart(isBackgroundLayerPresent: boolean): void {
        this.renderController.renderStart(isBackgroundLayerPresent);
        this._onStart$.next({...this._userData});
        if (this.isFirstStart) {
            this._onStartOnce$.next({...this._userData});
            this.isFirstStart = false;
        }
        setTimeout(() => {
            this.actors.forEach(actor => {
                actor.enableEvents();
            });
        }, 300);
    }

    public renderStop(): void {
        this.renderController.renderStop();
        this._onStop$.next({...this._userData});
    }

    public exit() {
        this.renderStop();
        this.actors.forEach(actor => {
            actor.disableEvents();
        });
        this._onExit$.next({...this._userData});
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

    public destroySubscriber(subscriber: ISubscriptionLike) {
        for (let i = 0; i < this.collector.length; i++) {
            const savedSubscriber = this.collector[i];
            if (savedSubscriber && savedSubscriber === subscriber) {
                savedSubscriber.unsubscribe();
                this.collector[i] = <any>0;
                break;
            }
        }
    }
}
