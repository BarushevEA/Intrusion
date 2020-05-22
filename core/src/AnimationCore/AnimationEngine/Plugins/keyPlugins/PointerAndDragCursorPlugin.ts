import {AbstractActorPlugin} from "../root/AbstractActorPlugin";
import {AbstractScene} from "../../rootScenes/AbstractScene";
import {ECursor} from "../../rootModels/Types";
import {ISubscriptionLike} from "../../../Libraries/Observable";

export class PointerAndDragCursorPlugin extends AbstractActorPlugin {
    private PODSubscriber: ISubscriptionLike = <any>0;
    private dragSubscriber: ISubscriptionLike = <any>0;
    private dropSubscriber: ISubscriptionLike = <any>0;

    constructor(scene: AbstractScene) {
        super('PointerAndDrugCursorPlugin', scene);
    }

    onInit(): void {
        this.initSubscribers();
        this.scene.collect(
            this.PODSubscriber,
            this.dragSubscriber,
            this.dropSubscriber
        );
    }

    initSubscribers() {
        if (!this.PODSubscriber) {
            this.PODSubscriber = this.root.isMouseOver$.subscribe(() => {
                this.scene.cursorHandler.pointerOrDefaultChange(this.scene, this.root);
            });
        }
        if (!this.dragSubscriber) {
            this.dragSubscriber = this.root.isMouseLeftDrag$.subscribe(() => {
                this.scene.cursor.setType(ECursor.CATCH);
            });
        }
        if (!this.dropSubscriber) {
            this.dropSubscriber = this.root.isMouseLeftDrop$.subscribe(() => {
                this.scene.cursor.setType(ECursor.POINTER);
            });
        }
    }

    unLink(): void {
        if (this.scene) {
            this.scene.unsubscribe(this.PODSubscriber);
            this.scene.unsubscribe(this.dragSubscriber);
            this.scene.unsubscribe(this.dropSubscriber);
        }
        this.PODSubscriber = <any>0;
        this.dragSubscriber = <any>0;
        this.dropSubscriber = <any>0;
        this.scene.cursor.setType(ECursor.DEFAULT);
        super.unLink();
    }

    destroy(): void {
        this.unLink();
        super.destroy();
    }
}
