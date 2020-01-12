import {AbstractScene} from "../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {decoration} from "./partitionOfDecoration/Decoration";
import {heroesPool} from "./partitionOfHeroes/HeroesPool";
import {enemiesPool} from "./partitionOfEnemies/Enemies";

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    decoration.destroy();
    enemiesPool.destroy();
    heroesPool.destroy();
}

function initActors(scene: AbstractScene) {
    decoration.initActors(scene);
    enemiesPool.initActors(scene);
    heroesPool.initActors(scene);
}

function initActions(scene: AbstractScene) {
    heroesPool.enemies = enemiesPool.enemies;
    enemiesPool.heroes = heroesPool.heroes;

    decoration.initActions(scene);
    enemiesPool.initActions(scene);
    heroesPool.initActions(scene);
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
