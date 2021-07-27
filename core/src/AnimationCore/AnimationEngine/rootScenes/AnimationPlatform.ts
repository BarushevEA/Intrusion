import {AbstractPlatform} from "./AbstractPlatform";
import {runApplicationScenario} from "../../../AnimationTheater/AppScenario/ApplicationScenario";
import {AbstractActor} from "../rootModels/AbstractActor/AbstractActor";
import {IAppAnimation} from "../../DomComponent/AppAnimation";

export class AnimationPlatform extends AbstractPlatform {
    public htmlComponent: IAppAnimation = <any>0;

    constructor() {
        super();
    }

    execute(htmlComponent: IAppAnimation): void {
        this.htmlComponent = htmlComponent;
        runApplicationScenario(this);
    }

    destroy(): void {
        super.destroy();
        AbstractActor.clearFramePool();
        this.htmlComponent && this.htmlComponent.destroy();
    }
}
