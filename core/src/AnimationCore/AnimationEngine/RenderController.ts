import {ICustomDraw} from "./rootModels/AbstractCustomDraw";
import {findElementOnArray} from "../CustomeLibraries/FunctionLibs";

export type IRenderController = {
    setCanvas(canvas: HTMLCanvasElement): void;
    setDrawElement(element: ICustomDraw): void;
    renderStart(): void;
    renderStop(): void;
    deleteDrawElement(element: ICustomDraw): void;
    destroyElements(): void;
}


export class RenderController implements IRenderController {
    private canvas: HTMLCanvasElement = <any>null;
    private mute = false;
    private elementsPool: ICustomDraw[] = [];
    private animFrameIndex = -1;

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
    }

    public setDrawElement(element: ICustomDraw): void {
        this.elementsPool.push(element);
    }

    public renderStart(): void {
        this.canvas.width = this.canvas.width;
        this.animFrameIndex = requestAnimationFrame(this.renderStart.bind(this));
        if (this.mute) {
            return;
        }
        this.mute = true;
        for (let i = 0; i < this.elementsPool.length; i++) {
            this.elementsPool[i].renderFrame();
        }
        this.mute = false;
    }

    public renderStop() {
        cancelAnimationFrame(this.animFrameIndex);
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
        for (let i = index; i < this.elementsPool.length-1; i++) {
            this.elementsPool[i] = this.elementsPool[i + 1];
        }
        this.elementsPool[this.elementsPool.length - 1] = element;
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
