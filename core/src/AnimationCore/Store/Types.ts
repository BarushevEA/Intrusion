import {Observable} from "../Libraries/Observable";

export type  IKeyNumber = number;
export type  IKeyLabel = string;
export type  IKey = string;
export type  IKeyCode = {
    keyCode: IKeyNumber;
    code: IKeyLabel;
    key: IKey;
};
export type ISize = {
    height: number;
    width: number;
};
export type ITick = {
    tick100$: Observable<any>;
    tick1000$: Observable<any>;
    destroy(): void;
}
