import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {handleBackgrounds} from "./modules/background";
import {handleMiddle} from "./modules/Middle/middle";
import {handleButtons} from "./modules/buttons";
import {handleCursor, initCursor} from "./modules/cursor";
import {ELayers} from "../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {E_Scene} from "../../AppScenario/types";
import {IScene} from "../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export class TestBackground extends AbstractScene {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, E_Scene.BACKGROUND);
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
        this.setActiveLayer(ELayers.BOSS_HEALTH);
        this.setActiveLayer(ELayers.TOP);
        this.setActiveLayer(ELayers.CURSOR);
    }
}

function sceneEvents(scene: IScene) {
    let renderTime = 0;
    let isHalf = false;
    let freezeCounter = 0;
    scene.collect(
        scene.renderController.beforeLayersRender$.subscribe(() => {
            if (!isHalf) {
                renderTime = Date.now();
            }
        }),
        scene.renderController.afterLayersRender$.subscribe(() => {
            if (isHalf) {
                return;
            }
            renderTime = Date.now() - renderTime;
            if (renderTime > 3) {
                freezeCounter++;
            }
            if (freezeCounter > 1000) {
                isHalf = true;
                scene.setHalfSpeed();
            }
        })
    );
}
