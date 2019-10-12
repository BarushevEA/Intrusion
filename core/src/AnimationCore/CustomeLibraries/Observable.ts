export type ICallback = (value?: any) => void;

export type ISubscribe = {
    subscribe(callback: ICallback): ISubscriptionLike;
}

export type IUnSubscribe = {
    unSubscribe(index: number): void;
}

export type ISetObservableValue = {
    next(value: any): void;
}

export type IListeners = {
    [key: string]: ICallback;
}

export type ISubscriptionLike = {
    unsubscribe(): void;
};

class SubscriberLike implements ISubscriptionLike {
    private readonly observable: IUnSubscribe;
    private readonly index: number;

    constructor(callback: IUnSubscribe, index: number) {
        this.observable = callback;
        this.index = index;
    }

    public unsubscribe(): void {
        this.observable.unSubscribe(this.index);
    }
}

export type IObserver<T> = ISetObservableValue & ISubscribe & IUnSubscribe & {
    getValue(): T;
};

export class Observable<T> implements IObserver<T> {
    private _value: T;
    private listeners: IListeners = {};
    private indexCounter = -1;

    constructor(value: T) {
        this._value = value;
    }

    next(value: T): void {
        this._value = value;
        Object.keys(this.listeners).forEach(key => {
            if (this.listeners[key]) {
                this.listeners[key](this._value);
            }
        });
    }

    unSubscribe(index: number): void {
        if (this.listeners.hasOwnProperty(index)) {
            delete this.listeners[index];
        } else {
            console.warn(`Unsubscribe index ${index} is not valid`);
        }
    }

    getValue(): T {
        return this._value;
    }

    subscribe(callback: ICallback): ISubscriptionLike {
        this.indexCounter++;
        this.listeners[this.indexCounter] = callback;
        return new SubscriberLike(this, this.indexCounter);
    }
}
