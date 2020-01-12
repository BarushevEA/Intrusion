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
import {RectangleHighlighting} from "../../../../../Plugins/RectangleHighlighting";
import {PointerAndDragCursorPlugin} from "../../../../../Plugins/PointerAndDragCursorPlugin";
import {randomize} from "../../../../../../AnimationCore/Libraries/FunctionLibs";
import {SnakePlugin} from "../../../../../Plugins/SnakePlugin/SnakePlugin";
import {KleschBoss} from "../../../../../AnimationModels/KleschBoss/KleschBoss";
import {BULLET, BulletShotPlugin} from "../../../../../Plugins/Bullet/BulletShotPlugin";

let enemies: AbstractActor[] = <any>0;
let enemies2: AbstractActor[] = <any>0;
let enemies1: AbstractActor[] = <any>0;
let enemiesMiniBosses: AbstractActor[] = <any>0;
let generalBoss: AbstractActor = <any>0;
let heroes: AbstractActor[] = <any>0;
let intervalTimers: number[] = <any>0;


function initSimpleEnemies(scene: AbstractScene) {
    enemies2 = [];
    enemies1 = [];

    for (let i = 0; i < 10; i++) {
        const enemy1 = new EnemySmall1(scene.generalLayer);
        addActor(enemy1, scene);
        enemies1.push(enemy1);
        enemy1.xPos = scene.generalLayer.width + 5 * enemy1.width;
        enemy1.yPos = randomize(scene.generalLayer.height - enemy1.height);

        const enemy2 = new EnemySmall2(scene.generalLayer);
        addActor(enemy2, scene);
        enemies2.push(enemy2);
        enemy2.xPos = scene.generalLayer.width + 5 * enemy2.width;
        enemy2.yPos = randomize(scene.generalLayer.height - enemy2.height);
    }
}

function initSimpleEnemiesActions(scene: AbstractScene) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const health = new HealthPlugin(scene, HealthType.ENEMY, 200);
        enemy.pluginDock.add(health);
        enemy.isEventsBlock = true;
    }

    const bounce = new BounceOffTheWall(
        scene,
        Math.round(scene.generalLayer.width / 3),
        true,
        randomize(8000) + 2000);
    const snake = new SnakePlugin(scene, [bounce], 20);
    for (let i = 0; i < enemies1.length / 2; i++) {
        const enemy1 = enemies1[i];
        scene.setActors(enemy1);
        enemy1.pluginDock.add(snake);
    }

    const bounce1 = new BounceOffTheWall(
        scene,
        Math.round(scene.generalLayer.width / 3),
        true,
        randomize(8000) + 2000);
    const snake1 = new SnakePlugin(scene, [bounce1], 20);
    for (let i = enemies1.length / 2; i < enemies1.length; i++) {
        const enemy1 = enemies1[i];
        scene.setActors(enemy1);
        enemy1.pluginDock.add(snake1);
    }

    setTimeout(() => {
        const bounce = new BounceOffTheWall(
            scene, Math.round(scene.generalLayer.width / 5),
            true);
        const snake = new SnakePlugin(scene, [bounce]);
        for (let i = 0; i < enemies2.length / 2; i++) {
            const enemy2 = enemies2[i];
            scene.setActors(enemy2);
            enemy2.pluginDock.add(snake);
        }

        const bounce1 = new BounceOffTheWall(
            scene, Math.round(scene.generalLayer.width / 5),
            true);
        const snake1 = new SnakePlugin(scene, [bounce1]);
        for (let i = enemies2.length / 2; i < enemies2.length; i++) {
            const enemy2 = enemies2[i];
            scene.setActors(enemy2);
            enemy2.pluginDock.add(snake1);
        }
    }, 10000);
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
    generalBoss = new KleschBoss(scene.generalLayer);
    generalBoss.xPos = scene.generalLayer.width + 2 * generalBoss.width;
    generalBoss.yPos = randomize(scene.generalLayer.height - generalBoss.height);
}

function initBossesActions(scene: AbstractScene) {
    setTimeout(() => {
        initMiniBossesActions(scene);
    }, 30000);
    setTimeout(() => {
        initGeneralBossesActions(scene);
    }, 40000);
}

function initMiniBossesActions(scene: AbstractScene) {
    for (let i = 0; i < enemiesMiniBosses.length; i++) {
        const miniBoss = enemiesMiniBosses[i];
        const bounce = new BounceOffTheWall(
            scene,
            Math.round(scene.generalLayer.width / 3),
            true,
            randomize(5000) + 1000);
        const health = new HealthPlugin(scene, HealthType.ENEMY_MINI_BOSS);
        scene.setActors(miniBoss);
        miniBoss.pluginDock.add(bounce);
        miniBoss.pluginDock.add(health);
        addActor(miniBoss, scene);
        miniBoss.isEventsBlock = true;
    }
}

function initGeneralBossesActions(scene: AbstractScene) {
    const highlighting = new RectangleHighlighting(scene);
    const cursorBehavior = new PointerAndDragCursorPlugin(scene);
    const bounce = new BounceOffTheWall(
        scene,
        0,
        true,
        5000,
        1,
        5,
        1);
    const health = new HealthPlugin(scene, HealthType.ENEMY_BOSS, 5000);
    scene.setActors(generalBoss);
    scene.moveOnMouseDrag(generalBoss);
    addActor(generalBoss, scene);
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
            setTimeout(() => {
                scene.destroy();
            }, 2000);
        })
    );
}

function addActor(actor: AbstractActor, scene: AbstractScene): void {
    enemies.push(actor);
    const bulletShot = new BulletShotPlugin(
        scene,
        heroes,
        BULLET.LASER_RED,
        true);
    const timer = setInterval(() => {
        if (actor && !actor.isDestroyed) {
            actor.pluginDock.add(bulletShot);
        } else {
            clearInterval(timer);
        }
        setTimeout(() => {
            if (actor && !actor.isDestroyed) {
                actor.pluginDock.unLink(bulletShot);
            }
        }, 100);
    }, 2000 + randomize(5000));
    intervalTimers.push(timer);
}

class EnemiesPool extends AbstractActorGroup {
    private timer = 0;

    set heroes(values: AbstractActor[]) {
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            heroes.push(value);
        }
    }

    initActors(scene: AbstractScene): void {
        enemies = [];
        heroes = [];
        intervalTimers = [];
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
        if (!!enemies1) {
            enemies1.length = 0;
            enemies1 = <any>0;
        }
        if (!!enemies2) {
            enemies2.length = 0;
            enemies2 = <any>0;
        }
        if (!!enemiesMiniBosses) {
            enemiesMiniBosses.length = 0;
            enemiesMiniBosses = <any>0;
        }
        if (!!heroes) {
            heroes.length = 0;
            heroes = <any>0;
        }
        generalBoss = <any>0;
        clearInterval(this.timer);
        if (intervalTimers && intervalTimers.length) {
            for (let i = 0; i < intervalTimers.length; i++) {
                const timer = intervalTimers[i];
                clearInterval(timer);
            }
            intervalTimers.length = 0;
            intervalTimers = <any>0;
        }
    }
}

export const enemiesPool = new EnemiesPool();
