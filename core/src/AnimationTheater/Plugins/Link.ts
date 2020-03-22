import {AbstractActorPlugin} from "../../AnimationCore/AnimationEngine/Plugins/root/AbstractActorPlugin";
import {AbstractScene} from "../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {ISubscriptionLike, Observable} from "../../AnimationCore/Libraries/Observable";

export class Link extends AbstractActorPlugin {
    private linkedActor: AbstractActor = <any>0;
    private subscriber: ISubscriptionLike = <any>0;
    private subscriberUnLink: ISubscriptionLike = <any>0;
    private _setToBottom$ = new Observable(<any>0);

    constructor(scene: AbstractScene) {
        super('Link', scene);
    }

    setActorToLink(actor: AbstractActor): void {
        this.linkedActor = actor;
    }

    get setToBottom$(): Observable<any> {
        return this._setToBottom$;
    }

    onInit(): void {
        if (this.subscriber) {
            return;
        }

        if (this.subscriberUnLink) {
            this.subscriberUnLink.unsubscribe();
            this.subscriberUnLink = <any>0;
        }

        this.scene.setActorZIndex(this.linkedActor, this.root.z_index - 1);

        this.scene.collect(
            this.subscriber = this.scene.tickCount$.subscribe(() => {
                this.linkedActor.xPos = this.root.xPos;
                this.linkedActor.yPos = this.root.yPos;
            })
        );
    }

    unLink(): void {
        if (this.subscriber) {
            this.scene.unsubscribe(this.subscriber);
            this.subscriber = <any>0;
        }
        if (!this.subscriberUnLink) {
            this.scene.collect(
                this.subscriberUnLink = this.scene.tickCount$.subscribe(() => {
                    if (!this.linkedActor) {
                        if (this.subscriberUnLink) {
                            this.subscriberUnLink.unsubscribe();
                        }
                        return;
                    }
                    this.linkedActor.yPos += 2;
                    if (this.linkedActor.yPos > this.scene.generalLayer.height) {
                        this.subscriberUnLink.unsubscribe();
                        this.subscriberUnLink = <any>0;
                        this._setToBottom$.next(true);
                    }
                })
            );
        }
        super.unLink();
    }

    destroy(): void {
        if (this._setToBottom$) {
            this._setToBottom$.destroy();
            this._setToBottom$ = <any>0;
        }
        if (this.subscriberUnLink) {
            this.scene.unsubscribe(this.subscriberUnLink);
            this.subscriberUnLink = <any>0;
        }
        this.linkedActor = <any>0;
        super.destroy();
    }
}
