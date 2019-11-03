import {AbstractPlatform} from "../../AnimationCore/AnimationEngine/AbstractPlatform";
import {Menu} from "../Scenes/Menu";
import {TestScene} from "../Scenes/TestScene";
import {SergeScene} from "../Scenes/SergeScene";
import {TestBackground} from "../Scenes/TestBackground";
import {E_Scene} from "./types";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/AbstractScene";

let menu: AbstractScene = <any>0,
    sceneTest: AbstractScene = <any>0,
    sceneSerge: AbstractScene = <any>0,
    sceneBackground: AbstractScene = <any>0;

export function runApplicationScenario($: AbstractPlatform) {
    initScenes($);
    initEvents();
    runEnterPoint();
}

function runEnterPoint(): void {
    menu.start(true);
}

function initScenes($: AbstractPlatform): void {
    menu = $.createScene(Menu);
    sceneTest = $.createScene(TestScene);
    sceneSerge = $.createScene(SergeScene);
    sceneBackground = $.createScene(TestBackground);
}

function initEvents(): void {
    menu.onExit$.subscribe((data) => {
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
