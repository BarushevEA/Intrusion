export enum E_KEY_MOVE_PLUGIN {
    MOVE_KEY_UP = 'MOVE_KEY_UP',
    MOVE_KEY_DOWN = 'MOVE_KEY_DOWN',
    MOVE_KEY_LEFT = 'MOVE_KEY_LEFT',
    MOVE_KEY_RIGHT = 'MOVE_KEY_RIGHT',
}

export type IPlugin = {
    readonly numberSeparator: string;
    readonly isDestroyed: boolean;
    readonly rootName: string;
    getName(): string;
    destroy(): void;
    unLink(): void;
    setRoot(root: any): void;
}

export type IPluginId = {
    name: string;
    number: number;
}

export type IPluginList = {
    [rootName: string]: IPluginId[];
};

export type IPluginDock = {
    add(plugin: IPlugin): void;
    unLink(plugin: IPlugin): void;
    destroy(): void;
    destroyPluginName(name: string): void;
    destroyPlugin(plugin: IPlugin): void;
    getPlugin<T>(name: string): T;
    getNameList(): string[];
    getNamesRootList(): IPluginList;
    getPluginsFromRootName<T>(name: string): T[];
}
