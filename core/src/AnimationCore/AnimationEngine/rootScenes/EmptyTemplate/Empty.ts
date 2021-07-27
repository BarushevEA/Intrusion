import {AbstractScene} from "../AbstractScene";
import {handleBackgrounds} from "./modules/background";
import {handleMiddle} from "./modules/middle";
import {handleButtons} from "./modules/buttons";
import {handleCursor, initCursor} from "./modules/cursor";
import {ELayers} from "../scenesEnvironment";
import {IScene} from "../SceneTypes";
import {AnimationPlatform} from "../AnimationPlatform";

export class Empty extends AbstractScene {

    constructor(platform: AnimationPlatform) {
        super(platform);
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

function sceneEvents(scene: IScene) {
    scene.collect();
}
