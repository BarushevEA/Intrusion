import {ISubscriber, ISubscriptionLike} from "../../../Libraries/Observable";
import {x_pos, y_pos} from "../../../Libraries/Types";

export type IDimensions = {
    xPos: x_pos;
    yPos: y_pos;
    width: number;
    height: number;
}

export type IPlugin = {
    readonly isDestroyed: boolean;
    getName(): string;
    destroy(): void;
    setRoot(root: any): void;
}

export type IPluginDock = {
    add(plugin: IPlugin): void;
    destroy(): void;
    destroyPluginName(name: string): void;
    destroyPlugin(plugin: IPlugin): void;
    getPlugin<T>(name: string): T;
    getPluginList(): string[];
}

export type IActor = {
    z_index: number;
    layerName: string;
    xPos: x_pos;
    yPos: y_pos;
    width: number;
    height: number;
    readonly isLeftMouseCatch: boolean;
    readonly isMouseClick$: ISubscriber<boolean>;
    readonly isMouseLeftDrop$: ISubscriber<any>;
    readonly isMouseLeftDrag$: ISubscriber<any>;
    readonly isMouseRightClick$: ISubscriber<boolean>;
    readonly isMouseLeftClick$: ISubscriber<boolean>;
    readonly isMouseOver$: ISubscriber<boolean>;
    readonly isMouseOver: boolean;
    readonly pluginDock: IPluginDock;
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
