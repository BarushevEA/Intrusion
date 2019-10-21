import {AbstractCustomDraw} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractCustomDraw";
import {AnimatedRectangleLightCyan} from "./AnimatedRectangleLightCyan";
import {AnimatedRectangleLightYellow} from "./AnimatedRectangleLightYellow";
import {AnimatedRectangleLightRed} from "./AnimatedRectangleLightRed";
import {AnimatedRectangleLightGreen} from "./AnimatedRectangleLightGreen";
import {AnimatedRectangleLightGray} from "./AnimatedRectangleLightGray";
import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";

export class CombinedRectangle extends AbstractCustomDraw {
    private readonly blue: AbstractFramedShape;
    private readonly yellow: AbstractFramedShape;
    private readonly red: AbstractFramedShape;
    private readonly green: AbstractFramedShape;
    private readonly gray: AbstractFramedShape;
    private readonly rectangles: AbstractFramedShape[] = [];
    private currentShape: AbstractFramedShape;
    private counter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 0, 0);
        this.rectangles.push(this.blue = <AbstractFramedShape>new AnimatedRectangleLightCyan(canvas));
        this.rectangles.push(this.yellow = <AbstractFramedShape>new AnimatedRectangleLightYellow(canvas));
        this.rectangles.push(this.red = <AbstractFramedShape>new AnimatedRectangleLightRed(canvas));
        this.rectangles.push(this.green = <AbstractFramedShape>new AnimatedRectangleLightGreen(canvas));
        this.rectangles.push(this.gray = <AbstractFramedShape>new AnimatedRectangleLightGray(canvas));
        this.setSize(this.gray.elementHeight, this.gray.elementWidth);
        this.currentShape = this.gray;
    }

    setBlue(): void {
        this.currentShape = this.blue;
    }

    setGray(): void {
        this.currentShape = this.gray;
    }

    setGreen(): void {
        this.currentShape = this.green;
    }

    setRed(): void {
        this.currentShape = this.red;
    }

    setYellow(): void {
        this.currentShape = this.yellow;
    }

    nextRectangle() {
        this.currentShape = this.rectangles[this.counter];
        this.currentShape.setShowedFrame(0);
        this.counter++;
        if (this.counter >= this.rectangles.length) {
            this.counter = 0;
        }
    }

    renderFrame(): void {
        this.currentShape.elementX = this.elementX;
        this.currentShape.elementY = this.elementY;
        this.currentShape.renderFrame();
    }
}
