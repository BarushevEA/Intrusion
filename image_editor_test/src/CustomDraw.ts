import {CustomScreen} from "./Screen";

export type ICustomDraw = {
    start(): void;
}

export abstract class CustomDraw implements ICustomDraw {
    protected customCanvas: HTMLCanvasElement;
    protected customScreen: CustomScreen;

    protected constructor(canvas: HTMLCanvasElement) {
        this.customCanvas = canvas;
        this.customScreen = new CustomScreen(this.customCanvas);
    }

    public abstract start(): void;

    public randomize(): number {
        return Math.round(Math.random() * 15)
    }
}

export class MovedCircle extends CustomDraw {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    start(): void {
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
            if (x >= this.customCanvas.width - radiusCalc) {
                dx = -1 * this.randomize();
            }
            if (y <= radiusCalc) {
                dy = this.randomize();
            }
            if (y >= this.customCanvas.height - radiusCalc) {
                dy = -1 * this.randomize();
            }

            if (dx === 0 && dy === 0) {
                dx = 1 + this.randomize();
                dy = 1 + this.randomize();
            }

            this.customScreen.clear();
            this.customScreen.setColors('yellow', 'red');
            this.customScreen.drawSimpleCircle(x, y, radius);
            x += dx;
            y += dy;
            mute = false;
            requestAnimationFrame(move);
        };
        move();
    }
}
