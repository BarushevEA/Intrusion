import {CustomDraw} from "../CustomDraw";
import {IPolygon} from "../Screen";

export class HexagonGreed extends CustomDraw {
    x = 0;
    y = 0;
    dx = 1;
    dy = 1;
    startDelta = 1300;
    maxStep = 5;
    bound = Math.round(this.startDelta / 2);
    bottomLayerName = 'bottomLayer';

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.init();
    }

    setName(name: string): void {
        this.name = name;
    }

    init(): void {
        const dx = 45;
        const dy = 75;
        const radius = 45;
        const multiplier = 2;
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
            element.x *= multiplier;
            element.y *= multiplier;
        });

        let modDX = dx * 2 * multiplier;
        let modDY = dy * multiplier;
        let modRadius = radius * multiplier;

        this.customScreen.setVirtualCanvas(this.bottomLayerName, 2500, 3500);
        this.customScreen.setLineWidth(11);
        this.customScreen.setColors('rgb(15,15,50)', 'rgba(0,0,0,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.setVirtualCanvas(centerLayerName, 2500, 3500);
        this.customScreen.setLineWidth(3);
        this.customScreen.setColors('rgba(100,100,100,0)', 'rgba(255,255,255,0.2)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.setVirtualCanvas(topLayerName, 2500, 3500);
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

        this.customScreen.drawVirtualOnRealCanvas(this.bottomLayerName, -this.startDelta + this.x, -this.startDelta + this.y);
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
