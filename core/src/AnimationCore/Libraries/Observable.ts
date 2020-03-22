export type ICallback = (value?: any) => void;

export type ISubscribe = {
    subscribe(callback: ICallback): ISubscriptionLike;
}

export type IUnSubscribe = {
    unSubscribe(index: string): void;
    destroy(): void;
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

export type ISubscribeCounter = {
    getNumberOfSubscribers(): number;
};

export type ISubscriber<T> =
    { getValue(): T; } &
    ISubscribe;

export type IObserver<T> =
    ISetObservableValue &
    ISubscriber<T> &
    IUnSubscribe &
    ISubscribeCounter &
    { unsubscribeAll(): void };

class SubscriberLike implements ISubscriptionLike {
    private observable: IUnSubscribe;
    private index: string;

    constructor(observable: IUnSubscribe, index: string) {
        this.observable = observable;
        this.index = index;
    }

    public unsubscribe(): void {
        if (!!this.observable) {
            this.observable.unSubscribe(this.index);
            this.observable = <any>0;
            this.index = <any>0;
        }
    }
}

export class Observable<T> implements IObserver<T> {
    private static readonly indexFlexible = 'abcdefghijklmnopqrstuvwxyz$_!@#$%^&*()-=ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    private _value: T;
    private listeners: IListeners = {};
    private indexCounter = -1;
    private flexibleCounter = 0;
    private keys: string[] = <any>0;

    constructor(value: T) {
        this._value = value;
        this.keys = [];
    }

    public next(value: T): void {
        this._value = value;
        for (let i = 0; i < this.keys.length; i++) {
            this.listeners[this.keys[i]](value);
        }
    }

    public unSubscribe(index: string): void {
        if (!!this.listeners[index]) {
            delete this.listeners[index];
            const elIndex = this.keys.indexOf(index);
            for (let i = elIndex + 1; i < this.keys.length; i++) {
                const key = this.keys[i];
                this.keys[i - 1] = key;
            }
            this.keys.length = this.keys.length - 1;
        }
    }

    public destroy(): void {
        this._value = <any>0;
        this.unsubscribeAll();
        this.keys = <any>0;
        this.listeners = <any>0;
        this.indexCounter = <any>0;
        this.flexibleCounter = <any>0;
    }

    public unsubscribeAll(): void {
        const length = this.keys.length;
        for (let i = 0; i < length; i++) {
            const key = this.keys[i];
            this.unSubscribe(key);
        }
    }

    public getValue(): T {
        return this._value;
    }

    public getNumberOfSubscribers(): number {
        return this.keys.length;
    }

    public subscribe(callback: ICallback): ISubscriptionLike {
        this.indexCounter++;
        let index = Observable.indexFlexible[this.flexibleCounter];
        if (this.indexCounter >= Number.MAX_SAFE_INTEGER - 1) {
            this.indexCounter = 0;
            this.flexibleCounter++;
        }
        index += this.indexCounter;
        this.listeners[index] = callback;
        this.keys.push(index);
        return new SubscriberLike(this, index);
    }
}
