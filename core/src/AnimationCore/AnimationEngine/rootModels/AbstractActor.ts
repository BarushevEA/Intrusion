import {IDimensions, IFramePool, LayerHandler} from "../LayerHandler/LayerHandler";
import {mouseClickPosition$, mouseLeftDown$, mouseLeftUp$, mouseMovePosition$} from "../../Store/EventStore";
import {IMousePosition} from "../../CustomeDomComponent/AppAnimation";
import {ISubscriptionLike, Observable} from "../../CustomeLibraries/Observable";
import {ITextHandler} from "../LayerHandler/TextHandler";
import {IShapeHandler} from "../LayerHandler/ShapeHandler";

//TODO frame pool technology need to use for lot of entities of class

export type IActor = {
    z_index: number;
    layer_name: string;
    saveLayerIndex(): void;
    restoreLayerIndex(): void;
    renderFrame(): void;
    destroy(): void;
}

export abstract class AbstractActor implements IActor, IDimensions {
    private static _savedFramePool: { [key: string]: IFramePool } = {};
    private static _mousePosition: IMousePosition = <any>0;
    public static tickCount$ = new Observable(<boolean>false);
    private _z_index = 0;
    private _z_index_memory = 0;
    private _layer_name = '';
    private _layer_name_memory = '';

    public static tickCount() {
        requestAnimationFrame(AbstractActor.tickCount);
        AbstractActor.tickCount$.next(true);
    }

    protected framePoolName: string = '';
    protected generalLayer: HTMLCanvasElement;
    protected layerHandler: LayerHandler;
    private _elementX = 0;
    private _elementY = 0;
    private _elementWidth = 0;
    private _elementHeight = 0;
    private _isLeftMouseCatch = false;
    private leftMouseCatchTimeIndex = -1;
    private leftMouseCatchTime = 200;
    private readonly subscribers: ISubscriptionLike[] = [];
    private isMouseOver = false;
    public isMouseOver$ = new Observable(<boolean>false);
    public isMouseClick$ = new Observable(<boolean>false);
    public isMouseLeftClick$ = new Observable(<boolean>false);
    public isMouseLeftDrag$ = new Observable(<any>0);
    public isMouseLeftDrop$ = new Observable(<any>0);
    public isIgnoreEvents = false;

    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this._elementHeight = height;
        this._elementWidth = width;
        this.generalLayer = canvas;
        this.layerHandler = new LayerHandler(this.generalLayer);
        this.collect(
            mouseMovePosition$.subscribe(this.mouseOver.bind(this)),
            mouseClickPosition$.subscribe(this.mouseClick.bind(this)),
            mouseLeftDown$.subscribe(this.leftMouseDown.bind(this)),
            mouseLeftUp$.subscribe(this.leftMouseUp.bind(this)),
            this.isMouseLeftClick$.subscribe(this.tryLeftMuseCatch.bind(this)),
            AbstractActor.tickCount$.subscribe(this.checkMouseOver.bind(this))
        );
    }

    disableEvents() {
        this.isIgnoreEvents = true;
    }

    enableEvents() {
        this.isIgnoreEvents = false;
    }

    private mouseOver(position: IMousePosition) {
        if (this.isIgnoreEvents) {
            return;
        }

        let isOver = this.checkOverPosition(position);

        if (isOver != this.isMouseOver) {
            AbstractActor._mousePosition = position;
            this.isMouseOver = isOver;
            this.isMouseOver$.next(isOver);
        }
    }

    private checkMouseOver() {
        if (this.isIgnoreEvents) {
            return;
        }

        this.mouseOver(AbstractActor._mousePosition);
    }

    private mouseClick(position: IMousePosition) {
        if (this.isIgnoreEvents) {
            return;
        }

        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this.isMouseClick$.next(isOver);
        }
    }

    private leftMouseDown(position: IMousePosition) {
        this.mouseLeftClick(position, true);
    }

    private leftMouseUp(position: IMousePosition) {
        this.mouseLeftClick(position, false);
    }

    private tryLeftMuseCatch(isDown: boolean): void {
        if (this.leftMouseCatchTimeIndex !== -1) {
            clearTimeout(this.leftMouseCatchTimeIndex);
            this.leftMouseCatchTimeIndex = -1;
            if (!isDown && this._isLeftMouseCatch) {
                this._isLeftMouseCatch = false;
                this.isMouseLeftDrop$.next(0);
            }
            return;
        }
        if (!isDown) {
            return;
        }
        this.leftMouseCatchTimeIndex = setTimeout(() => {
            this._isLeftMouseCatch = true;
            this.isMouseLeftDrag$.next(0);
        }, this.leftMouseCatchTime);
    }

    private mouseLeftClick(position: IMousePosition, isDown: boolean) {
        if (this.isIgnoreEvents) {
            return;
        }

        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this.isMouseLeftClick$.next(isDown);
        } else {
            this.tryLeftMuseCatch(isOver);
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
            elementX: this._elementX,
            elementY: this._elementY,
            elementHeight: this._elementHeight,
            elementWidth: this._elementWidth
        }
    }

    randomize(num: number): number {
        return Math.round(Math.random() * num)
    }

    get elementX(): number {
        return this._elementX;
    }

    set elementX(value: number) {
        this._elementX = value;
    }

    get elementY(): number {
        return this._elementY;
    }

    set elementY(value: number) {
        this._elementY = value;
    }

    get elementWidth(): number {
        return this._elementWidth;
    }

    set elementWidth(value: number) {
        this._elementWidth = value;
    }

    get elementHeight(): number {
        return this._elementHeight;
    }

    set elementHeight(value: number) {
        this._elementHeight = value;
    }

    public resetStopFrame() {
        this.layerHandler.resetStopFrame();
    }

    public setStopFrame(index: number) {
        this.layerHandler.setStopFrame(index);
    }

    public setAnimationReverse() {
        this.layerHandler.setReverseToPlay();
    }

    public setAnimationOriginal() {
        this.layerHandler.setOriginalToPlay();
    }

    setVirtualLayer(name: string): HTMLCanvasElement {
        return this.layerHandler.setVirtualLayer(name, this._elementHeight, this._elementWidth);
    }

    restorePreviousLayer() {
        this.layerHandler.restorePreviousLayer();
    }

    deleteVirtual(targetName: string): void {
        this.layerHandler.deleteVirtual(targetName);
    }

    drawVirtualOnVirtual(targetName: string,
                         sourceName: string,
                         x: number, y: number): void {
        this.layerHandler.drawVirtualOnVirtual(targetName, sourceName, x, y);
    }

    drawVirtualOnGeneral(sourceName: string,
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

    get tickCounter$() {
        return AbstractActor.tickCount$;
    }

    public collect(...subscribers: ISubscriptionLike[]) {
        for (let i = 0; i < subscribers.length; i++) {
            this.subscribers.push(subscribers[i]);
        }
    }

    destroy() {
        for (let i = 0; i < this.subscribers.length; i++) {
            const subscriber = this.subscribers.pop();
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        this.subscribers.length = 0;
    }

    public setFramesDelay(delay: number) {
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

    get layer_name(): string {
        return this._layer_name;
    }

    set layer_name(value: string) {
        this._layer_name = value;
    }

    get isLeftMouseCatch(): boolean {
        return this._isLeftMouseCatch;
    }

    public saveZIndex(): void {
        this._z_index_memory = this._z_index;
    }

    public saveLayerIndex(): void {
        this._layer_name_memory = this._layer_name;
    }

    public restoreZIndex(): void {
        this._z_index = this._z_index_memory;
    }

    public restoreLayerIndex(): void {
        this._layer_name = this._layer_name_memory;
    }

    static get mousePosition(): IMousePosition {
        return this._mousePosition;
    }
}

AbstractActor.tickCount();
