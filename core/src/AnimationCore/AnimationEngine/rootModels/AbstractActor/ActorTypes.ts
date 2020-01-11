import {ISubscriber, ISubscriptionLike} from "../../../Libraries/Observable";
import {x_pos, y_pos} from "../../../Libraries/Types";
import {IPluginDock} from "../../Plugins/root/PluginTypes";

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
    isEventsBlock: boolean;
    isUnlinked: boolean;
    readonly isLeftMouseCatch: boolean;
    readonly isMouseClick$: ISubscriber<boolean>;
    readonly isMouseLeftDrop$: ISubscriber<any>;
    readonly isMouseLeftDrag$: ISubscriber<any>;
    readonly isMouseRightClick$: ISubscriber<boolean>;
    readonly isMouseLeftClick$: ISubscriber<boolean>;
    readonly isMouseOver$: ISubscriber<boolean>;
    readonly isDestroyed$: ISubscriber<boolean>;
    readonly isDestroyed: boolean;
    readonly isMouseOver: boolean;
    readonly pluginDock: IPluginDock;
    unsubscribe(subscriber: ISubscriptionLike): void;
    collect(...subscribers: ISubscriptionLike[]): void;
    setPosition(x: x_pos, y: y_pos): void;
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
