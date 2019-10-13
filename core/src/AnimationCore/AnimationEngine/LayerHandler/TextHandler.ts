export type ITextHandler = {
    context: CanvasRenderingContext2D;
    fontSize: string;
    fontFamily: string;
    options: ITextOptions;
    fillText(text: string): void;
    strokeText(text: string): void;
    setToDefault(): void;
}

export enum EAlign {
    start = 'start',
    end = 'end',
    left = 'left',
    right = 'right',
    center = 'center',
}

export enum EBaseline {
    top = 'top',
    hanging = 'hanging',
    middle = 'middle',
    alphabetic = 'alphabetic',
    ideographic = 'ideographic',
    bottom = 'bottom'
}

export enum EDirection {
    ltr = 'ltr',
    rtl = 'rtl',
    inherit = 'inherit'
}

export type ITextOptions = {
    textAlign?: EAlign;
    textBaseline?: EBaseline;
    direction?: EDirection;
    maxWidth?: number;
}

class TextHandler implements ITextHandler {
    private _context: CanvasRenderingContext2D = <any>0;
    private _fontSize = '10px';
    private _fontFamily = 'sans-serif';
    private _options: ITextOptions = <any>0;
    private _defaultOptions: ITextOptions = {
        textAlign: EAlign.start,
        textBaseline: EBaseline.alphabetic,
        direction: EDirection.inherit,
        maxWidth: 0,
    };
    public x: number = 0;
    public y: number = 0;

    constructor() {
        this.setToDefault();
    }

    public setToDefault(): void {
        this._options = {...this._defaultOptions};
        this._context.font = '10px sans-serif';
        this.setOptions();
    }

    set options(value: ITextOptions) {
        this._options = value;
    }

    set context(value: CanvasRenderingContext2D) {
        this._context = value;
    }

    set fontSize(value: string) {
        this._fontSize = value;
    }

    set fontFamily(value: string) {
        this._fontFamily = value;
    }

    private setFont(): void {
        this._context.font = `${this._fontSize} ${this._fontFamily}`;
    }

    private setOptions(): void {
        if (!!this._options.direction) {
            this._context.direction = <CanvasDirection>this._options.direction;
        }
        if (!!this._options.textAlign) {
            this._context.textAlign = <CanvasTextAlign>this._options.textAlign;
        }
        if (!!this._options.textBaseline) {
            this._context.textBaseline = <CanvasTextBaseline>this._options.textBaseline;
        }
    }

    public fillText(text: string): void {
        this.setFont();
        this.setOptions();
        if (!!this._options.maxWidth) {
            this._context.fillText(text, this.x, this.y, this._options.maxWidth);
        } else {
            this._context.fillText(text, this.x, this.y);
        }
    };

    public strokeText(text: string): void {
        this.setFont();
        this.setOptions();
        if (!!this._options.maxWidth) {
            this._context.strokeText(text, this.x, this.y, this._options.maxWidth);
        } else {
            this._context.strokeText(text, this.x, this.y);
        }
    };
}

export const textHandler = new TextHandler();
