import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {getCenterX, getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {HealthPlugin} from "../HLProgress/HealthPlugin";
import {ShotLightingPlugin} from "../ShotLighting/ShotLightingPlugin";

export class BulletPlugin extends AbstractActorPlugin {
    private damage: number = 0;
    private enemies: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private xSpeed = 15;
    private isPreliminaryDestroyed = false;
    private damagedEnemy: AbstractActor = <any>0;

    constructor(scene: AbstractScene, enemies: AbstractActor[], damage = 50) {
        super('BulletPlugin', scene);
        this.damage = damage;
        this.setEnemies(enemies);
    }

    onInit(): void {
        this.init();
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            if (!this.root || this.isPreliminaryDestroyed) {
                return;
            }
            this.root.xPos += this.xSpeed;
            if (this.root.xPos > this.scene.generalLayer.width) {
                this.scene.destroyActor(this.root);
            }
            this.damagedEnemy = this.getDamagedEnemy();
            if (this.damagedEnemy) {
                const health = <HealthPlugin>this.damagedEnemy.pluginDock.getPluginsFromRootName('HealthPlugin')[0];
                if (health) {
                    health.setDamage(this.damage);
                }
                this.handleDestroy();
            }
        });
    }

    private handleDestroy() {
        if (!this.isPreliminaryDestroyed) {
            this.isPreliminaryDestroyed = true;
            setTimeout(() => {
                if (!!this.scene) {
                    this.scene.destroyActor(this.root);
                }
            }, 100);
            if (this.root && !this.root.isDestroyed) {
                const lightPlugin = new ShotLightingPlugin(this.scene, true);
                this.root.pluginDock.add(lightPlugin);
            }
        }
    }

    private getDamagedEnemy(): AbstractActor {
        let enemy: AbstractActor = <any>0;
        if (this.enemies && this.enemies.length) {
            for (let i = 0; i < this.enemies.length; i++) {
                const actor = this.enemies[i];
                if (
                    !actor.isDestroyed &&
                    getCenterX(this.root.xPos, this.root.width) >= actor.xPos &&
                    getCenterX(this.root.xPos, this.root.width) <= actor.xPos + actor.width &&
                    getCenterY(this.root.yPos, this.root.height) >= actor.yPos &&
                    getCenterY(this.root.yPos, this.root.height) <= actor.yPos + actor.height
                ) {
                    enemy = actor;
                    break;
                }
            }
        }
        return enemy;
    }

    private init() {
        if (!this.enemies) {
            this.enemies = [];
        }
    }

    setEnemies(enemies: AbstractActor[]) {
        if (enemies && enemies.length) {
            this.enemies = enemies;
        }
    }

    unLink(): void {
        super.unLink();
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        this.enemies = <any>0;
        this.damage = <any>0;
        this.damagedEnemy = <any>0;
        super.destroy();
    }
}
