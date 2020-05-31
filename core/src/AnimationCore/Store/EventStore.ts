import {IMousePosition} from "../DomComponent/AppAnimation";
import {IKeyCode, ISize} from "./Types";
import {ObservableOrdered} from "../Libraries/Observables/ObservableOrdered";

export const mouseMovePosition$ = new ObservableOrdered(<IMousePosition>{x: 0, y: 0});
export const mouseClickPosition$ = new ObservableOrdered(<IMousePosition>{x: 0, y: 0});
export const mouseLeftDown$ = new ObservableOrdered(<IMousePosition>{x: 0, y: 0});
export const mouseLeftUp$ = new ObservableOrdered(<IMousePosition>{x: 0, y: 0});
export const mouseRightDown$ = new ObservableOrdered(<IMousePosition>{x: 0, y: 0});
export const mouseRightUp$ = new ObservableOrdered(<IMousePosition>{x: 0, y: 0});
export const defaultCursor$ = new ObservableOrdered(<boolean>true);
export const keyUpCode$ = new ObservableOrdered(<IKeyCode>{keyCode: 0, key: ''});
export const keyDownCode$ = new ObservableOrdered(<IKeyCode>{keyCode: 0, key: ''});
export const globalSize$ = new ObservableOrdered(<ISize>{height: 0, width: 0});
