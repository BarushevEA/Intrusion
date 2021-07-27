import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {EventStore} from "../../../AnimationCore/Store/EventStore";

export class BrickWall extends AbstractFramedShape {
    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 100, 100);
    }

    protected setFramesName(): void {
        this.setFramePoolName('BrickWall');
    }

    protected initShape(): void {
        for (let i = 0; i < 80; i += 1) {
            this.createFrame(2);
            this.shape
                .colors(`rgba(${i},${i / 1.8},0,1)`, 'rgba(0,0,0,0)')
                .rectangle(0, 0, 100, 100);
            this.drawBrick(50, 0);
            this.drawBrick(-50, 0);
            this.drawBrick(0, 50);
        }
        for (let i = 80; i > 0; i -= 1) {
            this.createFrame(5);
            this.shape
                .colors(`rgba(${i},${i / 1.8},0,1)`, 'rgba(0,0,0,0)')
                .rectangle(0, 0, 100, 100);
            this.drawBrick(50, 0);
            this.drawBrick(-50, 0);
            this.drawBrick(0, 50);
        }
        for (let i = 0; i < 80; i += 1) {
            this.createFrame(2);
            this.shape
                .colors(`rgba(${i},0,${i / 1.8},1)`, 'rgba(0,0,0,0)')
                .rectangle(0, 0, 100, 100);
            this.drawBrick(50, 0);
            this.drawBrick(-50, 0);
            this.drawBrick(0, 50);
        }
        for (let i = 80; i > 0; i -= 1) {
            this.createFrame(5);
            this.shape
                .colors(`rgba(${i},0,${i / 1.8},1)`, 'rgba(0,0,0,0)')
                .rectangle(0, 0, 100, 100);
            this.drawBrick(50, 0);
            this.drawBrick(-50, 0);
            this.drawBrick(0, 50);
        }
        for (let i = 0; i < 80; i += 1) {
            this.createFrame(2);
            this.shape
                .colors(`rgba(0,${i},${i / 1.8},1)`, 'rgba(0,0,0,0)')
                .rectangle(0, 0, 100, 100);
            this.drawBrick(50, 0);
            this.drawBrick(-50, 0);
            this.drawBrick(0, 50);
        }
        for (let i = 80; i > 0; i -= 1) {
            this.createFrame(5);
            this.shape
                .colors(`rgba(0,${i},${i / 1.8},1)`, 'rgba(0,0,0,0)')
                .rectangle(0, 0, 100, 100);
            this.drawBrick(50, 0);
            this.drawBrick(-50, 0);
            this.drawBrick(0, 50);
        }
    }

    drawBrick(x: number, y: number) {
        this.shape
            .colors('rgba(84,84,84,0)', 'rgb(0,0,0)')
            .lineWidth(6)
            .rectangle(x, y, 100, 50)

            .linearGradient()
            .setGradientDirectionPoints(x + 0, y + 0, x + 100, y + 50)
            .addColorStop(0, 'rgba(0,0,0,0.3)')
            .addColorStop(0.5, 'rgba(0,0,0,0.5)')
            .addColorStop(1, 'rgba(0,0,0,0.3)')
            .stopExecution()

            .colors('', 'rgba(150,150,150,0.1)')
            .lineWidth(3)
            .line(x + 5, y + 5, x + 95, y + 5)
            .line(x + 5, y + 5, x + 5, y + 45)

            .colors('', 'rgba(55,55,55,0.1)')
            .lineWidth(3)
            .line(x + 95, y + 5, x + 95, y + 45)
            .line(x + 95, y + 45, x + 5, y + 45)

            .stopDrawing();
    }
}
