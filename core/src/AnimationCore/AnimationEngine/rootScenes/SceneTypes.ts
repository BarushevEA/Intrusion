import {E_MouseCatch, E_ZOnDrop} from "./scenesEnvironment";
import {IActor} from "../rootModels/AbstractActor/ActorTypes";
import {ICursorHandler} from "../../Libraries/CursorHandler";
import {ICursor} from "../rootModels/Types";
import {ISubscriber, ISubscriptionLike} from "../../Libraries/Observables/Types";
import {IRenderController} from "../RenderController";

export type IScene = {
    readonly name: string;
    readonly isDestroyed: boolean;
    readonly tickCount$: ISubscriber<boolean>;
    readonly onSetUserData$: ISubscriber<IUserData>;
    readonly onStop$: ISubscriber<IUserData>;
    readonly onExit$: ISubscriber<IUserData>;
    readonly onStartOnce$: ISubscriber<IUserData>;
    readonly onStart$: ISubscriber<IUserData>;
    readonly onDestroy$: ISubscriber<IUserData>;
    readonly render: IRenderController;
    readonly generalLayer: HTMLCanvasElement;
    readonly actors: IActor[];
    cursorHandler: ICursorHandler;
    cursor: ICursor;
    userData: IUserData;
    start(isBackgroundLayerPresent: boolean): void;
    stop(): void;
    exit(): void;
    destroy(initiator?: string): void;
    setActors(...actors: IActor[]): void;
    destroyActor(actor: IActor): void;
    unLink(actor: IActor): void;
    setHalfSpeed(): void;
    setFullSpeed(): void;
    setActorOnTop(actor: IActor): void;
    setActorZIndex(actor: IActor, z_index: number): void;
    setActorsGroupOnTop(actors: IActor[]): void;
    setActorsGroupByZIndex(actors: IActor[], z_index: number): void;
    sortActorsByZIndex(): void;
    setActiveLayer(name: string): void;
    getActiveLayerName(): string;
    setLayerOnTop(name: string): void;
    setLayerOnIndex(layerName: string, index: number): void;
    collect(...subscribers: ISubscriptionLike[]): void;
    moveOnMouseDrag(actor: IActor, options?: IDragDropOptions): void;
    unsubscribe(subscriber: ISubscriptionLike): void;
};

export type IUserData = {
    nextScene?: string;
    [key: string]: any;
};

export type IDragDropOptions = {
    callbackOnDrag?: () => void;
    callbackOnDrop?: () => void;
    callbackOnMOve?: () => void;
    zIndexOnDrop?: E_ZOnDrop | number;
    mouseCatch?: E_MouseCatch;
};

export type IDragActor = {
    actor: IActor;
    options?: IDragDropOptions;
};

export type IActorGroup = {
    initActors(scene: IScene): void;
    initActions(scene: IScene): void;
    destroy(): void;
};
