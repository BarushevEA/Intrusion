export enum ECursor {
    DEFAULT = 'DEFAULT',
    POINTER = 'POINTER',
    CATCH = 'CATCH'
}

export type ICursor = {
    setType(type: ECursor): void;
};
