import {AbstractFramedShape} from "../AbstractFramedShape";
import {ECursor, ICursor} from "../Types";
import {EventStore} from "../../../Store/EventStore";

const bdColor = 'rgb(0,195,15)';
const bgColor = 'rgb(0,114,9)';

export class Cursor extends AbstractFramedShape implements ICursor {
    private _type: ECursor = ECursor.DEFAULT;

    constructor(canvas: HTMLCanvasElement, eventStore: EventStore) {
        super(canvas, eventStore, 40, 40);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Cursor');
    }

    get type(): ECursor {
        return this._type;
    }

    protected initShape(): void {
        this.createFrame(0);
        this.createDefault();
        this.createFrame(0);
        this.createPointer();
        this.createFrame(0);
        this.createCatch();
        this.createFrame(0);
        this.createNone();
        this.setType(this._type);
    }

    protected createDefault(): void {
        this.shape
            .colors(bgColor, bdColor)
            .lineWidth(2)
            .advancedPolygon()
            .startPoint(4, 4)
            .lineTo(36, 16)
            .lineTo(28, 20)
            .lineTo(36, 28)
            .lineTo(28, 36)
            .lineTo(20, 28)
            .lineTo(16, 36)
            .stopExecution();
    };

    protected createPointer(): void {
        this.shape
            .colors(bgColor, bdColor)
            .lineWidth(2)
            .advancedPolygon()
            .startPoint(4, 6)
            .quadraticCurveTo(7, 4, 10, 6)
            .lineTo(10, 20)
            .quadraticCurveTo(13, 16, 16, 20)
            .quadraticCurveTo(19, 16, 22, 20)
            .quadraticCurveTo(25, 16, 28, 20)
            .lineTo(28, 32)
            .quadraticCurveTo(28, 36, 24, 36)
            .lineTo(8, 36)
            .quadraticCurveTo(4, 36, 4, 32)
            .stopExecution();
    };

    protected createCatch(): void {
        // aim
        this.shape
            .colors(bgColor, bdColor)
            .lineWidth(2)
            .customStroke(true)
            .line(0, 0, 8, 0)
            .line(0, 0, 0, 8)
            .customStroke(false);
        // hand
        this.shape
            .colors(bgColor, bdColor)
            .lineWidth(2)
            .advancedPolygon()
            .startPoint(12, 20)
            .quadraticCurveTo(15, 16, 18, 20)
            .quadraticCurveTo(21, 16, 24, 20)
            .quadraticCurveTo(27, 16, 30, 20)
            .quadraticCurveTo(33, 16, 36, 20)
            .lineTo(36, 26)
            .quadraticCurveTo(36, 36, 26, 36)
            .lineTo(16, 36)
            .quadraticCurveTo(12, 36, 12, 32)
            .stopExecution();
        // finger
        this.shape
            .colors(bgColor, bdColor)
            .lineWidth(2)
            .advancedPolygon()
            .startPoint(8, 26)
            .quadraticCurveTo(8, 20, 12, 24)
            .lineTo(12, 32)
            .quadraticCurveTo(8, 30, 8, 28)
            .stopExecution();
    };

    createNone(): void {

    }

    setType(type: ECursor): void {
        switch (type) {
            case ECursor.POINTER:
                this._type = type;
                this.setPointerFrame();
                break;
            case ECursor.CATCH:
                this._type = type;
                this.setCatchFrame();
                break;
            case ECursor.NONE:
                this._type = type;
                this.setNoneFrame();
                break;
            default:
                this._type = ECursor.DEFAULT;
                this.setDefaultFrame();
                break;
        }
    };

    private setDefaultFrame() {
        this.setShowedFrame(0);
        this.setStopFrame(0);
    }

    private setPointerFrame() {
        this.setShowedFrame(1);
        this.setStopFrame(1);
    }

    private setCatchFrame() {
        this.setShowedFrame(2);
        this.setStopFrame(2);
    }

    private setNoneFrame() {
        this.setShowedFrame(3);
        this.setStopFrame(3);
    }
}
