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
    setActiveLayer(index: number): void;
    setLayerOnTop(index: number): void;
    setLayerOnIndex(layerIndex: number, index: number): void;
}

export type IActorsPool = IActor[];
export type ILayerPool = { [key: number]: IActorsPool };

export class RenderController implements IRenderController {
    private canvas: HTMLCanvasElement = <any>0;
    private currentPool: IActorsPool = [];
    private animFrameIndex = -1;
    private context: CanvasRenderingContext2D = <any>0;
    private isBackgroundLayerPresent = false;
    private currentLayerIndex = 0;
    private layers: ILayerPool = {0: this.currentPool};
    private layersIndexes = [this.currentLayerIndex];

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    }

    public setActor(actor: IActor): void {
        this.currentPool.push(actor);
        actor.layer_index = this.currentLayerIndex;
        actor.z_index = this.currentPool.length - 1;
        this.sortActorsByZIndex();
    }

    public setActiveLayer(index: number): void {
        if (this.layers[index]) {
            this.currentPool = this.layers[index];
        } else {
            this.layers[index] = [];
            this.currentPool = this.layers[index];
            this.currentLayerIndex = index;
            this.layersIndexes = <number[]><any>Object.keys(this.layers).forEach((key, index, arr) => {
                (<any>arr[index]) = +key;
            });
            // this.layersIndexes.sort((a, b) => {
            //     return a > b ? 1 : -1;
            // });
        }
    }

    setLayerOnTop(index: number): void {
        if (!this.layers[index]) {
            return;
        }
        const tmp = [];
        for (let i = 0; i < this.layersIndexes.length; i++) {
            const layersIndex = this.layersIndexes[i];
            if (layersIndex != index) {
                tmp.push(layersIndex);
            }
        }
        this.layersIndexes = tmp;
        this.layersIndexes.push(index);
    }

    setLayerOnIndex(layerIndex: number, index: number): void {
        if (!this.layers[index]) {
            return;
        }
        const tmp = [];
        for (let i = 0; i < this.layersIndexes.length; i++) {
            const layersIndex = this.layersIndexes[i];
            if (index !== i) {
                if (layerIndex !== layersIndex) {
                    tmp.push(layersIndex);
                }
            } else {
                tmp.push(layerIndex);
                if (layerIndex !== layersIndex) {
                    tmp.push(layersIndex);
                }
            }
        }
        this.layersIndexes = tmp;
    }

    private setCurrentPoolFromActor(actor: IActor): boolean {
        let isSet = false;
        if (this.layers[actor.layer_index]) {
            this.currentLayerIndex = actor.layer_index;
            this.currentPool = this.layers[actor.layer_index];
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
        for (let i = 0; i < this.layersIndexes.length; i++) {
            const layersIndex = this.layersIndexes[i];
            for (let i = 0; i < this.currentPool.length; i++) {
                this.layers[layersIndex][i].renderFrame();
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
        this.layers[actor.layer_index] = this.currentPool;
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
        for (let k = 0; k < this.layersIndexes.length; k++) {
            this.currentPool = this.layers[this.layersIndexes[k]];
            for (let i = 0; i < this.currentPool.length; i++) {
                const element = this.currentPool.pop();
                if (element) {
                    element.destroy();
                }
            }
            delete this.layers[this.layersIndexes[k]];
        }
        this.layersIndexes.length = 0;
        this.currentPool.length = 0;
        this.layersIndexes = <any>0;
        this.currentPool = <any>0;
    }
}
