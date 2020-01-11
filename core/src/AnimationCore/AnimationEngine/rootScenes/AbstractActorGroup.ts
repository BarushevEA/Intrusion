import {IActorGroup} from "./SceneTypes";
import {AbstractScene} from "./AbstractScene";

export abstract class AbstractActorGroup implements IActorGroup {
    abstract initActions(scene: AbstractScene): void;

    abstract initActors(scene: AbstractScene): void;

    abstract destroy(): void;
}
