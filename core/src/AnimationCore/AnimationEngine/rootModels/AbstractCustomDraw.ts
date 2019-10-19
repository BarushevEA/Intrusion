import {LayerHandler, IDimensions, IFramePool, IPolygon} from "../LayerHandler/LayerHandler";
import {mouseClickPosition$, mouseLeftDown$, mouseLeftUp$, mouseMovePosition$} from "../../Store/EventStore";
import {IMousePosition} from "../../CustomeDomComponent/AppAnimation";
import {Observable, ISubscriptionLike} from "../../CustomeLibraries/Observable";
import {ITextHandler} from "../LayerHandler/TextHandler";

//TODO frame pool technology need to use for lot of entities of class

export type ICustomDraw = {
    z_index: number;
    renderFrame(): void;
    destroy(): void;
}

export abstract class AbstractCustomDraw implements ICustomDraw, IDimensions {
    private static _savedFramePool: { [key: string]: IFramePool } = {};
    private static _mousePosition: IMousePosition = <any>0;
    public static tickCount$ = new Observable(<boolean>false);
    private _z_index = 0;
    private _z_index_memory = 0;

    public static tickCount() {
        requestAnimationFrame(AbstractCustomDraw.tickCount);
        AbstractCustomDraw.tickCount$.next(true);
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
            AbstractCustomDraw.tickCount$.subscribe(this.checkMouseOver.bind(this))
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
            AbstractCustomDraw._mousePosition = position;
            this.isMouseOver = isOver;
            this.isMouseOver$.next(isOver);
        }
    }

    private checkMouseOver() {
        if (this.isIgnoreEvents) {
            return;
        }

        this.mouseOver(AbstractCustomDraw._mousePosition);
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
        AbstractCustomDraw._savedFramePool[this.framePoolName] = pool;
    }

    get framePool(): IFramePool {
        const framePool = this.layerHandler.getFramePool();
        if (framePool && framePool.playedFrames && framePool.playedFrames.length) {
            return framePool;
        } else {
            return AbstractCustomDraw._savedFramePool[this.framePoolName];
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

    protected setLineWidth(width: number) {
        this.layerHandler.setLineWidth(width);
    }

    protected setColors(backgroundColor: string,
                        borderColor: string): void {
        this.layerHandler.setColors(
            backgroundColor,
            borderColor
        );
    }

    protected drawSimpleCircle(x: number, y: number, radius: number): void {
        this.layerHandler.drawSimpleCircle(x, y, radius);
    }

    protected drawPolygon(polygon: IPolygon): void {
        this.layerHandler.drawPolygon(polygon);
    }

    protected drawRectangle(x: number,
                            y: number,
                            width: number,
                            height: number): void {
        this.layerHandler.drawRectangle(x, y, width, height);
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
        return AbstractCustomDraw.tickCount$;
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

    get isCustomStoke(): boolean {
        return this.layerHandler.isCustomStroke;
    }

    set isCustomStoke(value: boolean) {
        this.layerHandler.isCustomStroke = value;
    }

    public setFramesDelay(delay: number) {
        this.layerHandler.setFramesDelay(delay);
    }

    get text(): ITextHandler {
        return this.layerHandler.text;
    }

    get z_index(): number {
        return this._z_index;
    }

    set z_index(value: number) {
        this._z_index = value;
    }

    get isLeftMouseCatch(): boolean {
        return this._isLeftMouseCatch;
    }

    public saveZIndex() {
        this._z_index_memory = this._z_index;
    }

    public restoreZIndex() {
        this._z_index = this._z_index_memory;
    }

    static get mousePosition(): IMousePosition {
        return this._mousePosition;
    }
}

AbstractCustomDraw.tickCount();
