import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {Bullet} from "./Actors/Bullet";
import {BulletPlugin} from "./BulletPlugin";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";

export class BulletShotPlugin extends AbstractActorPlugin {
    private enemies: AbstractActor[] = <any>0;
    private bulletGenerator = <any>0;

    constructor(scene: AbstractScene, enemies: AbstractActor[]) {
        super('BulletShotPlugin', scene);
        this.setEnemies(enemies);
    }

    onInit(): void {
        if (!this.bulletGenerator) {
            this.bulletGenerator = setInterval(() => {
                if (!this.isUnlinked) {
                    this.init();
                }
            }, 100);
        }
    }

    private init() {
        const bullet = new Bullet(this.scene.generalLayer);
        const plugin = new BulletPlugin(this.scene, this.enemies);
        bullet.xPos = this.root.xPos + this.root.width;
        bullet.yPos = getCenterY(this.root.yPos, this.root.height) - Math.round(bullet.height / 2);
        this.scene.setActors(bullet);
        bullet.pluginDock.add(plugin);
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
        if (this.bulletGenerator) {
            clearInterval(this.bulletGenerator);
        }
        this.bulletGenerator = <any>0;
        this.enemies = <any>0;
        super.destroy();
    }
}
