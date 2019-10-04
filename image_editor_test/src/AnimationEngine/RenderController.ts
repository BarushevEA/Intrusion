import {ICustomDraw} from "./rootModels/AbstractCustomDraw";

export type IRenderController = {
    setCanvas(canvas: HTMLCanvasElement): void;
    setDrawElement(element: ICustomDraw): void;
    renderStart(): void;
    renderStop(): void;
    deleteDrawElement(name: string): void;
    destroyElements(): void;
}


class RenderController implements IRenderController {
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

    public deleteDrawElement(name: string): void {
        this.elementsPool = this.elementsPool.filter(element => {
            return element.name !== name;
        });
    }

    public destroyElements(): void {
        this.renderStop();
        for (let i = 0; i <  this.elementsPool.length; i++) {
            const element =  this.elementsPool.pop();
            if (element) {
                element.destroy();
            }
        }
        this.elementsPool.length = 0;
    }
}

export const renderController = new RenderController();
