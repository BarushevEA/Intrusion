import {ELayers} from "../../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {decoration} from "./partitionOfDecoration/Decoration";
import {heroesPool} from "./partitionOfHeroes/HeroesPool";
import {enemiesPool} from "./partitionOfEnemies/Enemies";
import {clearOnSceneDestroy} from "../../../../../AnimationCore/Libraries/Actions";
import {IScene} from "../../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export function handleMiddle(scene: IScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    decoration.destroy();
    enemiesPool.destroy();
    heroesPool.destroy();
}

function initActors(scene: IScene) {
    clearVariables();
    decoration.initActors(scene);
    enemiesPool.initActors(scene);
    heroesPool.initActors(scene);
}

function initActions(scene: IScene) {
    heroesPool.enemies = enemiesPool.enemies;
    enemiesPool.heroes = heroesPool.heroes;

    decoration.initActions(scene);
    enemiesPool.initActions(scene);
    heroesPool.initActions(scene);
    clearOnSceneDestroy(scene, clearVariables);
}
