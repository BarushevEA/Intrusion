import {AbstractActor} from "../rootModels/AbstractActor/AbstractActor";

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

export enum E_ZOnDrop {
    DEFAULT = 'DEFAULT',
    ON_TOP = 'ON_TOP'
}

export enum E_MouseCatch {
    BY_CENTER = 'BY_CENTER',
    BY_POSITION = 'BY_POSITION',
}

export type IDragDropOptions = {
    callbackOnDrag?: () => void;
    callbackOnDrop?: () => void;
    callbackOnMOve?: () => void;
    zIndexOnDrop?: E_ZOnDrop | number;
    mouseCatch?: E_MouseCatch;
};

export type IDragActor = {
    actor: AbstractActor;
    options?: IDragDropOptions;
};
