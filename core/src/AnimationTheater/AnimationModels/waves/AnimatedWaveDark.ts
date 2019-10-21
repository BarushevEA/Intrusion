import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IPoint} from "../../../AnimationCore/AnimationEngine/LayerHandler/ShapeHandler";

export class AnimatedWaveDark extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 130, 1300);
    }

    protected setFramesName(): void {
        this.setFramePoolName('AnimatedWaveDark');
    }

    protected initShape(): void {
        let points: IPoint[] = [];
        for (let i = 0; i < Math.PI * 8; i += 0.1) {
            const point: IPoint = {x: Math.trunc(i * 80) - 100, y: Math.trunc(Math.sin(i) * 50) + 120};
            points.push(point);
        }

        for (let i = 0; i < Math.trunc(points.length / 4); i++) {
            this.createFrame(2);
            this.shape
                .setCustomStroke(true)
                .setColors('', 'rgba(0,71,95,0.9)')
                .setLineWidth(130)
                .drawPolygon(points)
                .setCustomStroke(false);

            const y0 = points[0].y;
            for (let j = 0; j < points.length - 1; j++) {
                points[j].y = points[j + 1].y;
            }
            points[points.length - 1].y = y0;
        }
    }
}
