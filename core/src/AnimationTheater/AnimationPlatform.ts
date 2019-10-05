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
            test.onStop$.subscribe((data) => {
                sergScene.userData = data;
                sergScene.renderStart();
            }),
        );
        sergScene.collect(
            sergScene.onStop$.subscribe(() => {
                test.renderStart();
            })
        );
    }
}
