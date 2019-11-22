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
    ISubscribeCounter;

class SubscriberLike implements ISubscriptionLike {
    private readonly observable: IUnSubscribe;
    private readonly index: string;

    constructor(callback: IUnSubscribe, index: string) {
        this.observable = callback;
        this.index = index;
    }

    public unsubscribe(): void {
        this.observable.unSubscribe(this.index);
    }
}

export class Observable<T> implements IObserver<T> {
    private _value: T;
    private listeners: IListeners = {};
    private indexCounter = -1;
    private indexFlexible = 'abcdefghijklmnopqrstuvwxyz$_!@#$%^&*()-=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private flexibleCounter = 0;
    private keys: string[] = <any>0;

    constructor(value: T) {
        this._value = value;
    }

    next(value: T): void {
        this._value = value;
        for (let i = 0; i < this.keys.length; i++) {
            this.listeners[this.keys[i]](value);
        }
    }

    unSubscribe(index: string): void {
        if (this.listeners.hasOwnProperty(index)) {
            delete this.listeners[index];
            this.keys = Object.keys(this.listeners);
        }
    }

    destroy(): void {
        this._value = <any>0;
        const length = this.keys.length;
        for (let i = 0; i < length; i++) {
            const key = this.keys[i];
            this.unSubscribe(key);
        }
        this.keys = <any>0;
        this.listeners = <any>0;
        this.indexCounter = <any>0;
        this.indexFlexible = <any>0;
        this.flexibleCounter = <any>0;
    }

    getValue(): T {
        return this._value;
    }

    getNumberOfSubscribers(): number {
        return this.keys.length;
    }

    subscribe(callback: ICallback): ISubscriptionLike {
        this.indexCounter++;
        let index = this.indexFlexible[this.flexibleCounter];
        if (this.indexCounter >= Number.MAX_SAFE_INTEGER - 1) {
            this.indexCounter = 0;
            this.flexibleCounter++;
        }
        index += this.indexCounter;
        this.listeners[index] = callback;
        this.keys = Object.keys(this.listeners);
        return new SubscriberLike(this, index);
    }
}
