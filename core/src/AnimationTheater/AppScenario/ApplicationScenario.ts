import {AbstractPlatform} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractPlatform";
import {Menu} from "../Scenes/Menu/Menu";
import {E_Scene, IScenePool} from "./types";
import {TestBackground} from "../Scenes/TestBackground/TestBackground";
import {TestScene} from "../Scenes/TestScene/TestScene";
import {IUserData} from "../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";
import {EventCollector} from "../../AnimationCore/Libraries/EventCollector";
import {clearOnSceneDestroy} from "../../AnimationCore/Libraries/Actions";

const collector = new EventCollector();

let pool: IScenePool = {};
pool[E_Scene.MENU] = <any>0;
pool[E_Scene.TEST] = <any>0;
pool[E_Scene.BACKGROUND] = <any>0;

export function runApplicationScenario(platform: AbstractPlatform) {
    initScenes(platform);
    initEvents(platform);
    runEnterPoint();
}

function runEnterPoint(): void {
    pool[E_Scene.MENU].start(true);
}

function initScenes(platform: AbstractPlatform): void {
    pool[E_Scene.MENU] = platform.createScene(Menu);
}

function initEvents(platform: AbstractPlatform): void {
    collector.collect(
        pool[E_Scene.MENU].onExit$.subscribe((data: IUserData) => {
            if (data.nextScene) {
                switch (data.nextScene) {
                    case E_Scene.TEST:
                        pool[E_Scene.TEST] = platform.createScene(TestScene);
                        startMenuOnExit(E_Scene.TEST);
                        pool[E_Scene.TEST].start(true);
                        break;
                    case E_Scene.BACKGROUND:
                        pool[E_Scene.BACKGROUND] = platform.createScene(TestBackground);
                        startMenuOnExit(E_Scene.BACKGROUND);
                        pool[E_Scene.BACKGROUND].start(true);
                        break;
                    case E_Scene.MENU:
                        break;
                    default:
                        pool[E_Scene.MENU].destroy('ApplicationScenario default');
                }
            }
        }));

    clearOnSceneDestroy(pool[E_Scene.MENU], () => {
        const keys = Object.keys(pool);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (pool[key] && key !== E_Scene.MENU) {
                pool[key].destroy('ApplicationScenario clearOnSceneDestroy');
                pool[key] = <any>0;
            }
        }
        collector.destroy();
        pool[E_Scene.MENU] = <any>0;
        platform.destroy();
        console.log(E_Scene.MENU, 'destroyed');
    });
}

function startMenuOnExit(sceneName: E_Scene): void {
    collector.collect(
        pool[sceneName].onExit$.subscribe(() => {
            console.log(pool[sceneName].name, 'Try to start menu.')
            pool[E_Scene.MENU].start(true);
        })
    );
}
