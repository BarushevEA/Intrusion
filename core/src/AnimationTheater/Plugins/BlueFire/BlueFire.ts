import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {IPoint} from "../../../AnimationCore/AnimationEngine/LayerHandler/shapeModules/ShapeHandler";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class BlueFire extends AbstractFramedShape {
    private points: IPoint[] = <any>0;
    private maxRadius = 0;

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 50, 150);
    }

    protected setFramesName(): void {
        this.setFramePoolName('BlueFire');
    }

    protected initShape(): void {
        this.initVariables();
        this.createFire();
    }

    private initVariables() {
        this.points = [];
        this.maxRadius = 25;
    }

    private createFire() {
        this.points.push({x: this.width - this.maxRadius, y: getCenterY(0, this.height)});
        for (let i = 1; i < 8; i++) {
            const point: IPoint = {x: this.points[0].x - i * 10, y: this.points[0].y};
            this.points.push(point);
        }
        for (let j = 0; j < 10; j++) {
            this.createFrame(0);
            for (let i = 0; i < this.points.length; i++) {
                const x = this.points[i].x - j;
                const y = this.points[i].y;
                this.drawHighlight(x, y, i);
            }
            for (let i = 0; i < this.points.length; i++) {
                const y = this.points[i].y;
                this.drawCircle(j, y, i);
            }
        }
    }

    private drawHighlight(x: number, y: number, i: number) {
        this.shape
            .colors('rgba(0,0,0,0)', 'rgba(0,0,0,0)')
            .lineWidth(0)
            .radialGradient()
            .setGradientDirectionPoints(
                x, y, 0,
                x, y, this.maxRadius - i * 2)
            .addColorStop(0, 'rgba(37,80,195,0.3)')
            .addColorStop(1, 'rgba(0,0,0,0)')
            .stopExecution()
            .rectangle(0, 0, this.width, this.height)
            .stopDrawing();
    }

    private drawCircle(j: number, y: number, i: number) {
        this.shape
            .colors('rgba(255,21,21,0.1)', 'rgba(255,21,21,0.1)')
            .circle(this.points[0].x - i * j, y, Math.round(this.maxRadius / (i + 3)));
    }
}
