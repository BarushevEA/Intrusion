import {AbstractPlatform} from "../AnimationCore/AnimationEngine/AbstractPlatform";
import {TestScene} from "./Scenes/TestScene";
import {SergeyScene} from "./Scenes/SergeyScene";

export class AnimationPlatform extends AbstractPlatform {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    create(): void {
        const test = new TestScene(this.canvas);
        const sergScene = new SergeyScene(this.canvas);
        test.renderStart();
        test.collect(
            test.onDestroy$.subscribe((data) => {
                sergScene.userData = data;
                sergScene.renderStart();
            }),
            test.onStop$.subscribe(() => {
                setTimeout(() => {
                    test.renderStart();
                    setTimeout(() => {
                        test.destroy();
                    }, 5000);
                }, 5000);
            })
        );
        sergScene.collect(
            sergScene.onSetUserData$.subscribe(() => {
                setTimeout(() => {
                    sergScene.destroy();
                }, 5000);
            })
        );
        setTimeout(() => {
            test.renderStop();
        }, 5000);
    }
}
