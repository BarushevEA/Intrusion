import {ICustomDraw} from "./rootModels/AbstractCustomDraw";
import {findElementOnArray} from "../CustomeLibraries/FunctionLibs";

export type IRenderController = {
    setCanvas(canvas: HTMLCanvasElement): void;
    setDrawElement(element: ICustomDraw): void;
    renderStart(isBackgroundLayerPresent: boolean): void;
    renderStop(): void;
    deleteDrawElement(element: ICustomDraw): void;
    destroyElements(): void;
    setElementOnTop(element: ICustomDraw): void;
    setElementZIndex(element: ICustomDraw, z_index: number): void;
    sortElementsByZIndex(): void;
    setElementsGroupOnTop(elements: ICustomDraw[]): void;
    setElementsGroupByZIndex(elements: ICustomDraw[], z_index: number): void;
}


export class RenderController implements IRenderController {
    private canvas: HTMLCanvasElement = <any>0;
    private elementsPool: ICustomDraw[] = [];
    private animFrameIndex = -1;
    private context: CanvasRenderingContext2D = <any>0;
    private isBackgroundLayerPresent = false;

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }

    public setDrawElement(element: ICustomDraw): void {
        this.elementsPool.push(element);
        element.z_index = this.elementsPool.length - 1;
        this.sortElementsByZIndex();
    }

    public renderStart(isBackgroundLayerPresent: boolean): void {
        this.isBackgroundLayerPresent = isBackgroundLayerPresent;
        if (this.animFrameIndex === -1) {
            this.renderBegin();
        }
    }

    private renderBegin() {
        this.animFrameIndex = requestAnimationFrame(this.renderBegin.bind(this));
        if (!this.isBackgroundLayerPresent) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        for (let i = 0; i < this.elementsPool.length; i++) {
            this.elementsPool[i].renderFrame();
        }
    }

    public renderStop() {
        cancelAnimationFrame(this.animFrameIndex);
        this.animFrameIndex = -1;
    }

    public deleteDrawElement(elementForDelete: ICustomDraw): void {
        this.elementsPool = this.elementsPool.filter(element => {
            return element !== elementForDelete;
        });
    }

    public setElementOnTop(element: ICustomDraw) {
        const index = findElementOnArray(this.elementsPool, element);
        if (index === -1) {
            return;
        }
        element.z_index = this.elementsPool[this.elementsPool.length - 1].z_index + 1;
        this.sortElementsByZIndex();
    }

    public setElementZIndex(element: ICustomDraw, z_index: number): void {
        element.z_index = z_index;
        this.sortElementsByZIndex();
    }

    public setElementsGroupOnTop(elements: ICustomDraw[]): void {
        for (let i = 0; i < elements.length; i++) {
            const index = findElementOnArray(this.elementsPool, elements[i]);
            if (index === -1) {
                return;
            }
        }

        const zIndex = this.elementsPool[this.elementsPool.length - 1].z_index + 1;
        for (let i = 0; i < elements.length; i++) {
            elements[i].z_index = zIndex + i;
        }
        this.sortElementsByZIndex();
    }

    public setElementsGroupByZIndex(elements: ICustomDraw[], z_index: number): void {
        for (let i = 0; i < elements.length; i++) {
            const index = findElementOnArray(this.elementsPool, elements[i]);
            if (index === -1) {
                return;
            }
        }

        for (let i = 0; i < elements.length; i++) {
            elements[i].z_index = z_index;
        }
        this.sortElementsByZIndex();
    }

    public sortElementsByZIndex(): void {
        this.elementsPool.sort((a, b) => {
            if (a.z_index > b.z_index) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    public destroyElements(): void {
        this.renderStop();
        for (let i = 0; i < this.elementsPool.length; i++) {
            const element = this.elementsPool.pop();
            if (element) {
                element.destroy();
            }
        }
        this.elementsPool.length = 0;
    }
}
