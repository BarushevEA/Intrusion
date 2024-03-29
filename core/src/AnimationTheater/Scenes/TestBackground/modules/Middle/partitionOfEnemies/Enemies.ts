import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {EnemySmall1} from "../../../../../AnimationModels/Planes/enemySmall1/EnemySmall1";
import {EnemySmall2} from "../../../../../AnimationModels/Planes/enemySmall2/EnemySmall2";
import {BounceOffTheWall} from "../../../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/BounceOffTheWall";
import {HealthPlugin} from "../../../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../../../Plugins/HLProgress/HealthType";
import {Enemy1} from "../../../../../AnimationModels/Planes/enemy1/Enemy1";
import {Enemy2} from "../../../../../AnimationModels/Planes/enemy2/Enemy2";
import {Enemy3} from "../../../../../AnimationModels/Planes/enemy3/Enemy3";
import {RectangleHighlighting} from "../../../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/RectangleHighlighting";
import {PointerAndDragCursorPlugin} from "../../../../../../AnimationCore/AnimationEngine/Plugins/keyPlugins/PointerAndDragCursorPlugin";
import {randomize} from "../../../../../../AnimationCore/Libraries/FunctionLibs";
import {SnakePlugin} from "../../../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/SnakePlugin/SnakePlugin";
import {KleschBoss} from "../../../../../AnimationModels/Planes/KleschBoss/KleschBoss";
import {BULLET, BulletShotPlugin} from "../../../../../Plugins/Bullet/BulletShotPlugin";
import {MiniBoss4} from "../../../../../AnimationModels/Planes/miniBoss4/MiniBoss4";
import {Enemy4} from "../../../../../AnimationModels/Planes/enemy4/Enemy4";
import {tickGenerator} from "../../../../../../AnimationCore/Libraries/TickGenerator";
import {EnemySmall3} from "../../../../../AnimationModels/Planes/enemySmall3/EnemySmall3";
import {Heart} from "../../../../../AnimationModels/Heart";
import {Link} from "../../../../../Plugins/Link";
import {HealsBuf} from "../../../../../Plugins/HLProgress/HealsBuf";
import {ISubscriptionLike} from "../../../../../../AnimationCore/Libraries/Observables/Types";
import {IActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let enemies: IActor[] = <any>0;
let enemies2: IActor[] = <any>0;
let enemies1: IActor[] = <any>0;
let enemiesMiniBosses: IActor[] = <any>0;
let generalBoss: IActor = <any>0;
let heroes: IActor[] = <any>0;
let intervalTimers: ISubscriptionLike[] = <any>0;

let simpleEnemyTimer = <any>0;
let boss1DestroyTimer = <any>0;
let boss2DestroyTimer = <any>0;
let bossActionsTimer = <any>0;
let genBossDestroyTimer = <any>0;

const numberOfSmallEnemies = 10;


function initSimpleEnemies(scene: IScene) {
    enemies2 = [];
    enemies1 = [];

    for (let i = 0; i < numberOfSmallEnemies; i++) {
        const isHalf = i < numberOfSmallEnemies / 2;
        const enemy1 = isHalf ? new EnemySmall1(scene.generalLayer) : new Enemy4(scene.generalLayer);
        addActor(enemy1, scene);
        enemies1.push(enemy1);
        enemy1.xPos = scene.generalLayer.width + 5 * enemy1.width;
        enemy1.yPos = randomize(scene.generalLayer.height - enemy1.height);

        const enemy2 = isHalf ? new EnemySmall2(scene.generalLayer) : new EnemySmall3(scene.generalLayer);
        addActor(enemy2, scene);
        enemies2.push(enemy2);
        enemy2.xPos = scene.generalLayer.width + 5 * enemy2.width;
        enemy2.yPos = randomize(scene.generalLayer.height - enemy2.height);
    }
}

function initSimpleEnemiesActions(scene: IScene) {
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

    simpleEnemyTimer = tickGenerator.executeTimeout(() => {
        if (scene.isDestroyed) {
            return;
        }
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


function initBosses(scene: IScene) {
    initMiniBosses(scene);
    initGeneralBosses(scene);
}

function initMiniBosses(scene: IScene) {
    enemiesMiniBosses = [];

    const miniBossActivate = (miniBoss: IActor) => {
        miniBoss.xPos = scene.generalLayer.width + 3 * miniBoss.width;
        miniBoss.yPos = randomize(scene.generalLayer.height - miniBoss.height);
        enemiesMiniBosses.push(miniBoss);
    };

    const miniBoss0 = new MiniBoss4(scene.generalLayer);
    miniBossActivate(miniBoss0);

    const miniBoss1 = new Enemy1(scene.generalLayer);
    miniBossActivate(miniBoss1);

    const miniBoss2 = new Enemy2(scene.generalLayer);
    miniBossActivate(miniBoss2);

    const miniBoss21 = new Enemy2(scene.generalLayer);
    miniBossActivate(miniBoss21);

    const miniBoss3 = new Enemy3(scene.generalLayer);
    miniBossActivate(miniBoss3);
}

function initGeneralBosses(scene: IScene) {
    generalBoss = new KleschBoss(scene.generalLayer);
    generalBoss.xPos = scene.generalLayer.width + 2 * generalBoss.width;
    generalBoss.yPos = randomize(scene.generalLayer.height - generalBoss.height);
}

function initBossesActions(scene: IScene) {
    boss1DestroyTimer = tickGenerator.executeTimeout(() => {
        if (scene.isDestroyed) {
            return;
        }
        initMiniBossesActions(scene);
    }, 30000);
    boss2DestroyTimer = tickGenerator.executeTimeout(() => {
        if (scene.isDestroyed) {
            return;
        }
        initGeneralBossesActions(scene);
    }, 40000);
}

function initMiniBossesActions(scene: IScene) {
    for (let i = 0; i < enemiesMiniBosses.length; i++) {
        const miniBoss = enemiesMiniBosses[i];
        const bounce = new BounceOffTheWall(
            scene,
            Math.round(scene.generalLayer.width / 3),
            true,
            randomize(5000) + 1000);
        const health = new HealthPlugin(scene, HealthType.ENEMY_MINI_BOSS);
        const heart = new Heart(scene.generalLayer);
        const healthBuf = new HealsBuf(scene, heroes);
        const link = new Link(scene);
        link.setActorToLink(heart);
        miniBoss.pluginDock.add(link);
        heart.disableEvents();

        scene.collect(
            link.setToBottom$.subscribe(() => {
                link.destroy();
                scene.destroyActor(heart);
            }),
            health.beforeDeath$.subscribe(() => {
                scene.setActors(heart);
                miniBoss.pluginDock.unLink(link);
                heart.pluginDock.add(healthBuf);
            })
        );

        miniBoss.pluginDock.add(bounce);
        miniBoss.pluginDock.add(health);
        addActor(miniBoss, scene, HealthType.ENEMY_MINI_BOSS);
        miniBoss.isEventsBlock = true;
        if (i >= (enemiesMiniBosses.length - 2)) {
            bossActionsTimer = tickGenerator.executeTimeout(() => {
                if (scene.isDestroyed) {
                    return;
                }
                scene.setActors(miniBoss);
            }, 15000);
        } else {
            scene.setActors(miniBoss);
        }
    }
}

function initGeneralBossesActions(scene: IScene) {
    if (scene.isDestroyed) {
        return;
    }
    const highlighting = new RectangleHighlighting(scene);
    const cursorBehavior = new PointerAndDragCursorPlugin(scene);
    const bounce = new BounceOffTheWall(
        scene,
        0,
        true,
        3000,
        3,
        5,
        1);
    const health = new HealthPlugin(scene, HealthType.ENEMY_BOSS, 5000);
    scene.setActors(generalBoss);
    scene.moveOnMouseDrag(generalBoss);
    addActor(generalBoss, scene, HealthType.ENEMY_BOSS);
    generalBoss.pluginDock.add(health);
    generalBoss.pluginDock.add(highlighting);
    generalBoss.pluginDock.add(bounce);
    generalBoss.pluginDock.add(cursorBehavior);
    generalBoss.enableEvents();
    scene.collect(
        generalBoss.onMouseOver$.subscribe(() => {
            generalBoss.pluginDock.unLink(bounce);
            generalBoss.pluginDock.add(bounce);
        }),
        generalBoss.onDestroyed$.subscribe(() => {
            genBossDestroyTimer = tickGenerator.executeTimeout(() => {
                scene.destroy();
            }, 2000);
        })
    );
}

function addActor(actor: IActor, scene: IScene, type = HealthType.ENEMY): void {
    enemies.push(actor);
    actor.disableEvents();
    let delay = 0;
    let duration = 0;
    let damage = 0;
    let laserType = <any>0;

    switch (type) {
        case HealthType.ENEMY:
            delay = 10 + randomize(10);
            duration = 50;
            damage = 50;
            laserType = BULLET.LASER_RED;
            break;
        case HealthType.ENEMY_MINI_BOSS:
            delay = 5 + randomize(5);
            duration = 150;
            damage = 300;
            laserType = BULLET.LASER_BLUE;
            break;
        case HealthType.ENEMY_BOSS:
            delay = 3;
            duration = 250;
            damage = 400;
            laserType = BULLET.LASER_ORANGE;
            break;
    }

    const bulletShot = new BulletShotPlugin(
        scene,
        heroes,
        laserType,
        true,
        damage);
    const timer = tickGenerator.execute100MsInterval(() => {
        if (actor && !actor.isDestroyed) {
            actor.pluginDock.add(bulletShot);
        } else {
            timer.unsubscribe();
        }
        tickGenerator.executeTimeout(() => {
            if (actor && !actor.isDestroyed) {
                actor.pluginDock.unLink(bulletShot);
            }
        }, duration);
    }, delay);
    intervalTimers.push(timer);
}

class EnemiesPool extends AbstractActorGroup {
    private timer: ISubscriptionLike = <any>0;

    set heroes(values: IActor[]) {
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            heroes.push(value);
        }
    }

    initActors(scene: IScene): void {
        enemies = [];
        heroes = [];
        intervalTimers = [];
        initSimpleEnemies(scene);
        initBosses(scene);
    }

    initActions(scene: IScene): void {
        initSimpleEnemiesActions(scene);
        initBossesActions(scene);
        this.handleClearEnemies();
    }

    private handleClearEnemies() {
        this.timer = tickGenerator.executeSecondInterval(() => {
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
        }, 5);
    }

    get enemies(): IActor[] {
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
        if (this.timer && this.timer.unsubscribe) {
            this.timer.unsubscribe();
        }
        if (intervalTimers && intervalTimers.length) {
            for (let i = 0; i < intervalTimers.length; i++) {
                const timer = intervalTimers[i];
                timer.unsubscribe();
            }
            intervalTimers.length = 0;
            intervalTimers = <any>0;
        }
        tickGenerator.clearTimeout(simpleEnemyTimer);
        tickGenerator.clearTimeout(boss1DestroyTimer);
        tickGenerator.clearTimeout(boss2DestroyTimer);
        tickGenerator.clearTimeout(bossActionsTimer);
        tickGenerator.clearTimeout(genBossDestroyTimer);

        simpleEnemyTimer = <any>0;
        boss1DestroyTimer = <any>0;
        boss2DestroyTimer = <any>0;
        bossActionsTimer = <any>0;
        genBossDestroyTimer = <any>0;
    }
}

export const enemiesPool = new EnemiesPool();
