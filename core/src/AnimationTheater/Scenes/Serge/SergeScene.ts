import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {handleButtons} from "./modules/segeButtons";
import {handleMiddle} from "./modules/sergeMiddle";
import {handleBackgrounds} from "./modules/sergeBackground";
import {handleCursor, initCursor} from "./modules/cursor";
import {ELayers} from "../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {E_Scene} from "../../AppScenario/types";
import {IScene} from "../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export class SergeScene extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, E_Scene.SERGE);
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
    scene.collect(
        scene.onSetUserData$.subscribe(() => {
            console.log(scene.userData);
        }),
    );
}
