import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {getCenterX, getCenterY} from "../../AnimationCore/Libraries/FunctionLibs";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observables/Types";
import {IActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

export class PolygonWeb extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private rootPool: IActor[] = [];
    private bgColor = '';
    private bdColor = '';

    constructor(scene: IScene, backgroundColor: string, borderColor: string) {
        super('PolygonWeb', scene);
        this.bgColor = backgroundColor;
        this.bdColor = borderColor;
    }

    onInit(root: IActor): void {
        this.rootPool.push(root);
        this.init();
    }

    init() {
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            const shape = this.rootPool[0].shape;
            const x0 = getCenterX(
                this.rootPool[0].xPos,
                this.rootPool[0].width);
            const y0 = getCenterY(
                this.rootPool[0].yPos,
                this.rootPool[0].height);
            if (this.rootPool.length < 2) {
                shape.colors(this.bgColor, this.bdColor)
                    .lineWidth(2);
            } else {
                const x1 = getCenterX(
                    this.rootPool[1].xPos,
                    this.rootPool[1].width);
                const y1 = getCenterY(
                    this.rootPool[1].yPos,
                    this.rootPool[1].height);
                shape
                    .colors(this.bgColor, this.bdColor)
                    .lineWidth(0)
                    .linearGradient()
                    .setGradientDirectionPoints(x0, y0, x1, y1)
                    .addColorStop(0, 'rgba(0,0,0,0.2)')
                    .addColorStop(0.1, this.bgColor)
                    .addColorStop(0.9, 'rgba(0,0,0,0)')
                    .addColorStop(1, 'rgba(0,0,0,0.2)')
                    .stopExecution();
            }

            const polygon = shape.advancedPolygon();
            polygon.startPoint(x0, y0);
            shape.context = this.scene.renderController.context;
            for (let i = 1; i < this.rootPool.length; i++) {
                const actor = this.rootPool[i];
                const x = getCenterX(actor.xPos, actor.width);
                const y = getCenterY(actor.yPos, actor.height);
                polygon.lineTo(x, y);
            }
            polygon.stopExecution();
        });
    }

    destroy(): void {
        super.destroy();
        if (this.subscriber) {
            this.subscriber.unsubscribe()
        }
        this.subscriber = <any>0;
        this.rootPool.length = 0;
        this.bgColor = <any>0;
        this.bdColor = <any>0;
    }
}
