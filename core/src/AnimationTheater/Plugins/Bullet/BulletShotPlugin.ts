import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observable";
import {Bullet} from "./Actors/Bullet";
import {BulletPlugin} from "./BulletPlugin";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";

export class BulletShotPlugin extends AbstractActorPlugin {
    private enemies: AbstractActor[] = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private bullet: Bullet = <any>0;

    constructor(scene: AbstractScene, enemies: AbstractActor[]) {
        super('BulletShotPlugin', scene);
        this.setEnemies(enemies);
    }

    onInit(): void {
        this.init();
    }

    private init() {
        this.bullet = new Bullet(this.scene.generalLayer);
        const plugin = new BulletPlugin(this.scene, this.enemies);
        this.bullet.xPos = this.root.xPos + this.root.width;
        this.bullet.yPos = getCenterY(this.root.yPos, this.root.height) - Math.round(this.bullet.height / 2);
        this.scene.setActors(this.bullet);
        this.bullet.pluginDock.add(plugin);
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
        super.destroy();
    }
}
