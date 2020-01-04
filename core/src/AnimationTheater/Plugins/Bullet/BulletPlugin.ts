import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {HealthPlugin} from "../HLProgress/HealthPlugin";

export class BulletPlugin extends AbstractActorPlugin {
    private damage: number = 0;
    private enemies: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;

    constructor(scene: AbstractScene, damage = 50) {
        super('BulletPlugin', scene);
        this.damage = damage;
    }

    onInit(): void {
        this.init();
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            const enemy = this.getDamagedEnemy();
            if (enemy) {
                const health = <HealthPlugin>enemy.pluginDock.getPluginsFromRootName('HealthPlugin')[0];
                if (health) {
                    health.setDamage(this.damage);
                }
                this.scene.destroyActor(this.root);
            }
        });
    }

    private getDamagedEnemy(): AbstractActor {
        let enemy: AbstractActor = <any>0;
        if (this.enemies && this.enemies.length) {
            for (let i = 0; i < this.enemies.length; i++) {
                const actor = this.enemies[i];
                if (
                    this.root.xPos + this.root.width >= actor.xPos &&
                    this.root.xPos + this.root.width >= actor.xPos + actor.width &&
                    getCenterY(this.root.yPos, this.root.height) >= actor.yPos &&
                    getCenterY(this.root.yPos, this.root.height) >= actor.yPos + actor.height
                ) {
                    enemy = actor;
                    break;
                }
            }
        }
        return enemy;
    }

    private init() {
        this.enemies = [];
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
        super.destroy();
    }
}
