import {Menu} from "../Scenes/Menu/Menu";
import {SergeScene} from "../Scenes/Serge/SergeScene";
import {E_Scene} from "./types";
import {TestBackground} from "../Scenes/TestBackground/TestBackground";
import {TestScene} from "../Scenes/TestScene/TestScene";
import {IUserData} from "../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";
import {TestX5} from "../Scenes/TestX5/TestX5";
import {clearOnSceneDestroy} from "../../AnimationCore/Libraries/Actions";
import {AnimationPlatform} from "../../AnimationCore/AnimationEngine/rootScenes/AnimationPlatform";

export function runApplicationScenario(platform: AnimationPlatform) {
    platform.scenePool[E_Scene.MENU] = <any>0;
    platform.scenePool[E_Scene.TEST] = <any>0;
    platform.scenePool[E_Scene.SERGE] = <any>0;
    platform.scenePool[E_Scene.BACKGROUND] = <any>0;
    platform.scenePool[E_Scene.TESTx5] = <any>0;
    initScenes(platform);
    initEvents(platform);
    runEnterPoint(platform);
}

function runEnterPoint(platform: AnimationPlatform): void {
    platform.scenePool[E_Scene.MENU].start(true);
}

function initScenes(platform: AnimationPlatform): void {
    platform.scenePool[E_Scene.MENU] = platform.createScene(Menu);
}

function initEvents(platform: AnimationPlatform): void {
    platform.collect(
        platform.scenePool[E_Scene.MENU].onExit$.subscribe((data: IUserData) => {
            if (data.nextScene) {
                switch (data.nextScene) {
                    case E_Scene.TEST:
                        platform.scenePool[E_Scene.TEST] = platform.createScene(TestScene);
                        startMenuOnExit(platform, E_Scene.TEST);
                        platform.scenePool[E_Scene.TEST].start(true);
                        break;
                    case E_Scene.SERGE:
                        platform.scenePool[E_Scene.SERGE] = platform.createScene(SergeScene);
                        platform.collect(
                            platform.scenePool[E_Scene.SERGE].onStart$.subscribe(() => platform.scenePool[E_Scene.SERGE].setHalfSpeed()),
                        )
                        startMenuOnExit(platform, E_Scene.SERGE);
                        platform.scenePool[E_Scene.SERGE].start(false);
                        break;
                    case E_Scene.BACKGROUND:
                        platform.scenePool[E_Scene.BACKGROUND] = platform.createScene(TestBackground);
                        startMenuOnExit(platform, E_Scene.BACKGROUND);
                        platform.scenePool[E_Scene.BACKGROUND].start(true);
                        break;
                    case E_Scene.TESTx5:
                        platform.scenePool[E_Scene.TESTx5] = platform.createScene(TestX5);
                        startMenuOnExit(platform, E_Scene.TESTx5);
                        platform.scenePool[E_Scene.TESTx5].start(false);
                        break;
                    case E_Scene.MENU:
                        break;
                    default:
                        platform.scenePool[E_Scene.MENU].destroy('ApplicationScenario default');
                }
            }
        }));

    clearOnSceneDestroy(platform.scenePool[E_Scene.MENU], () => {
        const keys = Object.keys(platform.scenePool);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (platform.scenePool[key] && key !== E_Scene.MENU) {
                platform.scenePool[key].destroy('ApplicationScenario clearOnSceneDestroy');
                platform.scenePool[key] = <any>0;
            }
        }
        platform.scenePool[E_Scene.MENU] = <any>0;
        platform.destroy();
        console.log(E_Scene.MENU, 'destroyed');
    });
}

function startMenuOnExit(platform: AnimationPlatform, sceneName: E_Scene): void {
    platform.collect(
        platform.scenePool[sceneName].onExit$.subscribe(() => {
            console.log(platform.scenePool[sceneName].name, 'Try to start menu.')
            platform.scenePool[E_Scene.MENU].start(true);
        })
    );
}
