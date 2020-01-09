import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {AbstractScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {EnemySmall1} from "../../../../../AnimationModels/Planes/enemySmall1/EnemySmall1";
import {EnemySmall2} from "../../../../../AnimationModels/Planes/enemySmall2/EnemySmall2";
import {BounceOffTheWall} from "../../../../../Plugins/BounceOffTheWall";
import {HealthPlugin} from "../../../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../../../Plugins/HLProgress/HealthType";
import {Enemy1} from "../../../../../AnimationModels/Planes/enemy1/Enemy1";
import {Enemy2} from "../../../../../AnimationModels/Planes/enemy2/Enemy2";
import {Enemy3} from "../../../../../AnimationModels/Planes/enemy3/Enemy3";
import {FatherFrost} from "../../../../../AnimationModels/FatherFrost/FatherFrost";
import {RectangleHighlighting} from "../../../../../Plugins/RectangleHighlighting";
import {PointerAndDragCursorPlugin} from "../../../../../Plugins/PointerAndDragCursorPlugin";
import {randomize} from "../../../../../../AnimationCore/Libraries/FunctionLibs";

let enemies: AbstractActor[] = <any>0;
let enemiesMiniBosses: AbstractActor[] = <any>0;
let generalBoss: AbstractActor = <any>0;


function initSimpleEnemies(scene: AbstractScene) {
    for (let i = 0; i < 7; i++) {
        const enemy1 = new EnemySmall1(scene.generalLayer);
        enemies.push(enemy1);
        enemy1.xPos = scene.generalLayer.width + 5 * enemy1.width;
        enemy1.yPos = randomize(scene.generalLayer.height - enemy1.height);

        const enemy2 = new EnemySmall2(scene.generalLayer);
        enemies.push(enemy2);
        enemy2.xPos = scene.generalLayer.width + 5 * enemy2.width;
        enemy2.yPos = randomize(scene.generalLayer.height - enemy2.height);
    }
}

function initSimpleEnemiesActions(scene: AbstractScene) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const bounce = new BounceOffTheWall(scene, Math.round(scene.generalLayer.width / 3));
        const health = new HealthPlugin(scene, HealthType.NONE, 200);
        scene.setActors(enemy);
        enemy.pluginDock.add(bounce);
        enemy.pluginDock.add(health);
        enemy.isEventsBlock = true;
    }
}


function initBosses(scene: AbstractScene) {
    initMiniBosses(scene);
    initGeneralBosses(scene);
}

function initMiniBosses(scene: AbstractScene) {
    enemiesMiniBosses = [];

    const miniBossActivate = (miniBoss: AbstractActor) => {
        miniBoss.xPos = scene.generalLayer.width + 3 * miniBoss.width;
        miniBoss.yPos = randomize(scene.generalLayer.height - miniBoss.height);
        enemiesMiniBosses.push(miniBoss);
    };

    const miniBoss1 = new Enemy1(scene.generalLayer);
    miniBossActivate(miniBoss1);

    const miniBoss2 = new Enemy2(scene.generalLayer);
    miniBossActivate(miniBoss2);

    const miniBoss3 = new Enemy3(scene.generalLayer);
    miniBossActivate(miniBoss3);
}

function initGeneralBosses(scene: AbstractScene) {
    generalBoss = new FatherFrost(scene.generalLayer);
    generalBoss.xPos = scene.generalLayer.width + 2 * generalBoss.width;
    generalBoss.yPos = randomize(scene.generalLayer.height - generalBoss.height);
}

function initBossesActions(scene: AbstractScene) {
    setTimeout(() => {
        initMiniBossesActions(scene);
    }, 10000);
    setTimeout(() => {
        initGeneralBossesActions(scene);
    }, 20000);
}

function initMiniBossesActions(scene: AbstractScene) {
    for (let i = 0; i < enemiesMiniBosses.length; i++) {
        const miniBoss = enemiesMiniBosses[i];
        const bounce = new BounceOffTheWall(scene, Math.round(scene.generalLayer.width / 3));
        const health = new HealthPlugin(scene);
        scene.setActors(miniBoss);
        miniBoss.pluginDock.add(bounce);
        miniBoss.pluginDock.add(health);
        enemies.push(miniBoss);
        miniBoss.isEventsBlock = true;
    }
}

function initGeneralBossesActions(scene: AbstractScene) {
    const highlighting = new RectangleHighlighting(scene);
    const cursorBehavior = new PointerAndDragCursorPlugin(scene);
    const bounce = new BounceOffTheWall(scene);
    const health = new HealthPlugin(scene, HealthType.ENEMY_BOSS, 5000);
    scene.setActors(generalBoss);
    scene.moveOnMouseDrag(generalBoss);
    enemies.push(generalBoss);
    generalBoss.pluginDock.add(health);
    generalBoss.pluginDock.add(highlighting);
    generalBoss.pluginDock.add(bounce);
    generalBoss.pluginDock.add(cursorBehavior);
    generalBoss.enableEvents();
    scene.collect(
        generalBoss.isMouseOver$.subscribe(() => {
            generalBoss.pluginDock.unLink(bounce);
            generalBoss.pluginDock.add(bounce);
        }),
        generalBoss.isDestroyed$.subscribe(() => {
            scene.destroy();
        })
    );
}

class Enemies extends AbstractActorGroup {
    private timer = 0;

    initActors(scene: AbstractScene): void {
        enemies = [];
        initSimpleEnemies(scene);
        initBosses(scene);
    }

    initActions(scene: AbstractScene): void {
        initSimpleEnemiesActions(scene);
        initBossesActions(scene);
        this.handleClearEnemies();
    }

    private handleClearEnemies() {
        this.timer = setInterval(() => {
            let tmp = [];
            let length = enemies.length;
            for (let i = 0; i < length; i++) {
                const enemy = enemies.pop();
                if (enemy && !enemy.isDestroyed) {
                    tmp.push(enemy);
                }
            }
            length = tmp.length;
            for (let i = 0; i < length; i++) {
                const actor = tmp.pop();
                if (!!actor) {
                    enemies.push(actor);
                }
            }
        }, 5000);
    }

    get enemies(): AbstractActor[] {
        return enemies;
    }

    destroy(): void {
        if (!!enemies) {
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                enemy.destroy();
            }
            enemies = <any>0;
        }
        enemiesMiniBosses = <any>0;
        generalBoss = <any>0;
        clearInterval(this.timer);
    }
}

export const enemiesPool = new Enemies();
