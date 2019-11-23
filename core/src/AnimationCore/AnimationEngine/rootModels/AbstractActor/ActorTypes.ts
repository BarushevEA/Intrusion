import {ISubscriber, ISubscriptionLike} from "../../../Libraries/Observable";
import {x_pos, y_pos} from "../../../Libraries/Types";

export type IDimensions = {
    xPos: x_pos;
    yPos: y_pos;
    width: number;
    height: number;
}

export type IActor = {
    z_index: number;
    layerName: string;
    xPos: x_pos;
    yPos: y_pos;
    width: number;
    height: number;
    isLeftMouseCatch: boolean;
    isMouseClick$: ISubscriber<boolean>;
    isMouseLeftDrop$: ISubscriber<any>;
    isMouseLeftDrag$: ISubscriber<any>;
    isMouseRightClick$: ISubscriber<boolean>;
    isMouseLeftClick$: ISubscriber<boolean>;
    isMouseOver$: ISubscriber<boolean>;
    isMouseOver: boolean;
    unsubscribe(subscriber: ISubscriptionLike): void;
    collect(...subscribers: ISubscriptionLike[]): void;
    setAnimationOriginal(): void;
    setAnimationReverse(): void;
    setStopFrame(index: number): void;
    resetStopFrame(): void;
    saveZIndex(): void;
    restoreZIndex(): void;
    saveLayerIndex(): void;
    restoreLayerIndex(): void;
    renderFrame(): void;
    destroy(): void;
    enableEvents(): void;
    disableEvents(): void;
    getDimensions(): IDimensions;
}
