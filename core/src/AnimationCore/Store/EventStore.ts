import {Observable} from "../CustomeLibraries/Observable";
import {IMousePosition} from "../CustomeDomComponent/AppAnimation";

export const mouseMovePosition$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseClickPosition$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseLeftDown$ = new Observable(<IMousePosition>{x: 0, y: 0});
export const mouseLeftUp$ = new Observable(<IMousePosition>{x: 0, y: 0});
