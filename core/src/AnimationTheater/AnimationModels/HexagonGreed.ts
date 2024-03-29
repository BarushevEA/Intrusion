import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {IPolygon} from "../../AnimationCore/AnimationEngine/LayerHandler/shapeModules/ShapeHandler";
import {randomize} from "../../AnimationCore/Libraries/FunctionLibs";

const startDelta = 1000;

export class HexagonGreed extends AbstractActor {
    x = 0;
    y = 0;
    dx = 1;
    dy = 1;
    radius = 45;
    multiplier = 2;
    maxStep = 2;
    bound = Math.round(startDelta / 2);
    bottomLayerName = 'bottomLayer';
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height + startDelta * 1.2),
            Math.round(canvas.width + startDelta * 1.2));
        this.init();
        this.restoreDefaultLayer();
    }

    init(): void {
        const dx = 45;
        const dy = 75;

        const hexagon = [
            {x: 50, y: 0},
            {x: 95, y: 25},
            {x: 95, y: 75},
            {x: 50, y: 100},
            {x: 5, y: 75},
            {x: 5, y: 25},
        ];

        const centerLayerName = 'centerLayer';
        const topLayerName = 'topLayer';

        hexagon.forEach(element => {
            element.x *= this.multiplier;
            element.y *= this.multiplier;
        });

        let modDX = dx * 2 * this.multiplier;
        let modDY = dy * this.multiplier;
        let modRadius = this.radius * this.multiplier;

        this.setVirtualLayer(this.bottomLayerName);
        this.shape
            .lineWidth(11)
            .colors('rgb(30,30,30)', 'rgba(0,0,0,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.restoreDefaultLayer();

        this.setVirtualLayer(centerLayerName);
        this.shape
            .lineWidth(3)
            .colors('rgba(100,100,100,0)', 'rgba(255,255,255,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.restoreDefaultLayer();

        this.setVirtualLayer(topLayerName);
        this.shape
            .lineWidth(3)
            .colors('rgba(0,100,255,0)', 'rgba(0,0,0,0.5)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.restoreDefaultLayer();

        this.drawVirtualOnVirtual(this.bottomLayerName, centerLayerName, 3, 1);
        this.drawVirtualOnVirtual(this.bottomLayerName, topLayerName, 0, 0);

        this.deleteVirtual(centerLayerName);
        this.deleteVirtual(topLayerName);
    }

    private createVirtualGreed(modRadius: number, hexagon: IPolygon, modDX: number, modDY: number) {
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                let deltaX = 0;
                if (i % 2) {
                    deltaX = modRadius;
                }
                let modifiedHexagon: IPolygon = this.getModified(hexagon, j * modDX + deltaX, i * modDY);
                this.shape.polygon(modifiedHexagon);
            }
        }
    }

    renderFrame() {
        if (this.x <= 0) {
            this.dx = randomize(this.maxStep);
        }
        if (this.x >= this.bound) {
            this.dx = -1 * randomize(this.maxStep);
        }
        if (this.y <= 0) {
            this.dy = randomize(this.maxStep);
        }
        if (this.y >= this.bound) {
            this.dy = -1 * randomize(this.maxStep);
        }

        if (this.dx === 0 && this.dy === 0) {
            this.dx = 1 + randomize(this.maxStep);
            this.dy = 1 + randomize(this.maxStep);
        }

        if (!this.throttlingCounter) {
            this.throttlingCounter = 1 + randomize(500);
            this.dx = randomize(1) ? -randomize(this.maxStep) : randomize(this.maxStep);
            this.dy = randomize(1) ? -randomize(this.maxStep) : randomize(this.maxStep);
        }

        this.drawVirtualOnGeneral(
            this.bottomLayerName,
            +this.bound + this.x + this.radius * this.multiplier + this.xPos,
            +this.bound + this.y + this.radius * this.multiplier + this.yPos,
            this.generalLayer.width,
            this.generalLayer.height,
            0,
            0,
            this.generalLayer.width,
            this.generalLayer.height);
        this.x += this.dx;
        this.y += this.dy;
        this.throttlingCounter--;
    }

    getModified(hexagon: IPolygon, deltaX = 0, deltaY = 0): IPolygon {
        let modified: IPolygon = [];
        hexagon.forEach(node => {
            modified.push({x: node.x + deltaX, y: node.y + deltaY});
        });
        return modified;
    }
}
