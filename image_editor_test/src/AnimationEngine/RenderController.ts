import {ICustomDraw} from "./rootModels/AbstractCustomDraw";

class RenderController {
    private canvas: HTMLCanvasElement = <any>null;
    private mute = false;
    private elementsPool: ICustomDraw[] = [];
    private animFrameIndex = -1;

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    setDrawElement(element: ICustomDraw) {
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

    deleteDrawElement(name: string): void {
        this.elementsPool = this.elementsPool.filter(element => {
            return element.name !== name;
        });
    }
}

export const renderController = new RenderController();
