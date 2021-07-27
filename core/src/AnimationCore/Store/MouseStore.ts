import {x_pos, y_pos} from "../Libraries/Types";

export type IMousePosition = {
    x: x_pos;
    y: y_pos;
}

export class MouseStore {
    public movePosition: IMousePosition = {x: 0, y: 0};
    public clickPosition: IMousePosition = {x: 0, y: 0};
    public downPosition: IMousePosition = {x: 0, y: 0};
    public upPosition: IMousePosition = {x: 0, y: 0};
}