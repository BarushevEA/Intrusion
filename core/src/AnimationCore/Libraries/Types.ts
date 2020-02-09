import {ISubscriptionLike, Observable} from "./Observable";

export type x_pos = number;
export type y_pos = number;
export type IDegrees = number;
export type IRadian = number;

export type delay_ms = number;
export type delay_second = number;
export type id_string = string;
export type cb_function = () => void;
export type ITickListener = {
    counter: number;
    delay: delay_ms;
    callback: cb_function;
    isDestroy: boolean;
}
export type ITickListeners = { [id: string]: ITickListener; }
export type ITick = {
    tick10$: Observable<any>;
    tick100$: Observable<any>;
    tick1000$: Observable<any>;
    executeTimeout(cb: cb_function, time: delay_ms): id_string;
    execute100MsInterval(cb: cb_function, time: number): ISubscriptionLike;
    executeSecondInterval(cb: cb_function, time: delay_second): ISubscriptionLike;
    clearTimeout(id: id_string): void;
    destroy(): void;
}
