import {ICustomDraw} from "./CustomDraw";

class RenderController {
    private canvas: HTMLCanvasElement = <any>null;
    private mute = false;
    private elementsPool: ICustomDraw[] = [];

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    setDrawElement(element: ICustomDraw) {
        this.elementsPool.push(element);
    }

    public render(): void {
        this.canvas.width = this.canvas.width;
        requestAnimationFrame(this.render.bind(this));
        if (this.mute) {
            return;
        }
        this.mute = true;
        for (let i = 0; i < this.elementsPool.length; i++) {
            this.elementsPool[i].renderFrame();
        }
        this.mute = false;
    }

    deleteDrawElement(name: string): void {
        this.elementsPool = this.elementsPool.filter(element => {
            return element.name !== name;
        });
    }
}

export const renderController = new RenderController();
