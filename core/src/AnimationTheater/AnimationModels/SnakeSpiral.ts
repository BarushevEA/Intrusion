import {AbstractFramedShape} from "../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class SnakeSpiral extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 250, 380);
    }

    protected setFramesName(): void {
        this.setFramePoolName('SnakeSpiral');
    }

    protected initShape(): void {
        for (let k = 0; k < Math.PI * 2; k += 0.1) {
            let radius = 1;
            this.createFrame(1);
            for (let i = 0; i < Math.PI * 2 * 3; i += 0.1) {
                radius++;
                if (radius === 190) {
                    radius = 250;
                    this.shape.colors(
                        '#580954',
                        '#825000'
                    );
                } else {
                    this.shape.colors(
                        '#B49632',
                        '#825000'
                    );
                }
                this.shape
                    .lineWidth(2)
                    .circle(
                        Math.round(this.elementWidth / 2 + Math.cos(k) * Math.sin(i) * 10 * i),
                        Math.round(this.elementHeight / 2 + Math.sin(k) * Math.cos(i) * 5 * i),
                        Math.round(radius / 10));
                if (radius === 250) {
                    const x = Math.round(this.elementWidth / 2 + Math.cos(k) * Math.sin(i) * 10 * i);
                    const y = Math.round(this.elementHeight / 2 + Math.sin(k) * Math.cos(i) * 5 * i);
                    this.shape
                        .colors('#B49632', '#B49632')
                        .circle(x - 10, y - 5, Math.round(3))
                        .circle(x + 10, y - 5, Math.round(3))
                        .polygon([
                            {x: x - 10, y: y + 8},
                            {x: x - 8, y: y + 10},
                            {x: x - 3, y: y + 12},
                            {x: x + 3, y: y + 12},
                            {x: x + 8, y: y + 10},
                            {x: x + 10, y: y + 8}
                        ])
                }
            }
        }
    }
}
