import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {EnemyProgress} from "./Progresses/EnemyProgress";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {PositionBalance} from "../../../AnimationCore/Libraries/PositionBalance";
import {getCenterX, getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {HealthType, IHealthProgress} from "./HealthType";
import {EnemyBossProgress} from "./Progresses/EnemyBossProgress";
import {HeroProgress} from "./Progresses/HeroProgress";
import {EnemyMiniBossProgress} from "./Progresses/EnemyMiniBossProgress";
import {Explode} from "../../AnimationModels/Explode/Explode";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {tickGenerator} from "../../../AnimationCore/Store/TickGenerator";

export class HealthPlugin extends AbstractActorPlugin {
    private health = 0;
    private currentHealth = 0;
    private progressBar: IHealthProgress = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private positionBalance: PositionBalance = <any>0;
    private type: HealthType = <any>0;
    private isDestroyProcessed = false;

    constructor(scene: AbstractScene, viewType = HealthType.ENEMY, health = 1000) {
        super('HealthPlugin', scene);
        this.health = health;
        this.type = viewType;
    }

    onInit(): void {
        this.init();
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            if (!!this.positionBalance) {
                this.positionBalance.handle(
                    getCenterX(0, this.root.width) - getCenterX(0, this.progressBar.width),
                    -10);
            }
        });
    }

    init() {
        this.currentHealth = this.health;
        if (!this.progressBar) {
            this.setProgressBar();
        }
    }

    private setProgressBar() {
        if (!!this.progressBar) {
            return;
        }
        const space = 10;
        switch (this.type) {
            case HealthType.HERO:
                this.progressBar = new HeroProgress(this.scene.generalLayer);
                this.progressBar.xPos = space * 10;
                this.progressBar.yPos = space;
                this.addProgressToScene(this.root.z_index + 1);
                break;
            case HealthType.ENEMY:
                if (this.currentHealth < this.health) {
                    this.progressBar = new EnemyProgress(this.scene.generalLayer);
                    this.positionBalance = new PositionBalance(this.root, this.progressBar);
                    this.addProgressToScene(this.root.z_index);
                }
                break;
            case HealthType.ENEMY_MINI_BOSS:
                if (this.currentHealth < this.health) {
                    this.progressBar = new EnemyMiniBossProgress(this.scene.generalLayer);
                    this.positionBalance = new PositionBalance(this.root, this.progressBar);
                    this.addProgressToScene(this.root.z_index);
                }
                break;
            case HealthType.ENEMY_BOSS:
                this.progressBar = new EnemyBossProgress(this.scene.generalLayer);
                this.progressBar.xPos = this.scene.generalLayer.width - this.progressBar.width - space * 10;
                this.progressBar.yPos = space;
                this.addProgressToScene(this.root.z_index + 1);
                break;
            case HealthType.NONE:
                this.progressBar = <any>0;
                break;
        }
        if (this.progressBar) {
            this.progressBar.isEventsBlock = true;
        }
    }

    private addProgressToScene(zIndex: number): void {
        this.scene.setActors(this.progressBar);
        this.scene.setActorZIndex(this.progressBar, zIndex);
    }

    private updateProgress() {
        this.setProgressBar();
        if (!!this.progressBar) {
            const progress = Math.round(this.currentHealth / this.health * 100);
            this.progressBar.setProgress(progress);
        }
    }

    setDamage(damage: number) {
        this.currentHealth -= damage;
        this.healthBalance();
        this.updateProgress();
        if (this.currentHealth <= 0) {
            this.handleDestroy();
        }
    }

    private handleDestroy() {
        if (this.isDestroyProcessed || !this.scene) {
            return;
        }
        this.isDestroyProcessed = true;

        if (this.progressBar) {
            this.scene.unLink(this.progressBar);
        }

        const explosions: AbstractActor[] = [];
        let explodeCount = 0;

        switch (this.type) {
            case HealthType.ENEMY:
                explodeCount = 1;
                break;
            case HealthType.ENEMY_MINI_BOSS:
                explodeCount = 5;
                break;
            case HealthType.ENEMY_BOSS:
                explodeCount = 20;
                break;
            case HealthType.HERO:
                explodeCount = 10;
                break;
        }

        for (let i = 0; i < explodeCount; i++) {
            const explosion = new Explode(this.scene.generalLayer);
            explosion.isEventsBlock = true;
            explosions.push(explosion);
        }

        this.handleExplode(explosions, this.scene);
    }

    private handleExplode(explosions: AbstractActor[], scene: AbstractScene) {
        this.explodeShow(explosions, 0, scene);
        let counter = 1;
        const timer = setInterval(() => {
            if (counter >= explosions.length) {
                clearInterval(timer);
            }
            this.explodeShow(explosions, counter, scene);
            counter++;
        }, 100);
        scene.unLink(this.root);
        tickGenerator.executeTimeout(() => {
            for (let i = 0; i < explosions.length; i++) {
                const explosion = explosions[i];
                scene.destroyActor(explosion);
            }
            scene.destroyActor(this.root);
        }, 340 + (explosions.length - 1) * 100);
    }

    private explodeShow(explosions: AbstractActor[], counter: number, scene: AbstractScene) {
        if (!this.root || !explosions || !explosions.length) {
            return;
        }
        const explosion = explosions[counter];
        if (!explosion) {
            return;
        }
        explosion.xPos = this.root.xPos + getCenterX(0, this.root.width) - Math.round(explosion.width / 2);
        explosion.yPos = this.root.yPos + getCenterY(0, this.root.height) - Math.round(explosion.height / 2);
        if (scene && scene.setActors) {
            scene.setActors(explosions[counter]);
        }
    }

    upgradeMaxHealth(health: number) {
        this.health = health;
        this.healthBalance();
    }

    upgradeCurrentHealth(health: number) {
        this.currentHealth += health;
        this.healthBalance();
    }

    private healthBalance() {
        if (this.currentHealth > this.health) {
            this.currentHealth = this.health;
        }
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
    }

    unLink(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        super.unLink();
    }

    destroy(): void {
        if (this.progressBar) {
            this.scene.destroyActor(this.progressBar);
            this.progressBar = <any>0;
        }
        this.positionBalance = <any>0;
        this.type = <any>0;
        super.destroy();
    }
}
