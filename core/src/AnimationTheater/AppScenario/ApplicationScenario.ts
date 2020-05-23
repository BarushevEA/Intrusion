import {AbstractPlatform} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractPlatform";
import {Menu} from "../Scenes/Menu/Menu";
import {SergeScene} from "../Scenes/Serge/SergeScene";
import {E_Scene} from "./types";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {TestBackground} from "../Scenes/TestBackground/TestBackground";
import {TestScene} from "../Scenes/TestScene/TestScene";
import {IUserData} from "../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";
import {EventCollector} from "../../AnimationCore/Libraries/EventCollector";
import {TestX5} from "../Scenes/TestX5/TestX5";

const collector = new EventCollector();

let menu: AbstractScene = <any>0,
    sceneTest: AbstractScene = <any>0,
    sceneSerge: AbstractScene = <any>0,
    sceneBackground: AbstractScene = <any>0,
    sceneTestX5: AbstractScene = <any>0;

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
}

function initEvents(platform: AbstractPlatform): void {
    collector.collect(
        menu.onExit$.subscribe((data: IUserData) => {
            if (data.nextScene) {
                switch (data.nextScene) {
                    case E_Scene.TEST:
                        sceneTest = platform.createScene(TestScene);
                        collector.collect(
                            sceneTest.onStart$.subscribe(() => {
                            }),
                            sceneTest.onExit$.subscribe(() => {
                                console.log(sceneTest.name, 'Try to start menu.')
                                menu.start(true);
                            }),
                            // sceneTest.onDestroy$.subscribe(() => {
                            //     menu.start(true);
                            // })
                        );
                        sceneTest.start(true);
                        break;
                    case E_Scene.SERGE:
                        sceneSerge = platform.createScene(SergeScene);
                        collector.collect(
                            sceneSerge.onStart$.subscribe(() => {
                                sceneSerge.setHalfSpeed();
                            }),
                            sceneSerge.onExit$.subscribe(() => {
                                console.log(sceneSerge.name, 'Try to start menu.')
                                menu.start(true);
                            })
                        )
                        sceneSerge.start(false);
                        break;
                    case E_Scene.BACKGROUND:
                        sceneBackground = platform.createScene(TestBackground);
                        collector.collect(
                            sceneBackground.onStart$.subscribe(() => {
                                // sceneBackground.setHalfSpeed();
                            }),
                            sceneBackground.onExit$.subscribe(() => {
                                console.log(sceneBackground.name, 'Try to start menu.')
                                menu.start(true);
                            }),
                            // sceneBackground.onDestroy$.subscribe(() => {
                            //     menu.start(true);
                            // })
                        );
                        sceneBackground.start(true);
                        break;
                    case E_Scene.TESTx5:
                        sceneTestX5 = platform.createScene(TestX5);
                        collector.collect(
                            sceneTestX5.onStart$.subscribe(() => {
                                // sceneSerge.setHalfSpeed();
                            }),
                            sceneTestX5.onExit$.subscribe(() => {
                                console.log(sceneSerge.name, 'Try to start menu.')
                                menu.start(false);
                            })
                        )
                        sceneTestX5.start(false);
                        break;
                }
            }
        }),
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
            collector.destroy();
        })
    );
}
