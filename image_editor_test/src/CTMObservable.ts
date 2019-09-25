export type ICallback = (value?: any) => void;

export type ISubscribe = {
    subscribe(callback: ICallback): number;
}

export type IUnSubscribe = {
    unSubscribe(index: number): void;
}

export type INotify = {
    next(value: any): void;
}

export type IListeners = {
    [key: string]: ICallback;
}

export type IObserver<T> = INotify & ISubscribe & IUnSubscribe & {
    getValue(): T;
};

export class CTMObservable<T> implements IObserver<T> {
    private _value: T;
    private listeners: IListeners = {};
    private indexCounter = -1;

    constructor(value: T) {
        this._value = value;
    }

    next(value: T): void {
        this._value = value;
        Object.keys(this.listeners).forEach(key => {
            this.listeners[key](this._value);
        });
    }

    unSubscribe(index: number): void {
        if (this.listeners.hasOwnProperty(index)) {
            delete this.listeners[index];
        } else {
            throw new Error(`Unsubscribe index ${index} is not valid`);
        }
    }

    getValue(): T {
        return this._value;
    }

    subscribe(callback: ICallback): number {
        this.indexCounter++;
        this.listeners[this.indexCounter] = callback;
        return this.indexCounter;
    }
}
