import {AbstractPlatform} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractPlatform";
import {Menu} from "../Scenes/Menu/Menu";
import {SergeScene} from "../Scenes/Serge/SergeScene";
import {E_Scene} from "./types";
import {AbstractScene, IUserData} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {TestBackground} from "../Scenes/TestBackground/TestBackground";
import {TestScene} from "../Scenes/TestScene/TestScene";

let menu: AbstractScene = <any>0,
    sceneTest: AbstractScene = <any>0,
    sceneSerge: AbstractScene = <any>0,
    sceneBackground: AbstractScene = <any>0;

export function runApplicationScenario(platform: AbstractPlatform) {
    initScenes(platform);
    initEvents(platform);
    runEnterPoint();
}

function runEnterPoint(): void {
    menu.start(true);
}

function initScenes(platform: AbstractPlatform): void {
    menu = platform.createScene(Menu);
    sceneSerge = platform.createScene(SergeScene);
    sceneBackground = platform.createScene(TestBackground);
}

function initEvents(platform: AbstractPlatform): void {
    menu.onExit$.subscribe((data: IUserData) => {
        if (data.nextScene) {
            switch (data.nextScene) {
                case E_Scene.TEST:
                    sceneTest = platform.createScene(TestScene);
                    sceneTest.onStart$.subscribe(() => {
                    });
                    sceneTest.onDestroy$.subscribe(() => {
                        menu.start(true);
                    });
                    sceneTest.start(true);
                    break;
                case E_Scene.SERGE:
                    sceneSerge.onStart$.subscribe(() => {
                        sceneSerge.setHalfSpeed();
                    });
                    sceneSerge.start(false);
                    sceneSerge.onExit$.subscribe(() => {
                        menu.start(true);
                    });
                    break;
                case E_Scene.BACKGROUND:
                    if (sceneBackground.isDestroyed) {
                        sceneBackground = platform.createScene(TestBackground);
                    }
                    sceneBackground.start(true);
                    sceneBackground.onExit$.subscribe(() => {
                        menu.start(true);
                    });
                    sceneBackground.onDestroy$.subscribe(() => {
                        menu.start(true);
                    });
                    break;
            }
        }
    });
    menu.onDestroy$.subscribe(() => {
        if (sceneTest) {
            sceneTest.destroy();
        }
        if (sceneSerge) {
            sceneSerge.destroy();
        }
        if (sceneBackground) {
            sceneBackground.destroy();
        }
        sceneTest = <any>0;
        sceneSerge = <any>0;
        sceneBackground = <any>0;
    });
}
