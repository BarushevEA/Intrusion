import {CustomDraw} from "../CustomDraw";
import {IPolygon} from "../Screen";

export class Hexagon extends CustomDraw {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    renderFrame(): void {
        const startDelta = 1300;
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
        const bottomLayer = 'bottomLayer';
        const centerLayer = 'centerLayer';
        const topLayer = 'topLayer';

        hexagon.forEach(element => {
            element.x *= multiplier;
            element.y *= multiplier;
        });

        let modDX = dx * 2 * multiplier;
        let modDY = dy * multiplier;
        let modRadius = radius * multiplier;

        this.customScreen.setVirtualCanvas(bottomLayer, 2500, 3500);
        this.customScreen.setLineWidth(11);
        this.customScreen.setColors('rgb(15,15,50)', 'rgba(0,0,0,0.3)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.setVirtualCanvas(centerLayer, 2500, 3500);
        this.customScreen.setLineWidth(3);
        this.customScreen.setColors('rgba(100,100,100,0)', 'rgba(255,255,255,0.2)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.setVirtualCanvas(topLayer, 2500, 3500);
        this.customScreen.setLineWidth(3);
        this.customScreen.setColors('rgba(0,100,255,0)', 'rgba(0,0,0,0.5)');
        this.createVirtualGreed(modRadius, hexagon, modDX, modDY);
        this.customScreen.restoreCanvas();

        this.customScreen.drawVirtualOnVirtualCanvas(bottomLayer, centerLayer, 3, 1);
        this.customScreen.drawVirtualOnVirtualCanvas(bottomLayer, topLayer, 0, 0);

        this.customScreen.deleteVirtualCanvas(centerLayer);
        this.customScreen.deleteVirtualCanvas(topLayer);

        this.drawCanvases(bottomLayer, startDelta);
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

    drawCanvases(virtualCanvasName: string, startDelta: number) {
        let x = 0;
        let y = 0;
        let dx = 1;
        let dy = 1;
        let mute = false;
        const maxStep = 5;
        const bound = Math.round(startDelta / 2);

        const move = () => {
            requestAnimationFrame(move);
            if (mute) {
                console.log('muted');
                return;
            }
            mute = true;
            if (x <= 0) {
                dx = this.randomize(maxStep);
            }
            if (x >= bound) {
                dx = -1 * this.randomize(maxStep);
            }
            if (y <= 0) {
                dy = this.randomize(maxStep);
            }
            if (y >= bound) {
                dy = -1 * this.randomize(maxStep);
            }

            if (dx === 0 && dy === 0) {
                dx = 1 + this.randomize(maxStep);
                dy = 1 + this.randomize(maxStep);
            }

            this.customScreen.clear();
            this.customScreen.drawVirtualOnRealCanvas(virtualCanvasName, -startDelta + x, -startDelta + y);
            x += dx;
            y += dy;
            mute = false;
        };
        move();
    }

    getModified(hexagon: IPolygon, deltaX = 0, deltaY = 0): IPolygon {
        let modified: IPolygon = [];
        hexagon.forEach(node => {
            modified.push({x: node.x + deltaX, y: node.y + deltaY});
        });
        return modified;
    }
}
