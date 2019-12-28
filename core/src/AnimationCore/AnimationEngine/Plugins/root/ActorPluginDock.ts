import {IPlugin, IPluginDock, IPluginId, IPluginList} from "./PluginTypes";

export class PluginDock<T> implements IPluginDock {
    private readonly root: T;
    private pluginCase: { [key: string]: IPlugin } = {};

    constructor(root: T) {
        this.root = root;
    }

    add(plugin: IPlugin): void {
        plugin.setRoot(this.root);
        this.pluginCase[plugin.getName()] = plugin;
    };

    unLink(plugin: IPlugin): void {
        if (this.pluginCase.hasOwnProperty(plugin.getName())) {
            this.pluginCase[plugin.getName()].unLink();
            delete this.pluginCase[plugin.getName()];
        }
    };

    destroyPlugin(plugin: IPlugin): void {
        if (this.pluginCase.hasOwnProperty(plugin.getName())) {
            this.pluginCase[plugin.getName()].destroy();
            delete this.pluginCase[plugin.getName()];
        }
    };

    destroy(): void {
        const list = this.getNameList();
        for (let i = 0; i < list.length; i++) {
            const name = list[i];
            this.destroyPluginName(name);
        }
    };

    destroyPluginName(name: string): void {
        if (this.pluginCase.hasOwnProperty(name)) {
            this.pluginCase[name].destroy();
            delete this.pluginCase[name];
        }
    };

    getPlugin<T>(name: string): T {
        if (this.pluginCase.hasOwnProperty(name)) {
            const plugin = this.pluginCase[name];
            return <T><any>plugin;
        }
        return <any>0;
    };

    getNameList(): string[] {
        return Object.keys(this.pluginCase);
    };

    getNamesRootList(): IPluginList {
        const list = this.getNameList();
        if (!list || !list.length) {
            return <any>0;
        }
        const rootList: IPluginList = {};
        for (let i = 0; i < list.length; i++) {
            const name = list[i];
            const plugin = this.pluginCase[name];
            if (!rootList[plugin.rootName]) {
                rootList[plugin.rootName] = [];
            }
            rootList[plugin.rootName]
                .push({
                    number: parseInt(name.split(plugin.numberSeparator)[1], 10),
                    name: name
                });
        }
        return rootList;
    }

    getPluginsFromRootName<T>(name: string): T[] {
        const rootList: IPluginList = this.getNamesRootList();
        if (!rootList || !rootList[name]) {
            return <any>0;
        }

        const plugins: T[] = [];
        const ids: IPluginId[] = rootList[name];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            plugins.push(this.getPlugin<T>(id.name));
        }

        return plugins;
    }
}
