import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {Bullet} from "./Actors/Bullet";
import {BulletPlugin} from "./BulletPlugin";
import {getCenterY} from "../../../AnimationCore/Libraries/FunctionLibs";
import {LaserRed} from "./Actors/LaserRed";
import {LaserBlue} from "./Actors/LaserBlue";
import {LaserOrange} from "./Actors/LaserOrange";
import {tickGenerator} from "../../../AnimationCore/Libraries/TickGenerator";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observables/Types";

export class BulletShotPlugin extends AbstractActorPlugin {
    private enemies: AbstractActor[] = <any>0;
    private bulletGenerator: ISubscriptionLike = <any>0;
    private isReverse = <any>0;
    private type: BULLET = <any>0;
    private damagePerBullet = 0;

    constructor(scene: AbstractScene,
                enemies: AbstractActor[],
                type = BULLET.SMALL,
                isReverse = false,
                damagePerBullet = 50) {
        super('BulletShotPlugin', scene);
        this.setEnemies(enemies);
        this.isReverse = isReverse;
        this.type = type;
        this.damagePerBullet = damagePerBullet;
    }

    onInit(): void {
        if (!this.bulletGenerator) {
            this.bulletGenerator = tickGenerator.execute100MsInterval(() => {
                if (!this.isUnlinked) {
                    this.init();
                }
            }, 1);
        }
    }

    private init() {
        if (this.root.isUnlinked) {
            return;
        }
        const bullet = getBullet(this.type, this.scene);
        const plugin = new BulletPlugin(this.scene, this.enemies, this.isReverse, this.damagePerBullet);
        bullet.xPos = this.isReverse ? this.root.xPos : this.root.xPos + this.root.width;
        bullet.yPos = getCenterY(this.root.yPos, this.root.height) - Math.round(bullet.height / 2);
        bullet.isEventsBlock = true;
        this.scene.setActors(bullet);
        bullet.pluginDock.add(plugin);
    }

    setEnemies(enemies: AbstractActor[]) {
        if (enemies) {
            this.enemies = enemies;
        }
    }

    unLink(): void {
        super.unLink();
    }

    destroy(): void {
        if (this.bulletGenerator) {
            this.bulletGenerator.unsubscribe();
            this.bulletGenerator = <any>0;
        }
        this.enemies = <any>0;
        super.destroy();
    }
}

export enum BULLET {
    SMALL = 'SMALL',
    LASER_RED = 'LASER_RED',
    LASER_BLUE = 'LASER_BLUE',
    LASER_ORANGE = 'LASER_ORANGE',
}

function getBullet(type: BULLET, scene: AbstractScene): AbstractActor {
    switch (type) {
        case BULLET.SMALL:
            return new Bullet(scene.generalLayer);
        case BULLET.LASER_RED:
            return new LaserRed(scene.generalLayer);
        case BULLET.LASER_BLUE:
            return new LaserBlue(scene.generalLayer);
        case BULLET.LASER_ORANGE:
            return new LaserOrange(scene.generalLayer);
        default:
            return <any>0;
    }
}
