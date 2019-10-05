import {AbstractFramedShape} from "../AnimationEngine/rootModels/AbstractFramedShape";

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
            this.layerHandler.setFrame(500, 700, 1);
            for (let i = 0; i < Math.PI * 2 * 3; i += 0.1) {
                radius++;
                if (radius === 190) {
                    radius = 250;
                    this.layerHandler.setColors(
                        '#580954',
                        '#825000'
                    );
                } else {
                    this.layerHandler.setColors(
                        '#B49632',
                        '#825000'
                    );
                }
                this.layerHandler.setLineWidth(2);
                this.layerHandler.drawSimpleCircle(
                    Math.round(this.elementWidth / 2 + Math.cos(k) * Math.sin(i) * 10 * i),
                    Math.round(this.elementHeight / 2 + Math.sin(k) * Math.cos(i) * 5 * i),
                    Math.round(radius / 10));
                if (radius === 250) {
                    this.layerHandler.setColors('#B49632', '#B49632');
                    const x = Math.round(this.elementWidth / 2 + Math.cos(k) * Math.sin(i) * 10 * i);
                    const y = Math.round(this.elementHeight / 2 + Math.sin(k) * Math.cos(i) * 5 * i);
                    this.layerHandler.drawSimpleCircle(x - 10, y - 5, Math.round(3));
                    this.layerHandler.drawSimpleCircle(x + 10, y - 5, Math.round(3));
                    this.layerHandler.drawPolygon([
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
