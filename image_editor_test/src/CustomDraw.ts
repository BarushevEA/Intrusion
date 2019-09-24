import {CustomScreen} from "./Screen";

export type ICustomDraw = {
    start(): void;
}

export class CustomDraw implements ICustomDraw{
    customCanvas: HTMLCanvasElement;
    customScreen: CustomScreen;

    constructor(canvas: HTMLCanvasElement) {
        this.customCanvas = canvas;
        this.customScreen = new CustomScreen(this.customCanvas);
    }

    public start() {
        this.customDraw();
    }

    private customDraw(): void {
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

    private randomize(): number {
        return Math.round(Math.random() * 15)
    }
}
