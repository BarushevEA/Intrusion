import {IActorGroup, IScene} from "./SceneTypes";

export abstract class AbstractActorGroup implements IActorGroup {
    abstract initActions(scene: IScene): void;

    abstract initActors(scene: IScene): void;

    abstract destroy(): void;
}
