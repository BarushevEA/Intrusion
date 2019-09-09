export interface IOptions {
    name: string;

    setChartDataPair(pair: IChartDataPair): void;

    getChartsCollection(): IChartDataPair[];
}

export interface IChartDataPair {
    canvasID: string;
    outerConnectorName: string;
}

export class Options implements IOptions {
    _chartsCollection: IChartDataPair[];
    name: string;

    constructor(name: string) {
        this.name = name;
        this._chartsCollection = [];
    }

    setChartDataPair(pair: IChartDataPair) {
        pair.outerConnectorName = `$${this.name.split(' ').join('')}${pair.outerConnectorName}`;
        this.validateChartDataPair(pair);
        this._chartsCollection.push(pair);
    }

    getChartsCollection(): IChartDataPair[] {
        return this._chartsCollection;
    }

    private validateChartDataPair(pair: IChartDataPair) {
        for (const pairInner of this._chartsCollection) {
            switch (true) {
                case pairInner.canvasID === pair.canvasID:
                    throw new Error('Duplicate canvasID');
                case pairInner.outerConnectorName === pair.outerConnectorName:
                    throw new Error('Duplicate outerConnectorName');
            }
        }
    }
}
