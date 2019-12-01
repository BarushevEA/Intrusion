import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {IPoint} from "../../../AnimationCore/AnimationEngine/LayerHandler/ShapeHandler";
import {getCenterX, getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";

type IOrt = { x: number, y: number };

export class ShotLighting extends AbstractFramedShape {
    private first: IPoint[] = <any>0;
    private second: IPoint[] = <any>0;
    private middlePoint: IPoint = <any>0;
    private bgColor: string = '';
    private bdColor: string = '';

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('ShotLighting');
    }

    protected initShape(): void {
        this.middlePoint = {
            x: getCenterX(0, this.width),
            y: getCenterY(0, this.height)
        };
        this.initColors();
        this.initFirst();
        this.initSecond();
        this.normalizeToMiddle(this.first);
        this.normalizeToMiddle(this.second);
        this.drawFirst1();
    }

    drawFirst1() {
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: 1});
        this.drawStar(this.second, {x: 1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: 1});
        this.drawStar(this.second, {x: 1, y: -1});
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: 1});
        this.drawStar(this.second, {x: -1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: 1});
        this.drawStar(this.second, {x: -1, y: -1});

        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: 1});
        this.drawStar(this.second, {x: 1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: 1});
        this.drawStar(this.second, {x: 1, y: -1});
        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: 1});
        this.drawStar(this.second, {x: -1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: 1});
        this.drawStar(this.second, {x: -1, y: -1});

        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: -1});
        this.drawStar(this.second, {x: 1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: -1});
        this.drawStar(this.second, {x: 1, y: -1});
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: -1});
        this.drawStar(this.second, {x: -1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: 1, y: -1});
        this.drawStar(this.second, {x: -1, y: -1});

        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: -1});
        this.drawStar(this.second, {x: 1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: -1});
        this.drawStar(this.second, {x: 1, y: -1});
        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: -1});
        this.drawStar(this.second, {x: -1, y: 1});
        this.preparedFrame();
        this.drawStar(this.first, {x: -1, y: -1});
        this.drawStar(this.second, {x: -1, y: -1});
    }

    private preparedFrame() {
        // this.createEmptyFrame(0);
        this.createFrame(0);
    }

    drawStar(stArr: IPoint[], ort: IOrt) {
        this.shape
            .colors(this.bgColor, this.bdColor);
        const polygon = this.shape.advancedPolygon();
        polygon.startPoint(
            this.getCdr(stArr[0].x, ort.x, this.middlePoint.x),
            this.getCdr(stArr[0].y, ort.y, this.middlePoint.y)
        );
        for (let i = 1; i < stArr.length; i++) {
            const point = stArr[i];
            polygon.lineTo(
                this.getCdr(point.x, ort.x, this.middlePoint.x),
                this.getCdr(point.y, ort.y, this.middlePoint.y)
            );
        }
        polygon
            .stopExecution()
            .stopDrawing();
    }

    getCdr(normalize: number, ort: number, middle: number): number {
        return normalize * ort + middle;
    }

    initColors(): void {
        this.bgColor = 'rgba(27,143,195,0.2)';
        this.bdColor = 'rgba(32,187,255,0)';
    }

    initFirst(): void {
        this.first = [
            {x: 25, y: 50},
            {x: 45, y: 45},
            {x: 50, y: 0},
            {x: 55, y: 45},
            {x: 100, y: 50},
            {x: 55, y: 55},
            {x: 50, y: 80},
            {x: 45, y: 55}
        ];
    }

    initSecond(): void {
        this.second = [
            {x: 10, y: 5},
            {x: 50, y: 45},
            {x: 70, y: 35},
            {x: 55, y: 50},
            {x: 60, y: 60},
            {x: 50, y: 55},
            {x: 30, y: 70},
            {x: 45, y: 50}
        ];
    }

    normalizeToMiddle(el: IPoint[]): void {
        el.forEach(point => {
            point.x -= this.middlePoint.x;
            point.y -= this.middlePoint.y;
        });
    }
}
