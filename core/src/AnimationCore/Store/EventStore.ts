import {Observable} from "../Libraries/Observable";
import {IMousePosition} from "../DomComponent/AppAnimation";
import {IKeyCode, ISize} from "./Types";

export const mouseMovePosition$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseClickPosition$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseLeftDown$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseLeftUp$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseRightDown$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseRightUp$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const defaultCursor$ = new Observable(<boolean>true);
export const keyUpCode$ = new Observable(<IKeyCode>{keyCode: 0, key: ''});
export const keyDownCode$ = new Observable(<IKeyCode>{keyCode: 0, key: ''});
export const globalSize$ = new Observable(<ISize>{height: 0, width: 0});
