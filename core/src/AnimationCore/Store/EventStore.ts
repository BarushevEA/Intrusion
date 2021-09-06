import {IKeyCode, ISize} from "./Types";
import {OrderedObservable} from "../Libraries/Observables/OrderedObservable";
import {Observable} from "../Libraries/Observables/Observable";
import {IMousePosition} from "./MouseStore";

export const mouseMovePosition$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
export const mouseClickPosition$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
export const mouseLeftDown$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
export const mouseLeftUp$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
export const mouseRightDown$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
export const mouseRightUp$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
export const defaultCursor$ = new Observable(<boolean>true);
export const keyUpCode$ = new Observable(<IKeyCode>{keyCode: 0, key: ''});
export const keyDownCode$ = new Observable(<IKeyCode>{keyCode: 0, key: ''});
export const globalSize$ = new Observable(<ISize>{height: 0, width: 0});
