import {AbstractPlatform} from "../../AnimationCore/AnimationEngine/AbstractPlatform";
import {Menu} from "../Scenes/Menu/Menu";
import {TestScene} from "../Scenes/TestScene";
import {SergeScene} from "../Scenes/Serge/SergeScene";
import {E_Scene} from "./types";
import {AbstractScene, IUserData} from "../../AnimationCore/AnimationEngine/AbstractScene";
import {TestBackground} from "../Scenes/TestBackground/TestBackground";

let menu: AbstractScene = <any>0,
    sceneTest: AbstractScene = <any>0,
    sceneSerge: AbstractScene = <any>0,
    sceneBackground: AbstractScene = <any>0;

export function runApplicationScenario(platform: AbstractPlatform) {
    initScenes(platform);
    initEvents();
    runEnterPoint();
}

function runEnterPoint(): void {
    menu.start(true);
}

function initScenes(platform: AbstractPlatform): void {
    menu = platform.createScene(Menu);
    sceneTest = platform.createScene(TestScene);
    sceneSerge = platform.createScene(SergeScene);
    sceneBackground = platform.createScene(TestBackground);
}

function initEvents(): void {
    menu.onExit$.subscribe((data: IUserData) => {
        console.log(data);
        if (data.nextScene) {
            switch (data.nextScene) {
                case E_Scene.TEST:
                    sceneTest.start(true);
                    break;
                case E_Scene.SERGE:
                    sceneSerge.start(false);
                    break;
                case E_Scene.BACKGROUND:
                    sceneBackground.start(false);
                    break;
            }
        }
    });
    sceneTest.onExit$.subscribe(() => {
        menu.start(true);
    });
    sceneSerge.onExit$.subscribe(() => {
        menu.start(true);
    });
    sceneBackground.onExit$.subscribe(() => {
        menu.start(true);
    });
}
