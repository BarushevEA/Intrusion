import {AbstractActor} from "./AbstractActor";

export enum ECursor {
    DEFAULT = 'DEFAULT',
    POINTER = 'POINTER',
    CATCH = 'CATCH'
}

export type ICursorType = ECursor | string;

export type ICursor =
    AbstractActor &
    {
        setType(type: ICursorType): void;
    };
