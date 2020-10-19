import {ICallback, IListener, IObserver, IOrderedListener, ISubscriptionLike} from "./Types";
import {SubscriberLike} from "./Observable";

export class OrderedObservable<T> implements IObserver<T> {
    private _value: T;
    private listeners: IOrderedListener[] = [];
    private _isEnable: boolean = true;

    constructor(value: T) {
        this._value = value;
    }

    disable(): void {
        this._isEnable = false;
    }

    enable(): void {
        this._isEnable = false;
    }

    get isEnable(): boolean {
        return this._isEnable;
    }

    public next(value: T): void {
        if (!this._isEnable) {
            return;
        }
        this._value = value;
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i];
            if (listener.isEventStop) {
                return;
            }
            if (listener.isEventPause) {
                continue;
            }
            listener.callBack(value);
        }
    }

    private unSubscribe(listener: IOrderedListener): void {
        if (!this.listeners) {
            return;
        }
        const elIndex = this.listeners.indexOf(listener);
        listener.callBack = <any>0;
        listener.order = 0;
        if (elIndex > -1) {
            for (let i = elIndex + 1; i < this.listeners.length; i++) {
                this.listeners[i - 1] = this.listeners[i];
            }
            this.listeners.length = this.listeners.length - 1;
        }
    }

    public destroy(): void {
        this._value = <any>0;
        this.unsubscribeAll();
        this.listeners = <any>0;
    }

    public unsubscribeAll(): void {
        const length = this.listeners.length;
        for (let i = 0; i < length; i++) {
            const key = this.listeners.pop();
            this.unSubscribe(<IOrderedListener>key);
        }
    }

    public getValue(): T {
        return this._value;
    }

    public getNumberOfSubscribers(): number {
        return this.listeners.length;
    }

    public subscribe(listener: IListener): ISubscriptionLike {
        const savedListener: IOrderedListener = {
            callBack: <any>0,
            order: 0,
            isEventStop: false,
            isEventPause: false
        };

        if (!(<IOrderedListener>listener).callBack) {
            savedListener.callBack = <ICallback>listener;
        } else {
            savedListener.callBack = (<IOrderedListener>listener).callBack;
            savedListener.order = (<IOrderedListener>listener).order;
            savedListener.isEventStop = (<IOrderedListener>listener).isEventStop;
            savedListener.isEventPause = (<IOrderedListener>listener).isEventPause;
        }

        this.listeners.push(savedListener);

        this.listeners.sort((a, b) => {
            if (<any>a.order > <any>b.order) {
                return -1;
            }
            if (<any>a.order < <any>b.order) {
                return 1;
            }
            return 0;
        });

        return new SubscriberLike(this, savedListener);
    }
}
