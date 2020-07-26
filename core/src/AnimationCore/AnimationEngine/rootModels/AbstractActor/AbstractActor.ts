import {CanvasLayerHandler, IFramePool} from "../../LayerHandler/CanvasLayerHandler";
import {
    mouseClickPosition$,
    mouseLeftDown$,
    mouseLeftUp$,
    mouseMovePosition$,
    mouseRightDown$,
    mouseRightUp$
} from "../../../Store/EventStore";
import {IMousePosition} from "../../../DomComponent/AppAnimation";
import {Observable} from "../../../Libraries/Observables/Observable";
import {ITextHandler} from "../../LayerHandler/TextHandler";
import {IShapeHandler} from "../../LayerHandler/shapeModules/ShapeHandler";
import {IActor, IDimensions} from "./ActorTypes";
import {PluginDock} from "../../Plugins/root/ActorPluginDock";
import {IPluginDock} from "../../Plugins/root/PluginTypes";
import {x_pos, y_pos} from "../../../Libraries/Types";
import {EventCollector, ICollector} from "../../../Libraries/EventCollector";
import {tickGenerator} from "../../../Libraries/TickGenerator";
import {ISubscriber, ISubscriptionLike} from "../../../Libraries/Observables/Types";

/** Frame pool technology need to use for lot of entities of class */

export abstract class AbstractActor implements IActor, IDimensions {
    private static _savedFramePool: { [key: string]: IFramePool } = {};
    private static _mousePosition: IMousePosition = <any>0;
    private _z_index = 0;
    private _z_index_memory = 0;
    private _layerName = '';
    private _layerNumber: number = 0;
    private _layer_name_memory = '';
    private _pluginDock: IPluginDock = <any>0;
    private _isUnlinked = true;

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
    private _isMouseOver$ = new Observable(<boolean>false);
    private _isMouseClick$ = new Observable(<boolean>false);
    private _isMouseLeftClick$ = new Observable(<boolean>false);
    private _isMouseRightClick$ = new Observable(<boolean>false);
    private _isDestroyed$ = new Observable(<boolean>false);
    private _isMouseLeftDrag$ = new Observable(<any>0);
    private _isMouseLeftDrop$ = new Observable(<any>0);
    private _beforeRender$ = new Observable(<any>0);
    private _afterRender$ = new Observable(<any>0);
    private _isDestroyed = false;
    private _isEventsBlock = false;
    private _isDestroyProcessed = false;
    private isEventsDisabled = false;
    private _isEventsPaused = false;
    private _isDestroyEnabled = true;

    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this._elementHeight = height;
        this._elementWidth = width;
        this.generalLayer = canvas;
        this.layerHandler = new CanvasLayerHandler(this.generalLayer);
        this.collector = new EventCollector();
        this.mouseEventsCollector = new EventCollector();
        this._pluginDock = new PluginDock<IActor>(this);
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

    get isDestroyed$(): Observable<boolean> {
        return this._isDestroyed$;
    }

    private initEvents(): void {
        if (this._isEventsBlock ||
            this._isDestroyProcessed) {
            return;
        }
        if (!this.mouseEventsCollector.collect) {
            this.isDestroyEnabled = true;
            this.destroy();
            return;
        }
        this.mouseEventsCollector.collect(
            mouseMovePosition$.subscribe({callBack: this.mouseOver.bind(this), order: this.layerNumber}),
            mouseClickPosition$.subscribe({callBack: this.mouseClick.bind(this), order: this.layerNumber}),
            mouseLeftDown$.subscribe({callBack: this.leftMouseDown.bind(this), order: this.layerNumber}),
            mouseLeftUp$.subscribe({callBack: this.leftMouseUp.bind(this), order: this.layerNumber}),
            mouseRightDown$.subscribe({callBack: this.rightMouseDown.bind(this), order: this.layerNumber}),
            mouseRightUp$.subscribe({callBack: this.rightMouseUp.bind(this), order: this.layerNumber}),
            this._isMouseLeftClick$.subscribe(this.tryLeftMouseCatch.bind(this)),
            tickGenerator.tick100$.subscribe(this.checkMouseOver.bind(this))
        );
        this.isEventsDisabled = false;
    }

    public pauseEvents(): void {
        if (this.isEventsDisabled || !this.mouseEventsCollector) {
            return;
        }
        this.mouseEventsCollector.clear();
        this._isEventsPaused = true;
    }

    public unPauseEvents(): void {
        if (this.isEventsDisabled) {
            return;
        }
        this.isEventsBlock = false;
        this._isEventsPaused = false;
    }

    get isEventsPaused(): boolean {
        return this._isEventsPaused;
    }

    public disableEvents(): void {
        if (!this.mouseEventsCollector) {
            return;
        }
        this.mouseEventsCollector.clear();
        this.isEventsDisabled = true;
    }

    set isEventsBlock(value: boolean) {
        if (value) {
            this.disableEvents();
        } else {
            this.enableEvents();
        }
        this._isEventsBlock = value;
    }

    get isEventsBlock(): boolean {
        return this._isEventsBlock;
    }

    public enableEvents(): void {
        if (this.isDestroyed) {
            return;
        }
        this.initEvents();
    }

    private mouseOver(position: IMousePosition): void {
        let isOver = this.checkOverPosition(position);

        if (isOver === this.isMouseOver) {
            return;
        }

        AbstractActor._mousePosition = position;
        this.isMouseOver = isOver;
        this._isMouseOver$.next(this.isMouseOver);
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
            this._isMouseClick$.next(isOver);
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
                this._isMouseLeftDrop$.next(0);
            }
            return;
        }
        if (!isDown) {
            return;
        }
        this.leftMouseCatchTimeIndex = <any>tickGenerator.executeTimeout(() => {
            this._isLeftMouseCatch = true;
            this._isMouseLeftDrag$.next(0);
        }, this.leftMouseCatchTime);
    }

    private mouseLeftClick(position: IMousePosition, isDown: boolean) {
        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this._isMouseLeftClick$.next(isDown);
        } else {
            this.tryLeftMouseCatch(isOver);
        }
    }

    private mouseRightClick(position: IMousePosition, isDown: boolean) {
        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this._isMouseRightClick$.next(isDown);
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

        this._isDestroyed$.next(true);

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
        this._isMouseOver$.destroy();
        this._isMouseClick$.destroy();
        this._isMouseLeftClick$.destroy();
        this._isMouseRightClick$.destroy();
        this._isMouseLeftDrag$.destroy();
        this._isMouseLeftDrop$.destroy();
        this._isDestroyed$.destroy();
        this._isDestroyed$ = <any>0;
        this._isMouseOver$ = <any>0;
        this._isMouseClick$ = <any>0;
        this._isMouseLeftClick$ = <any>0;
        this._isMouseRightClick$ = <any>0;
        this._isMouseLeftDrag$ = <any>0;
        this._isMouseLeftDrop$ = <any>0;
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

    get isMouseLeftDrop$(): ISubscriber<any> {
        return this._isMouseLeftDrop$;
    }

    get isMouseLeftDrag$(): ISubscriber<any> {
        return this._isMouseLeftDrag$;
    }

    get isMouseRightClick$(): ISubscriber<boolean> {
        return this._isMouseRightClick$;
    }

    get isMouseClick$(): ISubscriber<boolean> {
        return this._isMouseClick$;
    }

    get isMouseLeftClick$(): ISubscriber<boolean> {
        return this._isMouseLeftClick$;
    }

    get isMouseOver$(): ISubscriber<boolean> {
        return this._isMouseOver$;
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
}
