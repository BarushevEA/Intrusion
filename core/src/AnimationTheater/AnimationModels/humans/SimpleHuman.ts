import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class SimpleHuman extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 120, 60);
    }

    protected setFramesName(): void {
        this.setFramePoolName('SimpleHuman');
    }

    protected initShape(): void {

        this.createFrame(10);
        this.shape
            .setLineWidth(10)
            .setColors('rgba(0,200,255,0.3)', 'rgba(0,0,0,0.7)')
            .drawSimpleCircle(30, 25, 15)
            .drawPolygon([{x: 0, y: 45}, {x: 30, y: 60}])
            .drawPolygon([{x: 30, y: 60}, {x: 60, y: 45}])
            .drawPolygon([{x: 30, y: 40}, {x: 30, y: 75}])
            .drawPolygon([{x: 0, y: 110}, {x: 30, y: 75}])
            .drawPolygon([{x: 30, y: 75}, {x: 60, y: 110}]);

        this.createFrame(10);
        this.shape
            .setLineWidth(10)
            .setColors('rgba(0,200,255,0.3)', 'rgba(0,0,0,0.7)')
            .drawSimpleCircle(30, 25, 15)
            .drawPolygon([{x: 0, y: 45}, {x: 30, y: 60}])
            .drawPolygon([{x: 30, y: 60}, {x: 60, y: 55}])
            .drawPolygon([{x: 30, y: 40}, {x: 30, y: 75}])
            .drawPolygon([{x: 0, y: 110}, {x: 30, y: 75}])
            .drawPolygon([{x: 30, y: 75}, {x: 60, y: 110}]);
    }
}
