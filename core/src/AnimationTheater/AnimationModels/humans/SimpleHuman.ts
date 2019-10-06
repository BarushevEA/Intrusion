import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class SimpleHuman extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 120, 60);
    }

    protected setFramesName(): void {
        this.setFramePoolName('SimpleHuman');
    }

    protected initShape(): void {
        this.createEmptyFrame();

        this.createFrame(0);
        this.setLineWidth(10);
        this.setColors(
            'rgba(0,200,0,0.3)',
            'rgba(100,100,0,1)');
        this.drawPolygon([
            {x: 30, y: 10},
            {x: 10, y: 110},
            {x: 50, y: 110},
        ]);


        this.setColors(
            'rgba(0,200,255,0.3)',
            'rgba(0,0,0,0.7)');

        this.drawSimpleCircle(30, 25, 15);
        this.drawPolygon([{x: 0, y: 45}, {x: 30, y: 60}]);
        this.drawPolygon([{x: 30, y: 60}, {x: 60, y: 45}]);
        this.drawPolygon([{x: 30, y: 40}, {x: 30, y: 75}]);
        this.drawPolygon([{x: 0, y: 110}, {x: 30, y: 75}]);
        this.drawPolygon([{x: 30, y: 75}, {x: 60, y: 110}]);

        this.setLastFrameToStop();
    }
}
