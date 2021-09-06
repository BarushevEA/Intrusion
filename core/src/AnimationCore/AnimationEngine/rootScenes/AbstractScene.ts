import {IRenderController, RenderController} from "../RenderController";
import {AbstractActor} from "../rootModels/AbstractActor/AbstractActor";
import {Observable} from "../../Libraries/Observables/Observable";
import {ICursor} from "../rootModels/Types";
import {IActor} from "../rootModels/AbstractActor/ActorTypes";
import {EventCollector, ICollector} from "../../Libraries/EventCollector";
import {IDragActor, IDragDropOptions, IScene, IUserData} from "./SceneTypes";
import {E_MouseCatch, E_ZOnDrop} from "./scenesEnvironment";
import {tickGenerator} from "../../Libraries/TickGenerator";
import {ICursorHandler} from "../../Libraries/CursorHandler";
import {ISubscriber, ISubscriptionLike} from "../../Libraries/Observables/Types";

export abstract class AbstractScene implements IScene {
    private _render: IRenderController;
    private _generalLayer: HTMLCanvasElement;
    private _actors: IActor[] = [];
    private _cursor: ICursor & AbstractActor = <any>0;
    private _cursorHandler: ICursorHandler = <any>0;
    private collector: ICollector = <any>0;
    private _onStop$ = new Observable(<IUserData><any>0);
    private _onExit$ = new Observable(<IUserData><any>0);
    private _onStart$ = new Observable(<IUserData><any>0);
    private _onStartOnce$ = new Observable(<IUserData><any>0);
    private _onDestroy$ = new Observable(<IUserData><any>0);
    private _onSetUserData$ = new Observable(<IUserData><any>0);
    private _userData: IUserData = {};
    private isFirstStart = true;
    private movedOnDrag: IDragActor[] = [];
    private movedBehaviors: ISubscriptionLike[] = [];
    private _isDestroyed = false;
    private _isDestroyProcessed = false;
    private isBackgroundLayerPresent = false;
    private timerCounter = <any>0;
    private startDelayMs = 100;
    private readonly _name: string;

    protected constructor(canvas: HTMLCanvasElement, name = '') {
        this._generalLayer = canvas;
        this._render = new RenderController();
        this._render.setCanvas(canvas);
        this.collector = new EventCollector();
        this._name = name;
        this.run();
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    set cursorHandler(value: ICursorHandler) {
        this._cursorHandler = value;
    }

    get cursorHandler(): ICursorHandler {
        return this._cursorHandler;
    }

    set cursor(value: ICursor) {
        this._cursor = value;
    }

    get cursor(): ICursor {
        return this._cursor;
    }

    get tickCount$(): ISubscriber<boolean> {
        if (this._render && this._render.afterLayersRender$) return this._render.afterLayersRender$;
        return <any>{subscribe: () => 0};
    };

    private run(): void {
        this.collect(this._onStartOnce$.subscribe(this.handleCreateScene.bind(this)));
    }

    private handleCreateScene() {
        this.createScene();
        for (let i = 0; i < this._actors.length; i++) {
            const actor = this._actors[i];
            actor.pauseEvents();
        }
        this.timerCounter = tickGenerator.executeTimeout(
            () => !this._isDestroyed && this.handleStartScene(),
            this.startDelayMs);
    }

    private handleStartScene() {
        for (let i = 0; i < this._actors.length; i++) {
            const actor = this._actors[i];
            actor.resetEvents();
        }
        this._render.start(this.isBackgroundLayerPresent);
        this._onStart$.next({...this._userData});
    }

    set userData(data: IUserData) {
        Object.keys(data).forEach(key => this._userData[key] = data[key]);
        this._onSetUserData$.next(this._userData);
    }

    get onSetUserData$(): ISubscriber<IUserData> {
        return this._onSetUserData$;
    }

    get userData(): IUserData {
        return this._userData;
    }

    get onStop$(): ISubscriber<IUserData> {
        return this._onStop$;
    }

    get onExit$(): ISubscriber<IUserData> {
        return this._onExit$;
    }

    get onStartOnce$(): ISubscriber<IUserData> {
        return this._onStartOnce$;
    }

    get onStart$(): ISubscriber<IUserData> {
        return this._onStart$;
    }

    get onDestroy$(): ISubscriber<IUserData> {
        return this._onDestroy$;
    }

    public setActors(...actors: IActor[]): void {
        if (this._isDestroyed || !actors || !actors.length) return;

        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            if (!actor) continue;

            (this._actors.indexOf(actor) === -1) && this._actors.push(actor);
            actor.isUnlinked = false;
            this._render.setActor(actor);
        }
    }

    public destroyActor(actor: IActor): void {
        if (!this._actors) return;

        const index = this._actors.indexOf(actor);
        if (index === -1) return;

        this.unLink(actor);
        for (let i = index; i < this._actors.length - 1; i++) this._actors[i] = this._actors[i + 1];

        this._actors.length = this._actors.length - 1;
        if (actor && !actor.isDestroyed && actor.destroy) actor.destroy();
    }

    public unLink(actor: IActor): void {
        if (!actor) return;
        actor.isUnlinked = true;
        this._render.deleteActor(actor);
    }

    public setHalfSpeed(): void {
        this._render.setHalfSpeed();
    }

    public setFullSpeed(): void {
        this._render.setFullSpeed();
    }

    public setActorOnTop(actor: IActor): void {
        this._render.setActorOnTop(actor);
    }

    public setActorZIndex(actor: IActor, z_index: number): void {
        this._render.setActorZIndex(actor, z_index);
    }

    public setActorsGroupOnTop(actors: IActor[]): void {
        this._render.setActorGroupOnTop(actors);
    }

    public setActorsGroupByZIndex(actors: IActor[], z_index: number): void {
        this._render.setActorsGroupByZIndex(actors, z_index);
    }

    public sortActorsByZIndex(): void {
        this._render.sortActorsByZIndex();
    }

    public setActiveLayer(name: string): void {
        this._render.setActiveLayer(name);
    }

    public getActiveLayerName(): string {
        return this._render.getActiveLayerName();
    }

    public setLayerOnTop(name: string): void {
        this._render.setLayerOnTop(name);
    }

    public setLayerOnIndex(layerName: string, index: number): void {
        this._render.setLayerOnIndex(layerName, index);
    }

    public collect(...subscribers: ISubscriptionLike[]): void {
        this.collector.collect(...subscribers);
    }

    get render(): IRenderController {
        return this._render;
    }

    get generalLayer(): HTMLCanvasElement {
        return this._generalLayer;
    }

    get actors(): IActor[] {
        return this._actors;
    }

    protected abstract createScene(): void;

    public moveOnMouseDrag(actor: IActor, options?: IDragDropOptions): void {
        if (this._isDestroyed) return;

        const drag = new Drag(actor, options);
        this.movedOnDrag.push(drag);
        this.collect(
            drag.actor.onMouseLeftDrag$.subscribe(() => this.onMovedActorDrag(drag)),
            drag.actor.onMouseLeftDrop$.subscribe(() => this.onMovedActorDrop(drag))
        );
    }

    private onMovedActorDrop(drop: IDragActor): void {
        if (!this.movedBehaviors.length) return;
        for (let i = 0; i < this.movedBehaviors.length; i++) this.unsubscribe(this.movedBehaviors[i]);
        this.movedBehaviors = [];
        if (drop.options) {
            if (drop.options.callbackOnDrop) drop.options.callbackOnDrop();

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

    private onMovedActorDrag(drag: IDragActor): void {
        const catchActors = this.movedOnDrag.filter(moved =>
            !moved.actor.isDestroyed && moved.actor.onMouseOver$.getValue());
        if (!catchActors.length) return;

        let maxZIndex = catchActors[0].actor.z_index;
        for (let i = 0; i < catchActors.length; i++) {
            const actor = catchActors[i].actor;
            if (maxZIndex < actor.z_index) maxZIndex = actor.z_index;
        }

        if (drag.actor.z_index < maxZIndex) return;

        drag.actor.saveZIndex();
        this.setActorOnTop(drag.actor);

        if (drag.options && drag.options.callbackOnDrag) drag.options.callbackOnDrag();

        const dx = AbstractActor.mousePosition.x - drag.actor.xPos;
        const dy = AbstractActor.mousePosition.y - drag.actor.yPos;

        this.movedBehaviors.push(this.tickCount$.subscribe(() => this.handleDragOptions(drag, dx, dy)));

        for (let i = 0; i < this.movedBehaviors.length; i++) {
            const behavior = this.movedBehaviors[i];
            this.collect(behavior);
        }
    }

    private handleDragOptions(drag: IDragActor, dx: number, dy: number) {
        if (!drag.options) {
            drag.actor.xPos = AbstractActor.mousePosition.x - Math.round(drag.actor.width / 2);
            drag.actor.yPos = AbstractActor.mousePosition.y - Math.round(drag.actor.height / 2);
            return;
        }

        if (drag.options.mouseCatch === E_MouseCatch.BY_CENTER) {
            drag.actor.xPos = AbstractActor.mousePosition.x - Math.round(drag.actor.width / 2);
            drag.actor.yPos = AbstractActor.mousePosition.y - Math.round(drag.actor.height / 2);
        }

        if (drag.options.mouseCatch === E_MouseCatch.BY_POSITION) {
            drag.actor.xPos = AbstractActor.mousePosition.x - dx;
            drag.actor.yPos = AbstractActor.mousePosition.y - dy;
        }

        if (drag.options.callbackOnMOve) drag.options.callbackOnMOve();
    }

    public start(isBackgroundLayerPresent: boolean): void {
        if (this._isDestroyed || this._isDestroyProcessed) {
            console.log('Try to start scene, but', this._name, 'is destroyed !!!');
            return;
        }
        this.isBackgroundLayerPresent = isBackgroundLayerPresent;
        if (this.isFirstStart) {
            this._onStartOnce$.next({...this._userData});
            this.isFirstStart = false;
            return;
        }
        this.timerCounter = tickGenerator.executeTimeout(
            () => !this._isDestroyed && this.handleStartScene(), this.startDelayMs);
    }

    public stop(): void {
        this._render.stop();
        this._onStop$.next({...this._userData});
    }

    public exit() {
        this.stop();
        this._actors.forEach(actor => actor.pauseEvents());
        this._onExit$.next({...this._userData});
    }

    public destroy(initiator?: string): void {
        if (this._isDestroyed || this._isDestroyProcessed) return;
        console.log('Scene destroy execute', this.name, initiator);
        this._isDestroyProcessed = true;
        this.exit();

        this._actors.forEach(actor => actor.disableEvents());
        this._onDestroy$.next({...this._userData});
        this.collector.destroy();
        this.collector = <any>0;

        if (this._render && this._render.destroy) this._render.destroy();
        this._render = <any>0;

        for (let i = 0; i < this._actors.length; i++) {
            let actor = this._actors[i];
            if (actor) actor.destroy();
        }
        const keys = Object.keys(this._userData);
        for (let i = 0; i < keys.length; i++) delete this._userData[keys[i]];
        if (this.movedBehaviors) this.movedBehaviors.length = <any>0;
        this.movedBehaviors = <any>0;

        if (this._actors) this._actors.length = <any>0;
        this._actors = <any>0;
        this._generalLayer = <any>0;
        this.isFirstStart = <any>0;

        if (this.movedOnDrag) this.movedOnDrag.length = <any>0;
        if (this._cursorHandler) {
            this._cursorHandler.clear();
            this._cursorHandler = <any>0;
        }
        this.movedOnDrag = <any>0;

        this._onStop$.destroy();
        this._onExit$.destroy();
        this._onStart$.destroy();
        this._onStartOnce$.destroy();
        this._onSetUserData$.destroy();

        this._onStop$ = <any>0;
        this._onExit$ = <any>0;
        this._onStart$ = <any>0;
        this._onStartOnce$ = <any>0;
        this._onSetUserData$ = <any>0;

        this._onDestroy$.destroy();
        this._onDestroy$ = <any>0;

        this._cursor = <any>0;
        this._isDestroyed = true;
        tickGenerator.clearTimeout(this.timerCounter);
        this.timerCounter = <any>0;
    }

    public unsubscribe(subscriber: ISubscriptionLike): void {
        if (this.collector) this.collector.unsubscribe(subscriber);
    }

    get name(): string {
        return this._name;
    }
}

class Drag implements IDragActor {
    public actor: IActor;
    public options: IDragDropOptions;

    constructor(actor: IActor, options?: IDragDropOptions) {
        this.actor = actor;
        this.options = this.getDefaultOptions();
        if (!options) return;

        if (!!options.callbackOnDrag) this.options.callbackOnDrag = options.callbackOnDrag;
        if (!!options.callbackOnMOve) this.options.callbackOnMOve = options.callbackOnMOve;
        if (!!options.callbackOnDrop) this.options.callbackOnDrop = options.callbackOnDrop;
        if (!!options.mouseCatch) this.options.mouseCatch = options.mouseCatch;
        if (!!options.zIndexOnDrop) this.options.zIndexOnDrop = options.zIndexOnDrop;
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
