import {AbstractScene} from "../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {decoration} from "./partitionOfDecoration/Decoration";
import {heroes} from "./partitionOfHeroes/Heroes";
import {enemiesPool} from "./partitionOfEnemies/Enemies";

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    decoration.destroy();
    enemiesPool.destroy();
    heroes.destroy();
}

function initActors(scene: AbstractScene) {
    decoration.initActors(scene);
    enemiesPool.initActors(scene);
    heroes.initActors(scene);
}

function initActions(scene: AbstractScene) {
    decoration.initActions(scene);
    enemiesPool.initActions(scene);
    heroes.enemies = enemiesPool.enemies;
    heroes.initActions(scene);
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}
