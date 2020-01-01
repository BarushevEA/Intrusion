import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {HLProgress} from "./HLProgress";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";

export class HPPlugin extends AbstractActorPlugin {
    private health = 0;
    private currentHealth = 0;
    private progressBar: HLProgress = <any>0;
    private subscriber: ISubscriptionLike = <any>0;

    constructor(scene: AbstractScene) {
        super('HPPlugin', scene);
    }

    onInit(): void {
        this.init();
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            this.progressBar.xPos = this.root.xPos;
            this.progressBar.yPos = this.root.yPos;
        });
    }

    init() {
        this.health = 1000;
        this.currentHealth = this.health;
        if (!this.progressBar) {
            this.progressBar = new HLProgress(this.scene.generalLayer);
            this.scene.setActors(this.progressBar);
        }
    }

    private updateProgress() {
        if (this.progressBar) {
            const progress = Math.round(this.currentHealth / this.health) * 100;
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
