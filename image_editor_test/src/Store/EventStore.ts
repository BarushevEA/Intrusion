import {CTMObservable} from "../CustomeLibraries/CTMObservable";
import {IMousePosition} from "../CustomeDomComponent/AppAnimation";

export const mousePosition$ = new CTMObservable(<IMousePosition>{x: 0, y: 0});
