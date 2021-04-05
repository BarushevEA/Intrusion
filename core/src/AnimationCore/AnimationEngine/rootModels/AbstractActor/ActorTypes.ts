import {x_pos, y_pos} from "../../../Libraries/Types";
import {IPluginDock} from "../../Plugins/root/PluginTypes";
import {IObserver, ISubscriber, ISubscriptionLike} from "../../../Libraries/Observables/Types";
import {IFramePool} from "../../LayerHandler/CanvasLayerHandler";
import {ITextHandler} from "../../LayerHandler/TextHandler";
import {IShapeHandler} from "../../LayerHandler/shapeModules/ShapeHandler";

export type IDimensions = {
    xPos: x_pos;
    yPos: y_pos;
    width: number;
    height: number;
}

export type IActor = {
    innerText: string;
    z_index: number;
    layerName: string;
    layerNumber: number;
    xPos: x_pos;
    yPos: y_pos;
    width: number;
    height: number;
    isEventsBlock: boolean;
    isUnlinked: boolean;
    framePool: IFramePool;
    isDestroyEnabled: boolean;
    readonly text: ITextHandler;
    readonly shape: IShapeHandler;
    readonly isLeftMouseCatch: boolean;
    readonly isMouseClick$: ISubscriber<boolean>;
    readonly isMouseLeftDrop$: ISubscriber<any>;
    readonly isMouseLeftDrag$: ISubscriber<any>;
    readonly isMouseRightClick$: ISubscriber<boolean>;
    readonly isMouseLeftClick$: ISubscriber<boolean>;
    readonly isMouseOver$: ISubscriber<boolean>;
    readonly isDestroyed$: ISubscriber<boolean>;
    readonly beforeRender$: ISubscriber<any>;
    readonly afterRender$: ISubscriber<any>;
    readonly onEventEnableChange$: ISubscriber<boolean>;
    readonly onImageLoad$: IObserver<any>;
    readonly isDestroyed: boolean;
    readonly isMouseOver: boolean;
    readonly isAnimationOriginal: boolean;
    readonly isEventsPaused: boolean;
    readonly pluginDock: IPluginDock;
    readonly xPosPreview: x_pos;
    readonly yPosPreview: y_pos;
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
    render(): void;
    destroy(): void;
    enableEvents(): void;
    disableEvents(): void;
    getDimensions(): IDimensions;
    pauseEvents(): void;
    unPauseEvents(): void;
    resetEvents(): void;
    setVirtualLayer(name: string, height?: number, width?: number): HTMLCanvasElement;
    clearLayer(x?: x_pos, y?: y_pos, width?: number, height?: number): void;
    restoreDefaultLayer(): void;
    deleteVirtual(targetName: string): void;
    drawVirtualOnVirtual(targetName: string, sourceName: string, x: number, y: number): void;
    drawVirtualOnGeneral(sourceName: string,
                         x: number,
                         y: number,
                         width?: number,
                         height?: number,
                         xD?: number,
                         yD?: number,
                         widthD?: number,
                         heightD?: number
    ): void;
    setFramesDelay(delay: number): void;
    getFramePoolName(): string;
};
