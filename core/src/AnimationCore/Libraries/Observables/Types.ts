export type ICallback = (value?: any) => void;

export type ISubscribe = {
    subscribe(listener: IListener): ISubscriptionLike;
};

export type IListener = ICallback | IOrderedListener;

export type IDestroy = {
    destroy(): void;
};

export type ISetObservableValue = {
    next(value: any): void;
};

export type IListeners = IListener[]

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
    IDestroy &
    ISubscribeCounter &
    { unsubscribeAll(): void };

export type IOrderedListener = {
    callBack: ICallback;
    order?: number;
};
