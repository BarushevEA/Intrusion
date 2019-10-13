import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class ButtonExit extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 50, 50);
        this.collect(
            this.isMouseOver$.subscribe(isOver => {
                if (isOver) {
                    this.setFirstFrame();
                } else {
                    this.setSecondFrame();
                }
            })
        );
    }

    protected setFramesName(): void {
        this.setFramePoolName('ButtonExit');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.drawRedRectangle();
        this.drawBigCross();

        this.createFrame(0);
        this.drawDarkRedRectangle();
        this.drawSmallCross();

        this.setSecondFrame();
    }

    private drawRedRectangle(): void {
        this.setColors('rgb(136,0,0)', 'rgba(0,0,0,0.5)');
        this.setLineWidth(5);
        this.drawRectangle(5, 5, 40, 40);
    }

    private drawDarkRedRectangle(): void {
        this.setColors('rgb(95,0,0)', 'rgba(0,0,0,0.8)');
        this.setLineWidth(5);
        this.drawRectangle(5, 5, 40, 40);
    }

    private drawBigCross(): void {
        this.isCustomStoke = true;
        this.setColors('', 'rgb(200,200,200)');
        this.setLineWidth(5);
        this.drawPolygon([{x: 14, y: 14}, {x: 36, y: 36}]);
        this.drawPolygon([{x: 14, y: 36}, {x: 36, y: 14}]);
        this.isCustomStoke = false;
    }

    private drawSmallCross(): void {
        this.isCustomStoke = true;
        this.setColors('', 'rgb(157,157,157)');
        this.setLineWidth(5);
        this.drawPolygon([{x: 15, y: 15}, {x: 35, y: 35}]);
        this.drawPolygon([{x: 15, y: 35}, {x: 35, y: 15}]);
        this.isCustomStoke = false;
    }

    public setFirstFrame() {
        this.setShowedFrame(0);
        this.setStopFrame(0);
    }

    public setSecondFrame() {
        this.setShowedFrame(1);
        this.setStopFrame(1);
    }
}
