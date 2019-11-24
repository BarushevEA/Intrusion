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
import {ISubscriber, ISubscriptionLike, Observable} from "../../../Libraries/Observable";
import {ITextHandler} from "../../LayerHandler/TextHandler";
import {IShapeHandler} from "../../LayerHandler/ShapeHandler";
import {IActor, IDimensions} from "./ActorTypes";
import {PluginDock} from "../../Plugins/root/ActorPluginDock";
import {IPluginDock} from "../../Plugins/root/PluginTypes";

/** Frame pool technology need to use for lot of entities of class */

export abstract class AbstractActor implements IActor, IDimensions {
    private static _savedFramePool: { [key: string]: IFramePool } = {};
    private static _mousePosition: IMousePosition = <any>0;
    private static tickCount$ = new Observable(<boolean>false);
    private _z_index = 0;
    private _z_index_memory = 0;
    private _layerName = '';
    private _layer_name_memory = '';
    private _pluginDock: IPluginDock = <any>0;

    public static tickCount() {
        requestAnimationFrame(AbstractActor.tickCount);
        AbstractActor.tickCount$.next(true);
    }

    protected framePoolName: string = '';
    protected generalLayer: HTMLCanvasElement;
    protected layerHandler: CanvasLayerHandler;
    private _elementX = 0;
    private _elementY = 0;
    private _elementWidth = 0;
    private _elementHeight = 0;
    private _isLeftMouseCatch = false;
    private leftMouseCatchTimeIndex = -1;
    private leftMouseCatchTime = 200;
    private subscribers: ISubscriptionLike[] = [];
    private readonly mouseEvents: ISubscriptionLike[] = [];
    public isMouseOver = false;
    private _isMouseOver$ = new Observable(<boolean>false);
    private _isMouseClick$ = new Observable(<boolean>false);
    private _isMouseLeftClick$ = new Observable(<boolean>false);
    private _isMouseRightClick$ = new Observable(<boolean>false);
    private _isMouseLeftDrag$ = new Observable(<any>0);
    private _isMouseLeftDrop$ = new Observable(<any>0);
    private destroySubscriberCounter = 0;

    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this._elementHeight = height;
        this._elementWidth = width;
        this.generalLayer = canvas;
        this.layerHandler = new CanvasLayerHandler(this.generalLayer);
        this._pluginDock = new PluginDock<IActor>(this);
    }

    private initEvents(): void {
        if (this.mouseEvents.length) {
            return;
        }
        this.mouseEvents.push(mouseMovePosition$.subscribe(this.mouseOver.bind(this)));
        this.mouseEvents.push(mouseClickPosition$.subscribe(this.mouseClick.bind(this)));
        this.mouseEvents.push(mouseLeftDown$.subscribe(this.leftMouseDown.bind(this)));
        this.mouseEvents.push(mouseLeftUp$.subscribe(this.leftMouseUp.bind(this)));
        this.mouseEvents.push(mouseRightDown$.subscribe(this.rightMouseDown.bind(this)));
        this.mouseEvents.push(mouseRightUp$.subscribe(this.rightMouseUp.bind(this)));
        this.mouseEvents.push(this._isMouseLeftClick$.subscribe(this.tryLeftMouseCatch.bind(this)));
        this.mouseEvents.push(AbstractActor.tickCount$.subscribe(this.checkMouseOver.bind(this)));
    }

    public disableEvents(): void {
        for (let i = 0; i < this.mouseEvents.length; i++) {
            this.mouseEvents[i].unsubscribe();
        }
        this.mouseEvents.length = 0;
    }

    public enableEvents(): void {
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
        this.mouseOver(AbstractActor._mousePosition);
    }

    private mouseClick(position: IMousePosition): void {
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
            clearTimeout(this.leftMouseCatchTimeIndex);
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
        this.leftMouseCatchTimeIndex = setTimeout(() => {
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

    public setPosition(x: number, y: number): void {
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

    randomize(num: number): number {
        return Math.round(Math.random() * num)
    }

    get xPos(): number {
        return this._elementX;
    }

    set xPos(value: number) {
        this._elementX = value;
    }

    get yPos(): number {
        return this._elementY;
    }

    set yPos(value: number) {
        this._elementY = value;
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

    public setVirtualLayer(name: string): HTMLCanvasElement {
        return this.layerHandler.setVirtualLayer(name, this._elementHeight, this._elementWidth);
    }

    public restorePreviousLayer() {
        this.layerHandler.restorePreviousLayer();
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
        for (let i = 0; i < subscribers.length; i++) {
            this.subscribers.push(subscribers[i]);
        }
    }

    public destroy(): void {
        for (let i = 0; i < this.subscribers.length; i++) {
            const subscriber = this.subscribers[i];
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        this.subscribers.length = 0;
        this.disableEvents();
        this._z_index = <any>0;
        this._z_index_memory = <any>0;
        this._layerName = <any>0;
        this._layer_name_memory = <any>0;
        this.framePoolName = <any>0;
        this.generalLayer = <any>0;
        this.layerHandler = <any>0;
        this._elementX = <any>0;
        this._elementY = <any>0;
        this._elementWidth = <any>0;
        this._elementHeight = <any>0;
        this._isLeftMouseCatch = <any>0;
        this.leftMouseCatchTimeIndex = <any>0;
        this.leftMouseCatchTime = <any>0;
        this.isMouseOver = <any>0;
        if (this._isMouseOver$.destroy) {
            this._isMouseOver$.destroy();
        }
        if (this._isMouseClick$.destroy) {
            this._isMouseClick$.destroy();
        }
        if (this._isMouseLeftClick$.destroy) {
            this._isMouseLeftClick$.destroy();
        }
        if (this._isMouseRightClick$.destroy) {
            this._isMouseRightClick$.destroy();
        }
        if (this._isMouseLeftDrag$.destroy) {
            this._isMouseLeftDrag$.destroy();
        }
        if (this._isMouseLeftDrop$.destroy) {
            this._isMouseLeftDrop$.destroy();
        }
        this._isMouseOver$ = <any>0;
        this._isMouseClick$ = <any>0;
        this._isMouseLeftClick$ = <any>0;
        this._isMouseLeftDrag$ = <any>0;
        this._isMouseLeftDrop$ = <any>0;
        this.destroySubscriberCounter = <any>0;
        if (this._pluginDock) {
            this._pluginDock.destroy();
            this._pluginDock = <any>0;
        }
    }

    public unsubscribe(subscriber: ISubscriptionLike): void {
        for (let i = 0; i < this.subscribers.length; i++) {
            const savedSubscriber = this.subscribers[i];
            if (savedSubscriber && savedSubscriber === subscriber) {
                savedSubscriber.unsubscribe();
                this.subscribers[i] = <any>0;
                this.destroySubscriberCounter++;
                break;
            }
        }

        this.clearCollector();
    }

    private clearCollector(): void {
        if (this.destroySubscriberCounter > 1000 && this.subscribers.length) {
            const tmp: ISubscriptionLike[] = [];
            for (let i = 0; i < this.subscribers.length; i++) {
                const subscriber = this.subscribers[i];
                if (subscriber) {
                    tmp.push(subscriber);
                }
            }
            this.subscribers = tmp;
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

    get z_index(): number {
        return this._z_index;
    }

    set z_index(value: number) {
        this._z_index = value;
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
}

AbstractActor.tickCount();
