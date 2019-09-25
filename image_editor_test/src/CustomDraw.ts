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

    public randomize(num: number): number {
        return Math.round(Math.random() * num)
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
        const maxStep = 15;
        const radiusCalc = radius + 5;

        const move = () => {
            requestAnimationFrame(move);
            if (mute) {
                console.log('muted');
                return;
            }
            mute = true;
            if (x <= radiusCalc) {
                dx = this.randomize(maxStep);
            }
            if (x >= this.customCanvas.width - radiusCalc) {
                dx = -1 * this.randomize(maxStep);
            }
            if (y <= radiusCalc) {
                dy = this.randomize(maxStep);
            }
            if (y >= this.customCanvas.height - radiusCalc) {
                dy = -1 * this.randomize(maxStep);
            }

            if (dx === 0 && dy === 0) {
                dx = 1 + this.randomize(maxStep);
                dy = 1 + this.randomize(maxStep);
            }

            this.customScreen.clear();
            this.customScreen.setColors('yellow', 'red');
            this.customScreen.drawSimpleCircle(x, y, radius);
            x += dx;
            y += dy;
            mute = false;
        };
        move();
    }
}
