import {IRenderController, RenderController} from "./RenderController";
import {AbstractActor, IActor} from "./rootModels/AbstractActor";
import {Observable, ISubscriptionLike} from "../CustomeLibraries/Observable";

export type IScene = {
    start(isBackgroundLayerPresent: boolean): void;
    stop(): void;
    exit(): void;
    destroy(): void;
}

export type IUserData = {
    nextScene?: string;
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
    actor: AbstractActor;
    options?: IDragDropOptions;
};

export abstract class AbstractScene implements IScene {
    public renderController: IRenderController;
    public generalLayer: HTMLCanvasElement;
    public actors: AbstractActor[] = [];
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
    private destroySubscriberCounter = 0;

    protected constructor(canvas: HTMLCanvasElement) {
        this.generalLayer = canvas;
        this.renderController = new RenderController();
        this.renderController.setCanvas(canvas);
        this.run();
    }

    private run(): void {
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

    public setActors(...actors: AbstractActor[]): void {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            actor.disableEvents();
            this.actors.push(actor);
            this.renderController.setActor(actor);
        }
    }

    public setActorOnTop(actor: AbstractActor): void {
        this.renderController.setActorOnTop(actor);
    }

    public setActorZIndex(actor: AbstractActor, z_index: number): void {
        this.renderController.setActorZIndex(actor, z_index);
    }

    public setActorsGroupOnTop(actors: IActor[]): void {
        this.renderController.setActorGroupOnTop(actors);
    }

    public setActorsGroupByZIndex(actors: IActor[], z_index: number): void {
        this.renderController.setActorsGroupByZIndex(actors, z_index);
    }

    public sortActorsByZIndex() {
        this.renderController.sortActorsByZIndex();
    }

    public setActiveLayer(name: string): void {
        this.renderController.setActiveLayer(name);
    }

    public setLayerOnTop(name: string): void {
        this.renderController.setLayerOnTop(name);
    }

    public setLayerOnIndex(layerName: string, index: number): void {
        this.renderController.setLayerOnIndex(layerName, index);
    }

    public collect(...subscribers: ISubscriptionLike[]) {
        for (let i = 0; i < subscribers.length; i++) {
            this.collector.push(subscribers[i]);
        }
    }

    protected abstract createScene(): void;

    public moveOnMouseDrag(actor: AbstractActor, options?: IDragDropOptions) {
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
            this.movedBehaviors.forEach(subscriber => {
                this.unsubscribe(subscriber);
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

        const dx = AbstractActor.mousePosition.x - drag.actor.xPos;
        const dy = AbstractActor.mousePosition.y - drag.actor.yPos;

        this.movedBehaviors.push(
            AbstractActor.tickCount$.subscribe(() => {
                this.handleDragOptions(drag, dx, dy);
            })
        );

        for (let i = 0; i < this.movedBehaviors.length; i++) {
            const behavior = this.movedBehaviors[i];
            this.collect(behavior);
        }
    }

    private handleDragOptions(drag: IDragActor, dx: number, dy: number) {
        if (!drag.options) {
            drag.actor.xPos =
                AbstractActor.mousePosition.x - Math.round(drag.actor.width / 2);
            drag.actor.yPos =
                AbstractActor.mousePosition.y - Math.round(drag.actor.height / 2);
            return;
        }

        if (drag.options.mouseCatch === E_MouseCatch.BY_CENTER) {
            drag.actor.xPos =
                AbstractActor.mousePosition.x - Math.round(drag.actor.width / 2);
            drag.actor.yPos =
                AbstractActor.mousePosition.y - Math.round(drag.actor.height / 2);
        }

        if (drag.options.mouseCatch === E_MouseCatch.BY_POSITION) {
            drag.actor.xPos = AbstractActor.mousePosition.x - dx;
            drag.actor.yPos = AbstractActor.mousePosition.y - dy;
        }

        if (drag.options.callbackOnMOve) {
            drag.options.callbackOnMOve();
        }
    }

    public start(isBackgroundLayerPresent: boolean): void {
        if (this.isFirstStart) {
            this._onStartOnce$.next({...this._userData});
            this.isFirstStart = false;
        }
        this._onStart$.next({...this._userData});
        this.renderController.renderStart(isBackgroundLayerPresent);
        setTimeout(() => {
            this.actors.forEach(actor => {
                actor.enableEvents();
            });
        }, 300);
    }

    public stop(): void {
        this.renderController.renderStop();
        this._onStop$.next({...this._userData});
    }

    public exit() {
        this.stop();
        this.actors.forEach(actor => {
            actor.disableEvents();
        });
        this._onExit$.next({...this._userData});
    }

    public destroy(): void {
        this._onDestroy$.next({...this._userData});
        for (let i = 0; i < this.collector.length; i++) {
            const subscriber = this.collector[i];
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        this.movedBehaviors.length = 0;
        this.movedBehaviors = <any>0;
        this.collector.length = 0;
        this.collector = <any>0;
        this.renderController.destroyActors();
        for (let i = 0; i < this.actors.length; i++) {
            let actor = this.actors[i];
            if (actor) {
                actor.destroy();
            }
            actor = <any>0;
        }
        this.actors.length = 0;
        this.actors = <any>0;
    }

    public unsubscribe(subscriber: ISubscriptionLike) {
        for (let i = 0; i < this.collector.length; i++) {
            const savedSubscriber = this.collector[i];
            if (savedSubscriber && savedSubscriber === subscriber) {
                savedSubscriber.unsubscribe();
                this.collector[i] = <any>0;
                this.destroySubscriberCounter++;
                break;
            }
        }

        this.clearCollector();
    }

    private clearCollector() {
        if (this.destroySubscriberCounter > 1000 && this.collector.length) {
            const tmp: ISubscriptionLike[] = [];
            for (let i = 0; i < this.collector.length; i++) {
                const subscriber = this.collector[i];
                if (subscriber) {
                    tmp.push(subscriber);
                }
            }
            this.collector = tmp;
        }
    }
}

class Drag implements IDragActor {
    public actor: AbstractActor;
    public options: IDragDropOptions;

    constructor(actor: AbstractActor, options?: IDragDropOptions) {
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
