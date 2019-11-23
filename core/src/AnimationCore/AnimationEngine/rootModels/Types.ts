import {AbstractActor} from "./AbstractActor/AbstractActor";

export enum ECursor {
    DEFAULT = 'DEFAULT',
    POINTER = 'POINTER',
    CATCH = 'CATCH',
    NONE = 'NONE'
}

export type ICursorType = ECursor | string;

export type ICursor =
    AbstractActor &
    {
        type: ICursorType;
        setType(type: ICursorType): void;
    };
