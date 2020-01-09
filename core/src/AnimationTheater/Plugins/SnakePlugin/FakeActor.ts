export class FakeActor {
    private _xPos = 0;
    private _yPos = 0;
    private _xPosPreview = 0;
    private _yPosPreview = 0;
    public isDestroyed = true;

    get xPos(): number {
        return this._xPos;
    }

    set xPos(value: number) {
        this._xPosPreview = this._xPos;
        this._xPos = value;
    }

    get yPos(): number {
        return this._yPos;
    }

    set yPos(value: number) {
        this._yPosPreview = this._yPos;
        this._yPos = value;
    }

    get xPosPreview(): number {
        return this._xPosPreview;
    }

    get yPosPreview(): number {
        return this._yPosPreview;
    }

    destroy() {

    }
}
