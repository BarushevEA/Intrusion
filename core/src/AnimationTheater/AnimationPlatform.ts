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
        test.renderStart(true);
        test.collect(
            test.onExit$.subscribe((data) => {
                sergScene.userData = data;
                sergScene.renderStart(false);
            }),
        );
        sergScene.collect(
            sergScene.onExit$.subscribe(() => {
                test.renderStart(true);
            })
        );
    }
}
