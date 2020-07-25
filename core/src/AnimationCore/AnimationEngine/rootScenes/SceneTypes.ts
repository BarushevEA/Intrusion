import {AbstractScene} from "./AbstractScene";
import {E_MouseCatch, E_ZOnDrop} from "./scenesEnvironment";
import {IActor} from "../rootModels/AbstractActor/ActorTypes";

export type IScene = {
    start(isBackgroundLayerPresent: boolean): void;
    stop(): void;
    exit(): void;
    destroy(): void;
    readonly isDestroyed: boolean;
}

export type IUserData = {
    nextScene?: string;
    [key: string]: any;
}

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
    initActors(scene: AbstractScene): void;
    initActions(scene: AbstractScene): void;
    destroy(): void;
};
