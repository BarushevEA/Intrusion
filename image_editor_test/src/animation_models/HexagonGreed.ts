import {CustomDraw} from "../CustomDraw";
import {IPolygon} from "../Screen";

export class HexagonGreed extends CustomDraw {
    x = 0;
    y = 0;
    dx = 1;
    dy = 1;
    radius = 45;
    multiplier = 2;
    startDelta = 1000;
    maxStep = 5;
    bound = Math.round(this.startDelta / 2);
    bottomLayerName = 'bottomLayer';
    virtualLayerName = 'virtualLayer';
    height = 2000;
    width = 3000;
    throttlingCounter = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.init();
        this.customScreen.restoreCanvas();
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

        this.customScreen.setVirtualCanvas(this.bottomLayerName, this.height, this.width);
        this.customScreen.setLineWidth(11);
        this.customScreen.setColors('rgb(30,30,30)', 'rgba(0,0,0,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.setVirtualCanvas(centerLayerName, this.height, this.width);
        this.customScreen.setLineWidth(3);
        this.customScreen.setColors('rgba(100,100,100,0)', 'rgba(255,255,255,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.setVirtualCanvas(topLayerName, this.height, this.width);
        this.customScreen.setLineWidth(3);
        this.customScreen.setColors('rgba(0,100,255,0)', 'rgba(0,0,0,0.5)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.drawVirtualOnVirtualCanvas(this.bottomLayerName, centerLayerName, 3, 1);
        this.customScreen.drawVirtualOnVirtualCanvas(this.bottomLayerName, topLayerName, 0, 0);

        this.customScreen.deleteVirtualCanvas(centerLayerName);
        this.customScreen.deleteVirtualCanvas(topLayerName);
    }

    private createVirtualGreed(modRadius: number, hexagon: IPolygon, modDX: number, modDY: number) {
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                let deltaX = 0;
                if (i % 2) {
                    deltaX = modRadius;
                }
                let modifiedHexagon: IPolygon = this.getModified(hexagon, j * modDX + deltaX, i * modDY);
                this.customScreen.drawPolygon(modifiedHexagon);
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

        this.customScreen.drawVirtualOnRealCanvas(
            this.bottomLayerName,
            +this.bound + this.x + this.radius * this.multiplier,
            +this.bound + this.y + this.radius * this.multiplier,
            this.customCanvas.width,
            this.customCanvas.height,
            0,
            0,
            this.customCanvas.width,
            this.customCanvas.height);
        this.x += this.dx;
        this.y += this.dy;
    }

    getModified(hexagon: IPolygon, deltaX = 0, deltaY = 0): IPolygon {
        let modified: IPolygon = [];
        hexagon.forEach(node => {
            modified.push({x: node.x + deltaX, y: node.y + deltaY});
        });
        return modified;
    }
}
