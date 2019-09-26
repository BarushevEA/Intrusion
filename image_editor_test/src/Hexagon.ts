import {CustomDraw} from "./CustomDraw";
import {IPolygon} from "./Screen";

export class Hexagon extends CustomDraw {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    start(): void {
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

        hexagon.forEach(element => {
            element.x *= multiplier;
            element.y *= multiplier;
        });

        let modDX = dx * 2 * multiplier;
        let modDY = dy * multiplier;
        let modRadius = radius * multiplier;


        this.customScreen.setLineWidth(10);
        this.customScreen.setColors('rgba(0,0,255,0.2)', 'rgba(0,0,255,0.5)');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let deltaX = 0;
                if (i % 2) {
                    deltaX = modRadius;
                }
                let modifiedHexagon: IPolygon = this.getModified(hexagon, j * modDX + deltaX, i * modDY);
                this.customScreen.drawPolygon(modifiedHexagon);
            }
        }
    }

    getModified(hexagon: IPolygon, deltaX = 0, deltaY = 0): IPolygon {
        let modified: IPolygon = [];
        hexagon.forEach(node => {
            modified.push({x: node.x + deltaX, y: node.y + deltaY});
        });
        return modified;
    }
}
