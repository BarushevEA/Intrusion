import {AbstractActorPlugin} from "../../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {ShotLighting} from "./Shot/ShotLighting";
import {ELayers} from "../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {PositionBalance} from "../../../AnimationCore/Libraries/PositionBalance";
import {ISubscriptionLike} from "../../../AnimationCore/Libraries/Observables/Types";
import {IActor} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export class ShotLightingPlugin extends AbstractActorPlugin {
    private shotLighting: IActor = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private positionBalance: PositionBalance = <any>0;
    private isOver = false;

    constructor(scene: IScene, isOver = false) {
        super('ShotLightingPlugin', scene);
        this.isOver = isOver;
    }

    onInit(): void {
        if (!this.scene || !this.scene.generalLayer) {
            return;
        }

        if (!this.shotLighting) {
            this.shotLighting = new ShotLighting(this.scene.generalLayer);
            this.shotLighting.isEventsBlock = true;
            this.positionBalance = new PositionBalance(this.root, this.shotLighting);
        }

        this.subscriber = this.scene.tickCount$.subscribe(() => {
            if (!!this.positionBalance) {
                this.positionBalance.handle(
                    this.root.width - 50,
                    Math.round(this.root.height / 2) - Math.round(this.shotLighting.height / 2));
            }

            if (!this.isUnlinked) {
                this.scene.setActiveLayer(ELayers.MIDDLE);
                this.scene.setActors(this.shotLighting);
                this.scene.setActorZIndex(this.shotLighting, this.root.z_index + (this.isOver ? 1 : -1));
            }
        });
    }

    unLink(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        if (this.scene && this.scene.unLink) {
            this.scene.unLink(this.shotLighting);
        }
        super.unLink();
    }

    destroy(): void {
        if (this.shotLighting) {
            this.scene.destroyActor(this.shotLighting);
            this.shotLighting = <any>0;
        }
        this.positionBalance = <any>0;
        super.destroy();
    }
}
