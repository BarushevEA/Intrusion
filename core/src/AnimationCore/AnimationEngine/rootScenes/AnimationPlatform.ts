import {AbstractPlatform} from "./AbstractPlatform";
import {runApplicationScenario} from "../../../AnimationTheater/AppScenario/ApplicationScenario";

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
        this.htmlComponent.destroy();
    }
}

export const platform = new AnimationPlatform();
