import {AbstractPlatform} from "./AbstractPlatform";
import {runApplicationScenario} from "../../../AnimationTheater/AppScenario/ApplicationScenario";
import {AbstractActor} from "../rootModels/AbstractActor/AbstractActor";

class AnimationPlatform extends AbstractPlatform {
    private htmlComponent: any;

    constructor() {
        super();
    }

    execute(htmlComponent: any): void {
        this.htmlComponent = htmlComponent;
        runApplicationScenario(this);
    }

    destroy(): void {
        AbstractActor.clearFramePool();
        this.htmlComponent.destroy();
    }
}

export const platform = new AnimationPlatform();
