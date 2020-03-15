import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ISubscriptionLike} from "../../AnimationCore/Libraries/Observable";

export class RectangleHighlighting extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private subscriberTick: ISubscriptionLike = <any>0;
    private readonly delta = 10;

    constructor(scene: AbstractScene) {
        super('RectangleHighlighting', scene);
        this.delta = this.delta;
    }

    onInit(): void {
        if (this.subscriber) {
            return;
        }
        this.scene.collect(
            this.subscriber = this.root.isMouseOver$.subscribe((isOver) => {
                    if (isOver) {
                        this.subscriberTick = this.scene.tickCount$.subscribe(() => {
                            const shape = this.root.shape;
                            const root = this.root;
                            shape.context = this.scene.renderController.context;
                            shape
                                .lineWidth(2)
                                .colors('rgba(0,195,15,0.5)', 'rgba(0,195,15,0.5)');
                            shape
                                .advancedPolygon()
                                .startPoint(root.xPos + 0, root.yPos + this.delta)
                                .lineTo(root.xPos + 0, root.yPos + 0)
                                .lineTo(root.xPos + this.delta, root.yPos + 0)
                                .stopExecution();
                            shape
                                .advancedPolygon()
                                .startPoint(root.xPos + root.width - this.delta, root.yPos + 0)
                                .lineTo(root.xPos + root.width, root.yPos + 0)
                                .lineTo(root.xPos + root.width, root.yPos + this.delta)
                                .stopExecution();
                            shape
                                .advancedPolygon()
                                .startPoint(root.xPos + root.width, root.yPos + root.height - this.delta)
                                .lineTo(root.xPos + root.width, root.yPos + root.height)
                                .lineTo(root.xPos + root.width - this.delta, root.yPos + root.height)
                                .stopExecution();
                            shape
                                .advancedPolygon()
                                .startPoint(root.xPos + this.delta, root.yPos + root.height)
                                .lineTo(root.xPos + 0, root.yPos + root.height)
                                .lineTo(root.xPos + 0, root.yPos + root.height - this.delta)
                                .stopExecution();
                        });
                    } else {
                        if (this.subscriberTick) {
                            this.subscriberTick.unsubscribe();
                            this.subscriberTick = <any>0;
                        }
                    }
                }
            )
        );
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        if (this.subscriberTick) {
            this.subscriberTick.unsubscribe();
            this.subscriberTick = <any>0;
        }
        super.destroy();
    }
}
