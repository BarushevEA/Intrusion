import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {getRectangleCenter} from "../../AnimationCore/Libraries/FunctionLibs";

export class PolygonWeb extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private rootPool: AbstractActor[] = [];

    constructor(scene: AbstractScene, backgroundColor: string, borderColor: string) {
        super('PolygonWeb', scene);
        this.init(backgroundColor, borderColor);
    }

    init(backgroundColor: string, borderColor: string) {
        this.subscriber = this.scene.tickCount$.subscribe(() => {
            const shape = this.rootPool[0].shape;
            const middle0 = getRectangleCenter(
                this.rootPool[0].xPos,
                this.rootPool[0].yPos,
                this.rootPool[0].height,
                this.rootPool[0].width);
            shape.colors(backgroundColor, borderColor)
                .lineWidth(2);

            const polygon = shape.advancedPolygon();
            polygon.startPoint(middle0.x, middle0.y);
            shape.context = this.scene.renderController.context;
            for (let i = 1; i < this.rootPool.length; i++) {
                const actor = this.rootPool[i];
                const middle = getRectangleCenter(
                    actor.xPos,
                    actor.yPos,
                    actor.height,
                    actor.width);
                polygon.lineTo(middle.x, middle.y);
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
    }

    setRoot(root: any): void {
        super.setRoot(root);
        this.rootPool.push(root);
    }
}
