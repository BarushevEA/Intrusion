import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {handleBackgrounds} from "./modules/background";
import {handleMiddle, move, recMoveStart} from "./modules/middle";
import {handleButtons} from "./modules/buttons";
import {handleCursor, initCursor} from "./modules/cursor";
import {ELayers} from "../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {E_Scene} from "../../AppScenario/types";

export const userData = {
    test: 123,
    status: 'Ok'
};

export class TestScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, E_Scene.TEST);
    }

    protected createScene(): void {
        this.initLayers();
        initCursor(this);
        handleBackgrounds(this);
        handleMiddle(this);
        handleButtons(this);
        handleCursor(this);
        sceneEvents(this);
    }

    private initLayers() {
        this.setActiveLayer(ELayers.BACKGROUND);
        this.setActiveLayer(ELayers.MIDDLE);
        this.setActiveLayer(ELayers.TOP);
        this.setActiveLayer(ELayers.CURSOR);
    }
}

function sceneEvents(scene: AbstractScene) {
    scene.collect(
        scene.onStart$.subscribe(() => {
            recMoveStart(scene);
        }),
        scene.onExit$.subscribe(() => {
            scene.unsubscribe(move.value);
            move.value = <any>0;
        })
    );
}
