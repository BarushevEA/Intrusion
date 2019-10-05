import {AbstractCustomDraw} from "../AnimationEngine/rootModels/AbstractCustomDraw";
import {IPolygon} from "../AnimationEngine/LayerHandler";

const startDelta = 1000;

export class HexagonGreed extends AbstractCustomDraw {
    x = 0;
    y = 0;
    dx = 1;
    dy = 1;
    radius = 45;
    multiplier = 2;
    maxStep = 2;
    bound = Math.round(startDelta / 2);
    bottomLayerName = 'bottomLayer';
    virtualLayerName = 'virtualLayer';
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            Math.round(canvas.height + startDelta * 1.2),
            Math.round(canvas.width + startDelta * 1.2));
        this.init();
        this.layerHandler.restoreLayer();
    }

    setName(name: string): void {
        this.name = name;
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
        this.layerHandler.setLineWidth(11);
        this.layerHandler.setColors('rgb(30,30,30)', 'rgba(0,0,0,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.layerHandler.restoreLayer();

        this.setVirtualLayer(centerLayerName);
        this.layerHandler.setLineWidth(3);
        this.layerHandler.setColors('rgba(100,100,100,0)', 'rgba(255,255,255,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.layerHandler.restoreLayer();

        this.setVirtualLayer(topLayerName);
        this.layerHandler.setLineWidth(3);
        this.layerHandler.setColors('rgba(0,100,255,0)', 'rgba(0,0,0,0.5)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.layerHandler.restoreLayer();

        this.layerHandler.drawVirtualOnVirtual(this.bottomLayerName, centerLayerName, 3, 1);
        this.layerHandler.drawVirtualOnVirtual(this.bottomLayerName, topLayerName, 0, 0);

        this.layerHandler.deleteVirtual(centerLayerName);
        this.layerHandler.deleteVirtual(topLayerName);
    }

    private createVirtualGreed(modRadius: number, hexagon: IPolygon, modDX: number, modDY: number) {
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                let deltaX = 0;
                if (i % 2) {
                    deltaX = modRadius;
                }
                let modifiedHexagon: IPolygon = this.getModified(hexagon, j * modDX + deltaX, i * modDY);
                this.layerHandler.drawPolygon(modifiedHexagon);
            }
        }
    }

    renderFrame() {
        if (this.x <= 0) {
            this.dx = this.randomize(this.maxStep);
        }
        if (this.x >= this.bound) {
            this.dx = -1 * this.randomize(this.maxStep);
        }
        if (this.y <= 0) {
            this.dy = this.randomize(this.maxStep);
        }
        if (this.y >= this.bound) {
            this.dy = -1 * this.randomize(this.maxStep);
        }

        if (this.dx === 0 && this.dy === 0) {
            this.dx = 1 + this.randomize(this.maxStep);
            this.dy = 1 + this.randomize(this.maxStep);
        }

        if (!this.throttlingCounter) {
            this.throttlingCounter = 1 + this.randomize(500);
            this.dx = this.randomize(1) ? -this.randomize(this.maxStep) : this.randomize(this.maxStep);
            this.dy = this.randomize(1) ? -this.randomize(this.maxStep) : this.randomize(this.maxStep);
        }

        this.layerHandler.drawVirtualOnGeneral(
            this.bottomLayerName,
            +this.bound + this.x + this.radius * this.multiplier + this.elementX,
            +this.bound + this.y + this.radius * this.multiplier + this.elementY,
            this.customCanvas.width,
            this.customCanvas.height,
            0,
            0,
            this.customCanvas.width,
            this.customCanvas.height);
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
