import {CTMObservable} from "../CustomeLibraries/CTMObservable";
import {IMousePosition} from "../CustomeDomComponent/AppAnimation";

export const mouseMovePosition$ = new CTMObservable(<IMousePosition>{x: 0, y: 0});
export const mouseClickPosition$ = new CTMObservable(<IMousePosition>{x: 0, y: 0});
