import {AbstractPlatform} from "../AnimationCore/AnimationEngine/AbstractPlatform";
import {Menu} from "./Scenes/Menu";
import {TestScene} from "./Scenes/TestScene";
import {SergeScene} from "./Scenes/SergeScene";
import {TestBackground} from "./Scenes/TestBackground";

export class AnimationPlatform extends AbstractPlatform {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    execute(): void {
        const menu = new Menu(this.canvas);
        const sceneTest = new TestScene(this.canvas);
        const sceneSerge = new SergeScene(this.canvas);
        const sceneBackground = new TestBackground(this.canvas);
        menu.renderStart(true);
        menu.onExit$.subscribe((data) => {
            console.log(data);
            if (data.nextScene) {
                switch (data.nextScene) {
                    case E_Scene.TEST:
                        sceneTest.renderStart(true);
                        break;
                    case E_Scene.SERGE:
                        sceneSerge.renderStart(false);
                        break;
                    case E_Scene.BACKGROUND:
                        sceneBackground.renderStart(false);
                        break;
                }
            }
        });
        sceneTest.onExit$.subscribe(() => {
            menu.renderStart(true);
        });
        sceneSerge.onExit$.subscribe(() => {
            menu.renderStart(true);
        });
        sceneBackground.onExit$.subscribe(() => {
            menu.renderStart(true);
        });
    }
}

export enum E_Scene {
    MENU = 'MENU',
    TEST = 'TEST',
    SERGE = 'SERGE',
    BACKGROUND = 'BACKGROUND'
}
