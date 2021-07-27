import {CanvasLayerHandler, IFramePool} from "../../LayerHandler/CanvasLayerHandler";
import {Observable} from "../../../Libraries/Observables/Observable";
import {ITextHandler} from "../../LayerHandler/TextHandler";
import {IShapeHandler} from "../../LayerHandler/shapeModules/ShapeHandler";
import {IActor, IDimensions} from "./ActorTypes";
import {PluginDock} from "../../Plugins/root/ActorPluginDock";
import {IPluginDock} from "../../Plugins/root/PluginTypes";
import {x_pos, y_pos} from "../../../Libraries/Types";
import {EventCollector, ICollector} from "../../../Libraries/EventCollector";
import {tickGenerator} from "../../../Libraries/TickGenerator";
import {ICallback, IOrderedListener, ISubscriber, ISubscriptionLike} from "../../../Libraries/Observables/Types";
import {IMousePosition} from "../../../Store/MouseStore";
import {EventStore} from "../../../Store/EventStore";

/** Frame pool technology need to use for lot of entities of class */

export abstract class AbstractActor implements IActor, IDimensions {
    private static _savedFramePool: { [framePoolName: string]: IFramePool } = {};
    private static _mousePosition: IMousePosition = <any>0;
    private _z_index = 0;
    private _z_index_memory = 0;
    private _layerName = '';
    private _layerNumber: number = 0;
    private _layer_name_memory = '';
    private _pluginDock: IPluginDock = <any>0;
    private _isUnlinked = true;

    protected _innerText = '';
    protected framePoolName: string = '';
    protected generalLayer: HTMLCanvasElement;
    protected layerHandler: CanvasLayerHandler;
    private _elementX = 0;
    private _elementY = 0;
    private _elementXPreview = 0;
    private _elementYPreview = 0;
    private _elementWidth = 0;
    private _elementHeight = 0;
    private _isLeftMouseCatch = false;
    private leftMouseCatchTimeIndex = -1;
    private leftMouseCatchTime = 140;
    private collector: ICollector = <any>0;
    private mouseEventsCollector: ICollector = <any>0;
    public isMouseOver = false;
    private _onMouseOver$ = new Observable(false);
    private _onMouseClick$ = new Observable(false);
    private _onMouseLeftClick$ = new Observable(false);
    private _onMouseRightClick$ = new Observable(false);
    private _onDestroyed$ = new Observable(false);
    private _onMouseLeftDrag$ = new Observable(<any>0);
    private _onMouseLeftDrop$ = new Observable(<any>0);
    private _beforeRender$ = new Observable(<any>0);
    private _afterRender$ = new Observable(<any>0);
    private _onEventEnableChange$ = new Observable(false);
    private _onImageLoad$ = new Observable(<any>0);
    private _isDestroyed = false;
    private _isEventsBlock = false;
    private _isDestroyProcessed = false;
    private isEventsDisabled = false;
    private _isEventsPaused = false;
    private _isDestroyEnabled = true;
    public eventStore: EventStore;

    public static clearFramePool() {
        const keys = Object.keys(this._savedFramePool);
        for (let i = 0; i < keys.length; i++) delete this._savedFramePool[keys[i]];
        this._savedFramePool = {};
    }

    protected constructor(canvas: HTMLCanvasElement,
                          eventStore: EventStore,
                          height: number,
                          width: number) {
        this._elementHeight = height;
        this._elementWidth = width;
        this.eventStore = eventStore;
        this.generalLayer = canvas;
        this.layerHandler = new CanvasLayerHandler(this.generalLayer);
        this.collector = new EventCollector();
        this.mouseEventsCollector = new EventCollector();
        this._pluginDock = new PluginDock<IActor>(this);
    }

    private innerEventsEnable() {
        this._onMouseOver$.enable();
        this._onMouseClick$.enable();
        this._onMouseLeftClick$.enable();
        this._onMouseRightClick$.enable();
        this._onMouseLeftDrag$.enable();
        this._onMouseLeftDrop$.enable();
        this._beforeRender$.enable();
        this._afterRender$.enable();
        this._onEventEnableChange$.next(true);
        this.checkMouseOver();
    }

    private innerEventsDisable() {
        this.checkMouseOver();
        this._onMouseOver$.disable();
        this._onMouseClick$.disable();
        this._onMouseLeftClick$.disable();
        this._onMouseRightClick$.disable();
        this._onMouseLeftDrag$.disable();
        this._onMouseLeftDrop$.disable();
        this._beforeRender$.disable();
        this._afterRender$.disable();
        this._onEventEnableChange$.next(false);
    }

    get isUnlinked(): boolean {
        return this._isUnlinked;
    }

    set isUnlinked(value: boolean) {
        this._isUnlinked = value;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get onEventEnableChange$(): Observable<boolean> {
        return this._onEventEnableChange$;
    }

    get onDestroyed$(): Observable<boolean> {
        return this._onDestroyed$;
    }

    private initEvents(): void {
        if (this._isEventsBlock ||
            this._isDestroyProcessed ||
            !this.mouseEventsCollector.isEmpty) return;

        if (!this.mouseEventsCollector.collect) {
            this.isDestroyEnabled = true;
            this.destroy();
            return;
        }
        this.mouseEventsCollector.collect(
            this.eventStore.mouseMovePosition$.subscribe(this.getOrderedListener(this.mouseOver.bind(this))),
            this.eventStore.mouseClickPosition$.subscribe(this.getOrderedListener(this.mouseClick.bind(this))),
            this.eventStore.mouseLeftDown$.subscribe(this.getOrderedListener(this.leftMouseDown.bind(this))),
            this.eventStore.mouseLeftUp$.subscribe(this.getOrderedListener(this.leftMouseUp.bind(this))),
            this.eventStore.mouseRightDown$.subscribe(this.getOrderedListener(this.rightMouseDown.bind(this))),
            this.eventStore.mouseRightUp$.subscribe(this.getOrderedListener(this.rightMouseUp.bind(this))),

            this._onMouseLeftClick$.subscribe(this.tryLeftMouseCatch.bind(this)),
            tickGenerator.tick100$.subscribe(this.checkMouseOver.bind(this))
        );
        this.innerEventsEnable();
        this.isEventsDisabled = false;
    }

    public resetEvents(): void {
        if (this._isDestroyed) return;
        this._isEventsBlock = false;
        this.isEventsDisabled = false;
        this._isEventsPaused = false;
        if (this.mouseEventsCollector.isEmpty) {
            this.initEvents();
        } else {
            this.mouseEventsCollector.pauseDisable();
            this.innerEventsEnable();
        }
        this.checkMouseOver();
    }

    private getOrderedListener(callBack: ICallback): IOrderedListener {
        return {
            callBack,
            order: this.layerNumber,
            isEventPause: false,
            isEventStop: false
        }
    }

    public pauseEvents(): void {
        if (this._isEventsBlock ||
            this.isEventsDisabled ||
            !this.mouseEventsCollector) {
            return;
        }
        this.innerEventsDisable();
        this.mouseEventsCollector.pauseEnable();
        this._isEventsPaused = true;
    }

    public unPauseEvents(): void {
        if (this._isDestroyed) return;
        if (this._isEventsBlock ||
            this.isEventsDisabled) return;

        if (this.mouseEventsCollector.isEmpty) {
            this.initEvents();
        } else {
            this.mouseEventsCollector.pauseDisable();
            this.innerEventsEnable();
        }
        this._isEventsPaused = false;
    }

    get isEventsPaused(): boolean {
        return this._isEventsPaused;
    }

    public disableEvents(): void {
        if (!this.mouseEventsCollector) {
            return;
        }
        this.innerEventsDisable();
        this.mouseEventsCollector.pauseEnable();
        this.isEventsDisabled = true;
    }

    set isEventsBlock(value: boolean) {
        this._isEventsBlock = value;
        if (value) {
            this.disableEvents();
        } else {
            this.enableEvents();
        }
    }

    get isEventsBlock(): boolean {
        return this._isEventsBlock;
    }

    public enableEvents(): void {
        if (this._isDestroyed) return;
        if (this.mouseEventsCollector.isEmpty) {
            this.initEvents();
        } else {
            this.mouseEventsCollector.pauseDisable();
            this.innerEventsEnable();
            this.isEventsDisabled = false;
        }
    }

    private mouseOver(position: IMousePosition): void {
        let isOver = this.checkOverPosition(position);

        AbstractActor._mousePosition = position;

        if (isOver === this.isMouseOver) {
            return;
        }
        this.isMouseOver = isOver;
        this._onMouseOver$.next(this.isMouseOver);
    }

    private checkMouseOver(): void {
        if (this.isDestroyed) {
            return;
        }
        this.mouseOver(AbstractActor._mousePosition);
    }

    private mouseClick(position: IMousePosition): void {
        if (this.isDestroyed) {
            return;
        }
        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this._onMouseClick$.next(isOver);
        }
    }

    private leftMouseDown(position: IMousePosition): void {
        this.mouseLeftClick(position, true);
    }

    private leftMouseUp(position: IMousePosition): void {
        this.mouseLeftClick(position, false);
    }

    private rightMouseDown(position: IMousePosition): void {
        this.mouseRightClick(position, true);
    }

    private rightMouseUp(position: IMousePosition): void {
        this.mouseRightClick(position, false);
    }

    private tryLeftMouseCatch(isDown: boolean): void {
        if (this.leftMouseCatchTimeIndex !== -1) {
            tickGenerator.clearTimeout(<any>this.leftMouseCatchTimeIndex);
            this.leftMouseCatchTimeIndex = <any>0;
            this.leftMouseCatchTimeIndex = -1;
            if (!isDown && this._isLeftMouseCatch) {
                this._isLeftMouseCatch = false;
                this._onMouseLeftDrop$.next(0);
            }
            return;
        }
        if (!isDown) {
            return;
        }
        this.leftMouseCatchTimeIndex = <any>tickGenerator.executeTimeout(() => {
            if (!this._isDestroyed) {
                this._isLeftMouseCatch = true;
                this._onMouseLeftDrag$.next(0);
            }
        }, this.leftMouseCatchTime);
    }

    private mouseLeftClick(position: IMousePosition, isDown: boolean) {
        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this._onMouseLeftClick$.next(isDown);
        } else {
            this.tryLeftMouseCatch(isOver);
        }
    }

    private mouseRightClick(position: IMousePosition, isDown: boolean) {
        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this._onMouseRightClick$.next(isDown);
        } else {
            this.tryLeftMouseCatch(isOver);
        }
    }

    private checkOverPosition(position: IMousePosition): boolean {
        let isOver = false;
        if (
            position &&
            position.x >= this._elementX &&
            position.x <= (this._elementX + this._elementWidth) &&
            position.y >= this._elementY &&
            position.y <= (this._elementY + this._elementHeight)
        ) {
            isOver = true;
        }
        return isOver;
    }

    public abstract renderFrame(): void;

    public render(): void {
        this._beforeRender$.next(0);
        this.renderFrame();
        this._afterRender$.next(0);
    }

    protected setFramePoolName(name: string) {
        this.framePoolName = name;
    }

    public getFramePoolName(): string {
        return this.framePoolName;
    }

    set framePool(pool: IFramePool) {
        AbstractActor._savedFramePool[this.framePoolName] = pool;
    }

    get framePool(): IFramePool {
        const framePool = this.layerHandler.getFramePool();
        if (framePool && framePool.playedFrames && framePool.playedFrames.length) {
            return framePool;
        } else {
            return AbstractActor._savedFramePool[this.framePoolName];
        }
    }

    public setPosition(x: x_pos, y: y_pos): void {
        this._elementX = x;
        this._elementY = y;
    }

    protected setSize(height: number, width: number): void {
        this._elementHeight = height;
        this._elementWidth = width;
    }

    public getDimensions(): IDimensions {
        return {
            xPos: this._elementX,
            yPos: this._elementY,
            height: this._elementHeight,
            width: this._elementWidth
        }
    }

    get beforeRender$(): Observable<any> {
        return this._beforeRender$;
    }

    get afterRender$(): Observable<any> {
        return this._afterRender$;
    }

    get onImageLoad$(): Observable<any> {
        return this._onImageLoad$;
    }

    get xPosPreview(): number {
        return this._elementXPreview;
    }

    get yPosPreview(): number {
        return this._elementYPreview;
    }

    set xPos(value: x_pos) {
        this._elementXPreview = this._elementX;
        this._elementX = value;
    }

    get xPos(): x_pos {
        return this._elementX;
    }

    set yPos(value: x_pos) {
        this._elementYPreview = this._elementY;
        this._elementY = value;
    }

    get yPos(): x_pos {
        return this._elementY;
    }

    get width(): number {
        return this._elementWidth;
    }

    set width(value: number) {
        this._elementWidth = value;
    }

    get height(): number {
        return this._elementHeight;
    }

    set height(value: number) {
        this._elementHeight = value;
    }

    get pluginDock(): IPluginDock {
        return this._pluginDock;
    }

    public resetStopFrame(): void {
        this.layerHandler.resetStopFrame();
    }

    public setStopFrame(index: number): void {
        this.layerHandler.setStopFrame(index);
    }

    public setAnimationReverse(): void {
        this.layerHandler.setReverseToPlay();
    }

    public setAnimationOriginal(): void {
        this.layerHandler.setOriginalToPlay();
    }

    get isAnimationOriginal(): boolean {
        return this.layerHandler.isOriginal;
    }

    public setVirtualLayer(name: string,
                           height = this._elementHeight,
                           width = this._elementWidth): HTMLCanvasElement {
        return this.layerHandler.setVirtualLayer(name, height, width);
    }

    public clearLayer(x: x_pos = 0, y: y_pos = 0, width?: number, height?: number): void {
        this.layerHandler.clear(x, y, width, height);
    }

    public restoreDefaultLayer(): void {
        this.layerHandler.restoreDefaultLayer();
    }

    public deleteVirtual(targetName: string): void {
        this.layerHandler.deleteVirtual(targetName);
    }

    public drawVirtualOnVirtual(targetName: string,
                                sourceName: string,
                                x: number, y: number): void {
        this.layerHandler.drawVirtualOnVirtual(targetName, sourceName, x, y);
    }

    public drawVirtualOnGeneral(sourceName: string,
                                x: number,
                                y: number,
                                width?: number,
                                height?: number,
                                xD?: number,
                                yD?: number,
                                widthD?: number,
                                heightD?: number
    ): void {
        if (this.isDestroyed) return;
        this.layerHandler.drawVirtualOnGeneral(
            sourceName,
            x,
            y,
            width,
            height,
            xD,
            yD,
            widthD,
            heightD);
    }

    public collect(...subscribers: ISubscriptionLike[]): void {
        if (!this.collector.collect) {
            this.isDestroyEnabled = true;
            this.destroy();
            return;
        }
        this.collector.collect(...subscribers);
    }

    public destroy(): void {
        if (!this._isDestroyEnabled ||
            this._isDestroyed ||
            this._isDestroyProcessed) {
            return;
        }
        this._isDestroyProcessed = true;

        this._onDestroyed$.next(true);

        this.disableEvents();

        this.collector.destroy();
        this.collector = <any>0;

        this.mouseEventsCollector.destroy();
        this.mouseEventsCollector = <any>0;

        this._z_index = <any>0;
        this._z_index_memory = <any>0;
        this._layerName = <any>0;
        this._layer_name_memory = <any>0;
        this.framePoolName = <any>0;
        this.generalLayer = <any>0;
        this._isLeftMouseCatch = <any>0;
        this.leftMouseCatchTimeIndex = <any>0;
        this.leftMouseCatchTime = <any>0;
        this.isMouseOver = <any>0;
        this._onMouseOver$.destroy();
        this._onMouseClick$.destroy();
        this._onMouseLeftClick$.destroy();
        this._onMouseRightClick$.destroy();
        this._onMouseLeftDrag$.destroy();
        this._onMouseLeftDrop$.destroy();
        this._onDestroyed$.destroy();
        this._onEventEnableChange$.destroy();
        this._onImageLoad$.destroy();
        this._onImageLoad$ = <any>0;
        this._onEventEnableChange$ = <any>0;
        this._onDestroyed$ = <any>0;
        this._onMouseOver$ = <any>0;
        this._onMouseClick$ = <any>0;
        this._onMouseLeftClick$ = <any>0;
        this._onMouseRightClick$ = <any>0;
        this._onMouseLeftDrag$ = <any>0;
        this._onMouseLeftDrop$ = <any>0;
        this._pluginDock.destroy();
        this._pluginDock = <any>0;
        this.layerHandler = <any>0;
        this._isDestroyed = true;
    }

    public unsubscribe(subscriber: ISubscriptionLike): void {
        if (this.collector) {
            this.collector.unsubscribe(subscriber);
        }
    }

    public setFramesDelay(delay: number): void {
        this.layerHandler.setFramesDelay(delay);
    }

    get text(): ITextHandler {
        return this.layerHandler.text;
    }

    get shape(): IShapeHandler {
        return this.layerHandler.shape;
    }

    set z_index(value: number) {
        this._z_index = value;
    }

    get z_index(): number {
        return this._z_index;
    }

    get layerName(): string {
        return this._layerName;
    }

    set layerName(value: string) {
        this._layerName = value;
    }

    get isLeftMouseCatch(): boolean {
        return this._isLeftMouseCatch;
    }

    get onMouseLeftDrop$(): ISubscriber<any> {
        return this._onMouseLeftDrop$;
    }

    get onMouseLeftDrag$(): ISubscriber<any> {
        return this._onMouseLeftDrag$;
    }

    get onMouseRightClick$(): ISubscriber<boolean> {
        return this._onMouseRightClick$;
    }

    get onMouseClick$(): ISubscriber<boolean> {
        return this._onMouseClick$;
    }

    get onMouseLeftClick$(): ISubscriber<boolean> {
        return this._onMouseLeftClick$;
    }

    get onMouseOver$(): ISubscriber<boolean> {
        return this._onMouseOver$;
    }

    public saveZIndex(): void {
        this._z_index_memory = this._z_index;
    }

    public saveLayerIndex(): void {
        this._layer_name_memory = this._layerName;
    }

    public restoreZIndex(): void {
        this._z_index = this._z_index_memory;
    }

    public restoreLayerIndex(): void {
        this._layerName = this._layer_name_memory;
    }

    static get mousePosition(): IMousePosition {
        return this._mousePosition;
    }

    get isDestroyEnabled(): boolean {
        return this._isDestroyEnabled;
    }

    set isDestroyEnabled(value: boolean) {
        this._isDestroyEnabled = value;
    }

    get layerNumber(): number {
        return this._layerNumber;
    }

    set layerNumber(value: number) {
        this._layerNumber = value;
    }

    get innerText(): string {
        return this._innerText;
    }
}
