import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {handleBackgrounds} from "./modules/menuBackground";
import {handleMiddle} from "./modules/menuMiddle";
import {handleButtons} from "./modules/menuButtons";
import {handleCursor, initCursor} from "./modules/cursor";
import {ELayers} from "../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";

export class Menu extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
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
    scene.collect();
}
