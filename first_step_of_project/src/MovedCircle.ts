import {CustomDraw} from "./CustomDraw";

export class MovedCircle extends CustomDraw {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    start(): void {
        let x = 0;
        let y = 0;
        let dx = 1;
        let dy = 1;
        const radius = 50;
        const maxStep = 15;
        const radiusCalc = radius + 5;

        const move = () => {
            requestAnimationFrame(move);
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
        };
        move();
    }
}
