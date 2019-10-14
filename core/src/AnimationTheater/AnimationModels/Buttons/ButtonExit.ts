import {AbstractButton} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractButton";

export class ButtonExit extends AbstractButton {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, '', 50, 50);
    }

    protected createFrameMouseClick(): void {
        this.drawClickRectangle();
        this.drawClickCross();
    }

    protected createFrameMouseOverFalse(): void {
        this.drawDarkRedRectangle();
        this.drawSmallCross();
    }

    protected createFrameMouseOverTrue(): void {
        this.drawRedRectangle();
        this.drawBigCross();
    }

    protected setFramesName(): void {
        this.setFramePoolName('ButtonExit');
    }

    private drawRedRectangle(): void {
        this.setColors('rgb(136,0,0)', 'rgba(0,0,0,0.5)');
        this.setLineWidth(5);
        this.drawRectangle(5, 5, 40, 40);
    }

    private drawClickRectangle(): void {
        this.setColors('rgb(75,19,3)', 'rgba(0,0,0,0.5)');
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
    };

    private drawClickCross(): void {
        this.isCustomStoke = true;
        this.setColors('', 'rgb(255,0,0)');
        this.setLineWidth(5);
        this.drawPolygon([{x: 15, y: 15}, {x: 35, y: 35}]);
        this.drawPolygon([{x: 15, y: 35}, {x: 35, y: 15}]);
        this.isCustomStoke = false;
    };
}
