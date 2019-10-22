import {IActor} from "./rootModels/AbstractActor";
import {findElementOnArray} from "../CustomeLibraries/FunctionLibs";

export type IRenderController = {
    setCanvas(canvas: HTMLCanvasElement): void;
    setActor(element: IActor): void;
    renderStart(isBackgroundLayerPresent: boolean): void;
    renderStop(): void;
    deleteActor(element: IActor): void;
    destroyActors(): void;
    setActorOnTop(element: IActor): void;
    setActorZIndex(element: IActor, z_index: number): void;
    sortActorsByZIndex(): void;
    setActorGroupOnTop(elements: IActor[]): void;
    setActorsGroupByZIndex(elements: IActor[], z_index: number): void;
    setActiveLayer(name: string): void;
    setLayerOnTop(name: string): void;
    setLayerOnIndex(layerName: string, index: number): void;
}

export type IActorsPool = IActor[];
export type ILayerPool = { [key: string]: IActorsPool };

export class RenderController implements IRenderController {
    private canvas: HTMLCanvasElement = <any>0;
    private currentPool: IActorsPool = [];
    private animFrameIndex = -1;
    private context: CanvasRenderingContext2D = <any>0;
    private isBackgroundLayerPresent = false;
    private currentLayerIndex = '0';
    private layers: ILayerPool = {0: this.currentPool};
    private layersNames = [this.currentLayerIndex + ''];

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }

    public setActor(actor: IActor): void {
        this.currentPool.push(actor);
        actor.layer_name = this.currentLayerIndex;
        actor.z_index = this.currentPool.length - 1;
        this.sortActorsByZIndex();
    }

    public setActiveLayer(name: string): void {
        if (this.layers[name]) {
            this.currentPool = this.layers[name];
        } else {
            this.layers[name] = [];
            this.currentPool = this.layers[name];
            this.currentLayerIndex = name;
            this.layersNames = Object.keys(this.layers);
        }
    }

    public setLayerOnTop(name: string): void {
        if (!this.layers[name]) {
            return;
        }
        const tmp = [];
        for (let i = 0; i < this.layersNames.length; i++) {
            const layersName = this.layersNames[i];
            if (layersName != name) {
                tmp.push(layersName);
            }
        }
        this.layersNames = tmp;
        this.layersNames.push(name);
    }

    setLayerOnIndex(layerName: string, index: number): void {
        if (!this.layers[index]) {
            return;
        }
        const tmp = [];
        for (let i = 0; i < this.layersNames.length; i++) {
            const name = this.layersNames[i];
            if (index !== i) {
                if (layerName !== name) {
                    tmp.push(name);
                }
            } else {
                tmp.push(layerName);
                if (layerName !== name) {
                    tmp.push(name);
                }
            }
        }
        this.layersNames = tmp;
    }

    private setCurrentPoolFromActor(actor: IActor): boolean {
        let isSet = false;
        if (this.layers[actor.layer_name]) {
            this.currentLayerIndex = actor.layer_name;
            this.currentPool = this.layers[actor.layer_name];
            isSet = true;
        }
        return isSet;
    }

    public renderStart(isBackgroundLayerPresent: boolean): void {
        this.isBackgroundLayerPresent = isBackgroundLayerPresent;
        if (this.animFrameIndex === -1) {
            this.renderBegin();
        }
    }

    private renderBegin() {
        this.animFrameIndex = requestAnimationFrame(this.renderBegin.bind(this));
        if (!this.isBackgroundLayerPresent) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        for (let k = 0; k < this.layersNames.length; k++) {
            const layerName = this.layersNames[k];
            for (let i = 0; i < this.layers[layerName].length; i++) {
                this.layers[layerName][i].renderFrame();
            }
        }
    }

    public renderStop() {
        cancelAnimationFrame(this.animFrameIndex);
        this.animFrameIndex = -1;
    }

    public deleteActor(actor: IActor): void {
        if (!this.setCurrentPoolFromActor(actor)) {
            return;
        }
        this.currentPool = this.currentPool.filter(element => {
            return element !== actor;
        });
        this.layers[actor.layer_name] = this.currentPool;
    }

    public setActorOnTop(actor: IActor) {
        if (!this.setCurrentPoolFromActor(actor)) {
            return;
        }
        const index = findElementOnArray(this.currentPool, actor);
        if (index === -1) {
            return;
        }
        actor.z_index = this.currentPool[this.currentPool.length - 1].z_index + 1;
        this.sortActorsByZIndex();
    }

    public setActorZIndex(actor: IActor, z_index: number): void {
        if (!this.setCurrentPoolFromActor(actor)) {
            return;
        }
        actor.z_index = z_index;
        this.sortActorsByZIndex();
    }

    public setActorGroupOnTop(actors: IActor[]): void {
        if (!this.setCurrentPoolFromActor(actors[0])) {
            return;
        }
        for (let i = 0; i < actors.length; i++) {
            const index = findElementOnArray(this.currentPool, actors[i]);
            if (index === -1) {
                return;
            }
        }
        const zIndex = this.currentPool[this.currentPool.length - 1].z_index + 1;
        for (let i = 0; i < actors.length; i++) {
            actors[i].z_index = zIndex + i;
        }
        this.sortActorsByZIndex();
    }

    public setActorsGroupByZIndex(actors: IActor[], z_index: number): void {
        if (!this.setCurrentPoolFromActor(actors[0])) {
            return;
        }
        for (let i = 0; i < actors.length; i++) {
            const index = findElementOnArray(this.currentPool, actors[i]);
            if (index === -1) {
                return;
            }
        }

        for (let i = 0; i < actors.length; i++) {
            actors[i].z_index = z_index;
        }
        this.sortActorsByZIndex();
    }

    public sortActorsByZIndex(): void {
        this.currentPool.sort((a, b) => {
            return a.z_index > b.z_index ? 1 : -1;
        });
    }

    public destroyActors(): void {
        this.renderStop();
        for (let k = 0; k < this.layersNames.length; k++) {
            this.currentPool = this.layers[this.layersNames[k]];
            for (let i = 0; i < this.currentPool.length; i++) {
                const element = this.currentPool.pop();
                if (element) {
                    element.destroy();
                }
            }
            delete this.layers[this.layersNames[k]];
        }
        this.layersNames.length = 0;
        this.currentPool.length = 0;
        this.layersNames = <any>0;
        this.currentPool = <any>0;
    }
}
