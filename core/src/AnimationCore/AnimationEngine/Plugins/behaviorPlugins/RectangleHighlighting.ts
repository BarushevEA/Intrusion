import {AbstractActorPlugin} from "../root/AbstractActorPlugin";
import {ISubscriptionLike} from "../../../Libraries/Observables/Types";
import {IScene} from "../../rootScenes/SceneTypes";
import {IActor} from "../../rootModels/AbstractActor/ActorTypes";
import {IShapeHandler} from "../../LayerHandler/shapeModules/ShapeHandler";

export class RectangleHighlighting extends AbstractActorPlugin {
    private subscriber: ISubscriptionLike = <any>0;
    private onEventDisable: ISubscriptionLike = <any>0;
    private subscriberTick: ISubscriptionLike = <any>0;
    private readonly delta = 10;

    constructor(scene: IScene) {
        super('RectangleHighlighting', scene);
        this.delta = this.delta;
    }

    onInit(): void {
        if (this.subscriber) {
            return;
        }
        const shape = this.root.shape;
        const root = this.root;
        this.scene.collect(
            this.onEventDisable = root.onEventEnableChange$.subscribe((isEnable) => {
                if (!isEnable && this.subscriberTick) {
                    this.subscriberTick.unsubscribe();
                    this.subscriberTick = <any>0;
                }
            }),
            this.subscriber = root.onMouseOver$.subscribe(isOver => {
                    if (isOver) {
                        this.drawRectangle(root, shape);
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

    private drawRectangle(root: IActor, shape: IShapeHandler) {
        if (this.subscriberTick || !root.onMouseOver$.getValue()) {
            return;
        }
        this.subscriberTick = root.afterRender$.subscribe(() => {
            shape.context = this.scene.render.context;
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
    }

    destroy(): void {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
            this.subscriber = <any>0;
        }
        if (this.onEventDisable) {
            this.onEventDisable.unsubscribe();
            this.onEventDisable = <any>0;
        }
        if (this.subscriberTick) {
            this.subscriberTick.unsubscribe();
            this.subscriberTick = <any>0;
        }
        super.destroy();
    }
}
