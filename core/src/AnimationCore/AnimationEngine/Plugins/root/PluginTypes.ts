export enum E_KEY_MOVE_PLUGIN {
    MOVE_KEY_UP = 'MOVE_KEY_UP',
    MOVE_KEY_DOWN = 'MOVE_KEY_DOWN',
    MOVE_KEY_LEFT = 'MOVE_KEY_LEFT',
    MOVE_KEY_RIGHT = 'MOVE_KEY_RIGHT',
}

export type IPlugin = {
    readonly isDestroyed: boolean;
    getName(): string;
    destroy(): void;
    unLink(): void;
    setRoot(root: any): void;
}

export type IPluginDock = {
    add(plugin: IPlugin): void;
    unLink(plugin: IPlugin): void;
    destroy(): void;
    destroyPluginName(name: string): void;
    destroyPlugin(plugin: IPlugin): void;
    getPlugin<T>(name: string): T;
    getPluginList(): string[];
}
