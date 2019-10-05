import {LayerHandler, IDimensions, IFramePool} from "../LayerHandler";
import {mouseClickPosition$, mouseMovePosition$} from "../../Store/EventStore";
import {IMousePosition} from "../../CustomeDomComponent/AppAnimation";
import {CTMObservable, ISubscriptionLike} from "../../CustomeLibraries/CTMObservable";

//TODO frame pool technology need to use for lot of entities of class

export type ICustomDraw = {
    name: string;
    renderFrame(): void;
    setName(name: string): void;
    destroy(): void;
}

export abstract class AbstractCustomDraw implements ICustomDraw, IDimensions {
    static _savedFramePool: { [key: string]: IFramePool } = {};

    protected framePoolName: string = '';
    protected customCanvas: HTMLCanvasElement;
    protected layerHandler: LayerHandler;
    private _elementX = 0;
    private _elementY = 0;
    private _elementWidth = 0;
    private _elementHeight = 0;
    public name = '';
    private readonly subscribers: ISubscriptionLike[] = [];
    private isMouseOver = false;
    public isMouseOver$ = new CTMObservable(<boolean>false);
    public isMouseClick$ = new CTMObservable(<boolean>false);

    protected constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this._elementHeight = height;
        this._elementWidth = width;
        this.customCanvas = canvas;
        this.layerHandler = new LayerHandler(this.customCanvas);
        this.subscribers.push(mouseMovePosition$.subscribe(this.mouseOver.bind(this)));
        this.subscribers.push(mouseClickPosition$.subscribe(this.mouseClick.bind(this)));
    }

    private mouseOver(position: IMousePosition) {
        let isOver = this.checkOverPosition(position);

        if (isOver != this.isMouseOver) {
            this.isMouseOver = isOver;
            this.isMouseOver$.next(isOver);
        }
    }

    private mouseClick(position: IMousePosition) {
        let isOver = this.checkOverPosition(position);

        if (isOver) {
            this.isMouseClick$.next(isOver);
        }
    }

    private checkOverPosition(position: IMousePosition): boolean {
        let isOver = false;
        if (
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

    public abstract setName(name: string): void;

    protected setFramePoolName(name: string) {
        this.framePoolName = name;
    }

    set framePool(pool: IFramePool) {
        AbstractCustomDraw._savedFramePool[this.framePoolName] = pool;
    }

    get framePool(): IFramePool {
        return AbstractCustomDraw._savedFramePool[this.framePoolName];
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
        return {elementX: this._elementX, elementY: this._elementY, elementHeight: this._elementHeight, elementWidth: this._elementWidth}
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

    public setAnimationReverse() {
        this.layerHandler.setReverseToPlay();
    }

    public setAnimationOriginal() {
        this.layerHandler.setOriginalToPlay();
    }

    setVirtualCanvas(name: string): HTMLCanvasElement {
        return this.layerHandler.setVirtualCanvas(name, this._elementHeight, this._elementWidth);
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
}
