import {Screen} from "./Screen";

class Manager {
    private screen: Screen;

    constructor() {
        this.createCanvas();
        this.screen = new Screen('canvas');
    }

    private createCanvas():void {
        const canvas = document.createElement('canvas');
        const body = document.body;
        canvas.height = 600;
        canvas.width = 900;
        canvas.style.background = 'black';
        canvas.style.border = 'solid 5px midnightblue';
        canvas.style.borderRadius = '20px';
        canvas.id = 'canvas';
        body.appendChild(canvas);
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

        const move = () => {
            if (mute) {
                requestAnimationFrame(move);
                return;
            }
            mute = true;
            if (x <= 0) {
                dx = this.randomize();
            }
            if (x >= 900) {
                dx = -1 * this.randomize();
            }
            if (y <= 0) {
                dy = this.randomize();
            }
            if (y >= 600) {
                dy = -1 * this.randomize();
            }

            if (dx === 0 && dy === 0) {
                dx = 1 + this.randomize();
                dy = 1 + this.randomize();
            }

            this.screen.clear();
            this.screen.setColors('yellow', 'red');
            this.screen.drawSimpleCircle(x, y, 50);
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
