import {ISubscriptionLike} from "./Observable";

export type ICollector = {
    collect(...subscribers: ISubscriptionLike[]): void;
    unsubscribe(subscriber: ISubscriptionLike): void;
    destroy(): void;
};

const clearNumber = 1000;

export class EventCollector implements ICollector {
    private collector: ISubscriptionLike[] = [];
    private collectorBuffer: ISubscriptionLike[] = [];
    private destroySubscriberCounter = 0;

    public collect(...subscribers: ISubscriptionLike[]): void {
        for (let i = 0; i < subscribers.length; i++) {
            this.collector.push(subscribers[i]);
        }
    }

    public unsubscribe(subscriber: ISubscriptionLike): void {
        if (!subscriber || !subscriber.unsubscribe || !this.collector.length) {
            return;
        }

        const sbIndex = this.collector.indexOf(subscriber);

        if (sbIndex > -1) {
            this.destroySubscriberCounter++;
            this.collector[sbIndex].unsubscribe();
            this.collector[sbIndex] = <any>0;
        } else {
            subscriber.unsubscribe();
        }

        this.clearCollector();
    }

    private clearCollector(): void {
        if (this.destroySubscriberCounter >= clearNumber && this.collector.length) {
            let length = this.collector.length;
            for (let i = 0; i < length; i++) {
                const subscriber = this.collector.pop();
                if (!!subscriber) {
                    this.collectorBuffer.push(subscriber);
                }
            }
            length = this.collectorBuffer.length;
            for (let i = 0; i < length; i++) {
                const subscriber = this.collectorBuffer.pop();
                this.collector.push(<ISubscriptionLike>subscriber);
            }
            this.destroySubscriberCounter = 0;
        }
    }

    public destroy(): void {
        for (let i = 0; i < this.collector.length; i++) {
            const subscriber = this.collector[i];
            if (subscriber) {
                subscriber.unsubscribe();
            }
        }
        this.collector = <any>0;
    }
}
