import {AbstractPlatform} from "../AnimationCore/AnimationEngine/AbstractPlatform";
import {TestScene} from "./Scenes/TestScene";

export class AnimationPlatform extends AbstractPlatform {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    create(): void {
        const test = new TestScene(this.canvas);
        test.renderStart();
        setTimeout(() => {
            test.renderStop();
            setTimeout(() => {
                test.renderStart();
            }, 5000);
        }, 5000);
        // setTimeout(() => {
        //     test.destroy();
        //     const sergScene = new SergeyScene(this.customCanvas, this.renderController);
        //     sergScene.renderStart();
        // }, 15000);
    }
}
