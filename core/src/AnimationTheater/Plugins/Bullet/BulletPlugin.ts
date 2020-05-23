import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {getCenterX, getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {HealthPlugin} from "../HLProgress/HealthPlugin";
import {ShotLightingPlugin} from "../ShotLighting/ShotLightingPlugin";
import {tickGenerator} from "../../../AnimationCore/Libraries/TickGenerator";

export class BulletPlugin extends AbstractActorPlugin {
    private damage: number = 0;
    private enemies: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private xSpeed = 15;
    private isDestroyProcessed = false;
    private damagedEnemy: AbstractActor = <any>0;
    private handleDestroyCounter = <any>0;

    constructor(scene: AbstractScene, enemies: AbstractActor[], isReverse = false, damage = 50) {
        super('BulletPlugin', scene);
        this.damage = damage;
        this.setEnemies(enemies);
        this.xSpeed *= isReverse ? -1 : 1;
    }

    onInit(): void {
        this.init();
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            if (!this.root || this.isDestroyProcessed) {
                return;
            }
            this.root.xPos += this.xSpeed;
            if (this.root.xPos > this.scene.generalLayer.width || this.root.xPos < 0) {
                this.scene.destroyActor(this.root);
            }
            this.damagedEnemy = this.getDamagedEnemy();
            if (this.damagedEnemy && this.damagedEnemy.pluginDock) {
                const health = <HealthPlugin>this.damagedEnemy.pluginDock.getPluginsFromRootName('HealthPlugin')[0];
                if (health) {
                    health.setDamage(this.damage);
                }
                this.handleDestroy();
            }
        });
    }

    private handleDestroy() {
        if (this.isDestroyProcessed) {
            return;
        }
        this.isDestroyProcessed = true;

        this.handleDestroyCounter = tickGenerator.executeTimeout(() => {
            if (!!this.scene) {
                this.scene.destroyActor(this.root);
            } else if (this.root && !this.root.isDestroyed) {
                this.root.destroy();
            }
        }, 100);

        if (this.root && !this.root.isDestroyed) {
            const lightPlugin = new ShotLightingPlugin(this.scene, true);
            this.root.pluginDock.add(lightPlugin);
        }
    }

    private getDamagedEnemy(): AbstractActor {
        let enemy: AbstractActor = <any>0;
        if (this.enemies && this.enemies.length) {
            for (let i = 0; i < this.enemies.length; i++) {
                const actor = this.enemies[i];
                if (
                    !actor.isDestroyed &&
                    !actor.isUnlinked &&
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
        if (enemies) {
            this.enemies = enemies;
        }
    }

    unLink(): void {
        tickGenerator.clearTimeout(this.handleDestroyCounter);
        this.handleDestroyCounter = <any>0;
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
