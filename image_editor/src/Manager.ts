import {Screen} from "./Screen";
import {cssManager, ICustomClass} from "./ClassManager";

const cssPool: { [key: string]: ICustomClass } = {};

class Manager {
    private readonly canvas: HTMLCanvasElement;
    private container: HTMLElement | null;
    private screen: Screen;

    constructor() {
        Manager.initClasses();
        this.container = document.getElementById('custom_animation');
        if (!this.container) {
            this.createCustomContainer();
        }
        this.canvas = this.getCanvas();
        this.screen = new Screen(this.canvas);
        this.fillContainer()
    }

    private createCustomContainer(): void {
        const customContainer = document.createElement('div');
        const customCanvasContainer = document.createElement('div');
        customContainer.appendChild(customCanvasContainer);
        cssManager.addClassToElement(customContainer, cssPool.customContainer);
        cssManager.addClassToElement(customCanvasContainer, cssPool.customCanvasContainer);
        this.container = customCanvasContainer;
        document.body.appendChild(customContainer);
    }

    private static initClasses(): void {
        cssPool.canvas = {
            className: 'custom-canvas',
            rule: {}
        };
        cssPool.customContainer = {
            className: 'custom-container',
            rule: {
                zIndex: '-1000',
                position: 'fixed',
                padding: '0',
                margin: '0',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        };
        cssPool.customCanvasContainer = {
            className: 'custom-canvas-container',
            rule: {
                padding: '0',
                margin: '0',
                height: '90%',
                width: '90%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        };
        cssManager.addClassToSheet(cssPool.canvas);
        cssManager.addClassToSheet(cssPool.customContainer);
        cssManager.addClassToSheet(cssPool.customCanvasContainer);
    }

    private fillContainer(): void {
        if (this.container) {
            this.container.appendChild(this.canvas);
        }
    }

    private getCanvas(): HTMLCanvasElement {
        if (!this.container) {
            throw new Error(`HTMLElement: ${this.container}`);
        }
        const canvas = document.createElement('canvas');
        canvas.height = this.container.offsetHeight;
        canvas.width = this.container.offsetWidth;
        cssManager.addClassToElement(canvas, cssPool.canvas);
        return canvas;
    }

    public start(): void {
        this.draw();
    }

    public draw() {
        let x = 0;
        let y = 0;
        let dx = 1;
        let dy = 1;
        let mute = false;
        const radius = 50;
        const radiusCalc = radius + 5;

        const move = () => {
            if (mute) {
                requestAnimationFrame(move);
                return;
            }
            mute = true;
            if (x <= radiusCalc) {
                dx = this.randomize();
            }
            if (x >= this.canvas.width - radiusCalc) {
                dx = -1 * this.randomize();
            }
            if (y <= radiusCalc) {
                dy = this.randomize();
            }
            if (y >= this.canvas.height - radiusCalc) {
                dy = -1 * this.randomize();
            }

            if (dx === 0 && dy === 0) {
                dx = 1 + this.randomize();
                dy = 1 + this.randomize();
            }

            this.screen.clear();
            this.screen.setColors('yellow', 'red');
            this.screen.drawSimpleCircle(x, y, radius);
            x += dx;
            y += dy;
            // console.log(x, y);
            mute = false;
            requestAnimationFrame(move);
        };
        move();
    }

    private randomize(): number {
        return Math.round(Math.random() * 15)
    }
}

const manager = new Manager();
manager.start();
