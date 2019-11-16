import {AbstractFramedShape} from "../../../AnimationCore/AnimationEngine/rootModels/AbstractFramedShape";
import {ECursor, ICursor} from "./Types";

export class Cursor extends AbstractFramedShape implements ICursor {
    private type: ECursor = ECursor.DEFAULT;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 40, 40);
    }

    protected setFramesName(): void {
        this.setFramePoolName('Cursor');
    }

    protected initShape(): void {
        this.createFrame(0);
        this.createDefault();
        this.createFrame(0);
        this.createPointer();
        this.createFrame(0);
        this.createCatch();
        this.setType(this.type);
    }

    protected createDefault(): void {
        this.shape
            .colors('rgba(0,114,9,0.3)', 'rgb(0,114,9)')
            .lineWidth(4)
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
    };

    protected createCatch(): void {
    };

    setType(type: ECursor): void {
        switch (type) {
            case ECursor.POINTER:
                this.type = type;
                this.setPointerFrame();
                break;
            case ECursor.CATCH:
                this.type = type;
                this.setCatchFrame();
                break;
            default:
                this.type = ECursor.DEFAULT;
                this.setDefaultFrame();
                break;
        }
    };

    private setDefaultFrame() {
        this.setShowedFrame(0);
        this.setStopFrame(0);
    }

    private setCatchFrame() {
        this.setShowedFrame(1);
        this.setStopFrame(1);
    }

    private setPointerFrame() {
        this.setShowedFrame(2);
        this.setStopFrame(2);
    }
}
