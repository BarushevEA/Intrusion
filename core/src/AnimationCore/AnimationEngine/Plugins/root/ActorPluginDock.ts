import {IPlugin, IPluginDock} from "./PluginTypes";

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

    unLink(plugin: IPlugin): void{
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
        const list = this.getPluginList();
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

    getPluginList(): string[] {
        return Object.keys(this.pluginCase);
    };
}
