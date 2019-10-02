import {AbstractCustomDraw} from "./AbstractCustomDraw";

export class SnakeSpiral extends AbstractCustomDraw {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.setFramePoolName('SnakeSpiral');
        this.init();
    }

    init() {
        if (this.framePool) {
            this.customScreen.setFramePool(this.framePool);
            return;
        }

        const height = 250;
        const width = 380;
        for (let k = 0; k < Math.PI * 2; k += 0.1) {
            let radius = 1;
            this.customScreen.setFrame(500, 700, 1);
            for (let i = 0; i < Math.PI * 2 * 3; i += 0.1) {
                radius++;
                if (radius === 190) {
                    radius = 250;
                    this.customScreen.setColors(
                        '#580954',
                        '#825000'
                    );
                } else {
                    this.customScreen.setColors(
                        '#B49632',
                        '#825000'
                    );
                }
                this.customScreen.setLineWidth(2);
                this.customScreen.drawSimpleCircle(
                    Math.round(width / 2 + Math.cos(k) * Math.sin(i) * 10 * i),
                    Math.round(height / 2 + Math.sin(k) * Math.cos(i) * 5 * i),
                    Math.round(radius / 10));
                if (radius === 250) {
                    this.customScreen.setColors('#B49632', '#B49632');
                    const x = Math.round(width / 2 + Math.cos(k) * Math.sin(i) * 10 * i);
                    const y = Math.round(height / 2 + Math.sin(k) * Math.cos(i) * 5 * i);
                    this.customScreen.drawSimpleCircle(x - 10, y - 5, Math.round(3));
                    this.customScreen.drawSimpleCircle(x + 10, y - 5, Math.round(3));
                    this.customScreen.drawPolygon([
                        {x: x - 10, y: y + 8},
                        {x: x - 8, y: y + 10},
                        {x: x - 3, y: y + 12},
                        {x: x + 3, y: y + 12},
                        {x: x + 8, y: y + 10},
                        {x: x + 10, y: y + 8}
                    ])
                }
            }
            this.customScreen.restoreCanvas();
        }
        this.framePool = this.customScreen.getFramePool();
    }

    renderFrame(): void {
        this.customScreen.drawFrame(
            Math.round(this.customCanvas.width / 2 - 190) + this.elementX,
            Math.round(10) + this.elementY);
    }

    setName(name: string): void {
        this.name = name;
    }
}
