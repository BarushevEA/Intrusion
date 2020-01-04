import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";

export enum HealthType {
    ENEMY = 'ENEMY',
    HERO = 'HERO',
    ENEMY_BOSS = 'ENEMY_BOSS',
    NONE = 'NONE'
}

export type IHealthProgress = AbstractActor & {
    setProgress(progress: number): void;
}
