import {Observable} from "../Libraries/Observables/Observable";
import {IActor} from "./rootModels/AbstractActor/ActorTypes";
import {ISubscriber} from "../Libraries/Observables/Types";
import {deleteFromArray} from "../Libraries/FunctionLibs";

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
    getActiveLayerName(): string;
    setLayerOnTop(name: string): void;
    setLayerOnIndex(layerName: string, index: number): void;
    setFullSpeed(): void;
    setHalfSpeed(): void;
    afterLayersRender$: ISubscriber<boolean>;
    beforeLayersRender$: ISubscriber<boolean>;
    context: CanvasRenderingContext2D;
}

export type IActorsPool = IActor[];
export type ILayerPool = { [key: string]: IActorsPool };

export class RenderController implements IRenderController {
    private canvas: HTMLCanvasElement = <any>0;
    private currentPool: IActorsPool = [];
    private animFrameIndex = -1;
    private _context: CanvasRenderingContext2D = <any>0;
    private isBackgroundLayerPresent = false;
    private currentLayerName = 'background';
    private layers: ILayerPool = {[this.currentLayerName]: this.currentPool};
    private layersNames = [this.currentLayerName + ''];
    private delay = 1;
    private delayCounter = 0;
    private _afterLayersRender$ = new Observable(<boolean>false);
    private _beforeLayersRender$ = new Observable(<boolean>false);

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    get afterLayersRender$(): ISubscriber<boolean> {
        return this._afterLayersRender$;
    }

    get beforeLayersRender$(): Observable<boolean> {
        return this._beforeLayersRender$;
    }

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this._context = <CanvasRenderingContext2D>canvas.getContext('2d');
    }

    public setActor(actor: IActor): void {
        if (this.currentPool.indexOf(actor) !== -1) {
            return;
        }
        if (this.currentPool.length) {
            actor.z_index = this.currentPool[this.currentPool.length - 1].z_index + 1;
        }
        actor.layerName = this.currentLayerName;
        actor.layerNumber = this.layersNames.indexOf(this.currentLayerName)
        this.currentPool.push(actor);
    }

    public setActiveLayer(name: string): void {
        if (this.layers[name]) {
            this.currentPool = this.layers[name];
            this.currentLayerName = name;
            return;
        }
        this.currentPool = [];
        this.layers[name] = this.currentPool;
        this.currentLayerName = name;
        this.layersNames = Object.keys(this.layers);
    }

    getActiveLayerName(): string {
        return this.currentLayerName;
    }

    public setLayerOnTop(name: string): void {
        if (!this.layers[name]) {
            return;
        }
        deleteFromArray(this.layersNames, name);
        this.layersNames.push(name);
        this.reInitLayerNumbers();
    }

    public setLayerOnIndex(layerName: string, index: number): void {
        if (!this.layers[layerName]) {
            return;
        }
        const tmp = [];
        for (let i = 0; i < this.layersNames.length; i++) {
            const name = this.layersNames[i];
            if (index !== i) {
                if (layerName !== name) {
                    tmp.push(name);
                }
                continue;
            }
            tmp.push(layerName);
            if (layerName !== name) {
                tmp.push(name);
            }
        }
        this.layersNames = tmp;
        this.reInitLayerNumbers();
    }

    private reInitLayerNumbers(): void {
        for (let k = 0; k < this.layersNames.length; k++) {
            const layerName = this.layersNames[k];
            for (let i = 0; i < this.layers[layerName].length; i++) {
                this.layers[layerName][i].layerNumber = k;
            }
        }
    }

    private setCurrentPoolFromActor(actor: IActor): boolean {
        if (this.layers[actor.layerName]) {
            this.currentLayerName = actor.layerName;
            this.currentPool = this.layers[actor.layerName];
            return true;
        }
        return false;
    }

    public renderStart(isBackgroundLayerPresent: boolean): void {
        this.isBackgroundLayerPresent = isBackgroundLayerPresent;
        if (this.animFrameIndex === -1) {
            this.setFullSpeed();
        }
    }

    public setFullSpeed(): void {
        this.renderStop();
        if (this.isBackgroundLayerPresent) {
            this.runFullSpeedWithBackground();
        } else {
            this.runFullSpeedWithoutBackground();
        }
    };

    public setHalfSpeed(): void {
        this.renderStop();
        this.runHalfSpeed();
    };

    private drawLayers(): void {
        for (let k = 0; k < this.layersNames.length; k++) {
            const layerName = this.layersNames[k];
            for (let i = 0; i < this.layers[layerName].length; i++) {
                this.layers[layerName][i].render();
            }
        }
    }

    private runFullSpeedWithBackground(): void {
        this.animFrameIndex = requestAnimationFrame(this.runFullSpeedWithBackground.bind(this));
        this._beforeLayersRender$.next(true);
        this.drawLayers();
        this._afterLayersRender$.next(true);
    }

    private runFullSpeedWithoutBackground(): void {
        this.animFrameIndex = requestAnimationFrame(this.runFullSpeedWithoutBackground.bind(this));
        this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._beforeLayersRender$.next(true);
        this.drawLayers();
        this._afterLayersRender$.next(true);
    }

    private runHalfSpeed(): void {
        this.animFrameIndex = requestAnimationFrame(this.runHalfSpeed.bind(this));
        if (this.delayCounter >= this.delay) {
            this.delayCounter = 0;
            return;
        }
        this.delayCounter++;
        if (!this.isBackgroundLayerPresent) {
            this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this._beforeLayersRender$.next(true);
        this.drawLayers();
        this._afterLayersRender$.next(true);
    }

    public renderStop() {
        cancelAnimationFrame(this.animFrameIndex);
        this.animFrameIndex = -1;
    }

    public deleteActor(actor: IActor): void {
        if (!this.setCurrentPoolFromActor(actor)) {
            return;
        }
        this.currentPool = this.currentPool.filter(element => element !== actor);
        this.layers[actor.layerName] = this.currentPool;
    }

    public setActorOnTop(actor: IActor) {
        if (!this.setCurrentPoolFromActor(actor)) {
            return;
        }
        if (this.currentPool.indexOf(actor) === -1) {
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
            if (this.currentPool.indexOf(actors[i]) === -1) {
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
            if (this.currentPool.indexOf(actors[i]) === -1) {
                return;
            }
        }

        for (let i = 0; i < actors.length; i++) {
            actors[i].z_index = z_index;
        }
        this.sortActorsByZIndex();
    }

    public sortActorsByZIndex(): void {
        this.currentPool.sort((a, b) => a.z_index - b.z_index);
    }

    public destroyActors(): void {
        this._beforeLayersRender$.destroy();
        this._beforeLayersRender$ = <any>0;
        this._afterLayersRender$.destroy();
        this._afterLayersRender$ = <any>0;
        this.renderStop();
        for (let k = 0; k < this.layersNames.length; k++) {
            this.currentPool = this.layers[this.layersNames[k]];
            for (let i = 0; i < this.currentPool.length; i++) {
                const actor = this.currentPool[i];
                actor && actor.destroy();
            }
            this.currentPool.length = 0;
            delete this.layers[this.layersNames[k]];
        }
        this.layers = <any>0;
        this.layersNames.length = 0;
        this.layersNames = <any>0;
        this.currentPool = <any>0;
    }
}
