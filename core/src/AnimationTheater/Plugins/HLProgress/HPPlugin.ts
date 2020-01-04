import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {HLProgress} from "./HLProgress";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {PositionBalance} from "../../../AnimationCore/Libraries/PositionBalance";

export class HPPlugin extends AbstractActorPlugin {
    private health = 0;
    private currentHealth = 0;
    private progressBar: HLProgress = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private positionBalance: PositionBalance = <any>0;

    constructor(scene: AbstractScene, health = 1000) {
        super('HPPlugin', scene);
        this.health = health;
    }

    onInit(): void {
        this.init();
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            this.positionBalance.handle(0, -20);
        });
    }

    init() {
        this.currentHealth = this.health;
        if (!this.progressBar) {
            this.progressBar = new HLProgress(this.scene.generalLayer);
            this.positionBalance = new PositionBalance(this.root, this.progressBar);
            this.scene.setActors(this.progressBar);
        }
    }

    private updateProgress() {
        if (this.progressBar) {
            const progress = Math.round(this.currentHealth / this.health * 100);
            this.progressBar.setProgress(progress);
        }
    }

    setDamage(damage: number) {
        this.currentHealth -= damage;
        this.healthBalance();
        this.updateProgress();
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
            this.positionBalance = <any>0;
        }
        super.unLink();
    }

    destroy(): void {
        if (this.progressBar) {
            this.scene.destroyActor(this.progressBar);
            this.progressBar = <any>0;
        }
        super.destroy();
    }
}
