import {AbstractPlatform} from "./AbstractPlatform";
import {runApplicationScenario} from "../../AnimationTheater/Scenario/ApplicationScenario";

class AnimationPlatform extends AbstractPlatform {

    constructor() {
        super();
    }

    execute(): void {
        runApplicationScenario(this);
    }
}

export const platform = new AnimationPlatform();
