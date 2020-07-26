import {IScene} from "../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export enum E_Scene {
    MENU = 'MENU',
    TEST = 'TEST',
    SERGE = 'SERGE',
    BACKGROUND = 'BACKGROUND',
    TESTx5 = 'TESTx5',
    NULL = 'NULL'
}

export type IScenePool = { [sceneName: string]: IScene };
