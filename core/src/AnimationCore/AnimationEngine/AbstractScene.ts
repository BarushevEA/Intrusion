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

export enum E_ZOnDrop {
    DEFAULT = 'DEFAULT',
    ON_TOP = 'ON_TOP'
}

export enum E_MouseCatch {
    BY_CENTER = 'BY_CENTER',
    BY_POSITION = 'BY_POSITION',
}

export type IDragDropOptions = {
    callbackOnDrag?: () => void;
    callbackOnDrop?: () => void;
    callbackOnMOve?: () => void;
    zIndexOnDrop?: E_ZOnDrop | number;
    mouseCatch?: E_MouseCatch;
};

export type IDragActor = {
    actor: AbstractCustomDraw;
    options?: IDragDropOptions;
};

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
    private movedOnDrag: IDragActor[] = [];
    private movedBehaviors: ISubscriptionLike[] = [];

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

    protected moveOnMouseDrag(actor: AbstractCustomDraw, options?: IDragDropOptions) {
        const drag = new Drag(actor, options);
        this.movedOnDrag.push(drag);
        this.collect(
            drag.actor.isMouseLeftDrag$.subscribe(() => {
                this.onMovedActorDrag(drag);
            }),
            drag.actor.isMouseLeftDrop$.subscribe(() => {
                this.onMovedActorDrop(drag);
            })
        );
    }

    private onMovedActorDrop(drop: IDragActor): void {
        if (this.movedBehaviors.length) {
            this.movedBehaviors.forEach(rectBh => {
                this.destroySubscriber(rectBh);
            });
            this.movedBehaviors = [];
            if (drop.options) {
                if (drop.options.callbackOnDrop) {
                    drop.options.callbackOnDrop();
                }
                switch (!!drop.options.zIndexOnDrop) {
                    case drop.options.zIndexOnDrop === E_ZOnDrop.DEFAULT:
                        drop.actor.restoreZIndex();
                        this.sortActorsByZIndex();
                        break;
                    case typeof drop.options.zIndexOnDrop === 'number':
                        this.setActorZIndex(drop.actor, <number>drop.options.zIndexOnDrop);
                        break;
                }
            }
        }
    }

    private onMovedActorDrag(drag: IDragActor): void {
        const catchActors = this.movedOnDrag.filter(moved => moved.actor.isMouseOver$.getValue());
        if (!catchActors.length) {
            return;
        }

        let maxZIndex = catchActors[0].actor.z_index;
        for (let i = 0; i < catchActors.length; i++) {
            const actor = catchActors[i].actor;
            if (maxZIndex < actor.z_index) {
                maxZIndex = actor.z_index;
            }
        }

        if (drag.actor.z_index < maxZIndex) {
            return;
        }

        drag.actor.saveZIndex();
        this.setActorOnTop(drag.actor);

        if (drag.options && drag.options.callbackOnDrag) {
            drag.options.callbackOnDrag();
        }

        const dx = AbstractCustomDraw.mousePosition.x - drag.actor.elementX;
        const dy = AbstractCustomDraw.mousePosition.y - drag.actor.elementY;

        this.movedBehaviors.push(
            AbstractCustomDraw.tickCount$.subscribe(() => {
                if (!drag.options) {
                    drag.actor.elementX =
                        AbstractCustomDraw.mousePosition.x - Math.round(drag.actor.elementWidth / 2);
                    drag.actor.elementY =
                        AbstractCustomDraw.mousePosition.y - Math.round(drag.actor.elementHeight / 2);
                    return;
                }

                if (drag.options.mouseCatch === E_MouseCatch.BY_CENTER) {
                    drag.actor.elementX =
                        AbstractCustomDraw.mousePosition.x - Math.round(drag.actor.elementWidth / 2);
                    drag.actor.elementY =
                        AbstractCustomDraw.mousePosition.y - Math.round(drag.actor.elementHeight / 2);
                }

                if (drag.options.mouseCatch === E_MouseCatch.BY_POSITION) {
                    drag.actor.elementX = AbstractCustomDraw.mousePosition.x - dx;
                    drag.actor.elementY = AbstractCustomDraw.mousePosition.y - dy;
                }

                if (drag.options.callbackOnMOve) {
                    drag.options.callbackOnMOve();
                }
            })
        );

        for (let i = 0; i < this.movedBehaviors.length; i++) {
            const behavior = this.movedBehaviors[i];
            this.collect(behavior);
        }
    }

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

class Drag implements IDragActor {
    public actor: AbstractCustomDraw;
    public options: IDragDropOptions;

    constructor(actor: AbstractCustomDraw, options?: IDragDropOptions) {
        this.actor = actor;
        this.options = this.getDefaultOptions();
        if (!options) {
            return;
        }
        if (!!options.callbackOnDrag) {
            this.options.callbackOnDrag = options.callbackOnDrag;
        }
        if (!!options.callbackOnMOve) {
            this.options.callbackOnMOve = options.callbackOnMOve;
        }
        if (!!options.callbackOnDrop) {
            this.options.callbackOnDrop = options.callbackOnDrop;
        }
        if (!!options.mouseCatch) {
            this.options.mouseCatch = options.mouseCatch;
        }
        if (!!options.zIndexOnDrop) {
            this.options.zIndexOnDrop = options.zIndexOnDrop;
        }
    }

    private getDefaultOptions(): IDragDropOptions {
        return {
            callbackOnDrag: <any>0,
            callbackOnDrop: <any>0,
            callbackOnMOve: <any>0,
            zIndexOnDrop: E_ZOnDrop.ON_TOP,
            mouseCatch: E_MouseCatch.BY_POSITION
        }
    }
}
