import {IKeyCode, ISize} from "./Types";
import {OrderedObservable} from "../Libraries/Observables/OrderedObservable";
import {Observable} from "../Libraries/Observables/Observable";
import {IMousePosition} from "./MouseStore";

export class EventStore {
    public mouseMovePosition$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
    public mouseClickPosition$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
    public mouseLeftDown$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
    public mouseLeftUp$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
    public mouseRightDown$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
    public mouseRightUp$ = new OrderedObservable(<IMousePosition>{x: 0, y: 0});
    public defaultCursor$ = new Observable(<boolean>true);
    public keyUpCode$ = new Observable(<IKeyCode>{keyCode: 0, key: ''});
    public keyDownCode$ = new Observable(<IKeyCode>{keyCode: 0, key: ''});
    public globalSize$ = new Observable(<ISize>{height: 0, width: 0});
}
