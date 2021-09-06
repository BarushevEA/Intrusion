import {IScene} from "../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export enum E_Scene {
    MENU = 'MENU',
    TEST = 'Test events',
    BACKGROUND = 'Test plugins',
    NULL = 'NULL'
}

export type IScenePool = { [sceneName: string]: IScene };
