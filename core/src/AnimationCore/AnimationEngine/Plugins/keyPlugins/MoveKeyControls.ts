import {AbstractActorPlugin} from "../root/AbstractActorPlugin";
import {MoveUpOnKeyPress} from "./onPressKeyPlugins/MoveUpOnKeyPress";
import {MoveDownOnKeyPress} from "./onPressKeyPlugins/MoveDownOnKeyPress";
import {MoveLeftOnKeyPress} from "./onPressKeyPlugins/MoveLeftOnKeyPress";
import {MoveRightOnKeyPress} from "./onPressKeyPlugins/MoveRightOnKeyPress";
import {IScene} from "../../rootScenes/SceneTypes";

export class MoveKeyControls extends AbstractActorPlugin {
    private moveUp: MoveUpOnKeyPress;
    private moveDown: MoveDownOnKeyPress;
    private moveLeft: MoveLeftOnKeyPress;
    private moveRight: MoveRightOnKeyPress;

    constructor(scene: IScene,
                moveUp: string,
                moveDown: string,
                moveLeft: string,
                moveRight: string) {
        super('MoveKeyControls', scene);
        this.moveUp = new MoveUpOnKeyPress(scene, moveUp);
        this.moveDown = new MoveDownOnKeyPress(scene, moveDown);
        this.moveLeft = new MoveLeftOnKeyPress(scene, moveLeft);
        this.moveRight = new MoveRightOnKeyPress(scene, moveRight);
    }

    onInit(): void {
        this.init();
    }

    init() {
        this.root.pluginDock.add(this.moveUp);
        this.root.pluginDock.add(this.moveDown);
        this.root.pluginDock.add(this.moveLeft);
        this.root.pluginDock.add(this.moveRight);

        this.scene.collect(
            this.moveUp.onKeyDown$.subscribe((step: number) => {
                if (this.root.yPos < step) {
                    this.root.yPos = step;
                }
            }),
            this.moveDown.onKeyDown$.subscribe((step: number) => {
                if (this.root.yPos > this.scene.generalLayer.height - this.root.height - step) {
                    this.root.yPos = this.scene.generalLayer.height - this.root.height - step;
                }
            }),
            this.moveLeft.onKeyDown$.subscribe((step: number) => {
                if (this.root.xPos < step) {
                    this.root.xPos = step;
                }
            }),
            this.moveRight.onKeyDown$.subscribe((step: number) => {
                if (this.root.xPos > this.scene.generalLayer.width - this.root.width - step) {
                    this.root.xPos = this.scene.generalLayer.width - this.root.width - step;
                }
            }),
        );
    }

    destroy(): void {
        this.root.pluginDock.destroyPlugin(this.moveUp);
        this.root.pluginDock.destroyPlugin(this.moveDown);
        this.root.pluginDock.destroyPlugin(this.moveLeft);
        this.root.pluginDock.destroyPlugin(this.moveRight);
        this.moveUp = <any>0;
        this.moveDown = <any>0;
        this.moveLeft = <any>0;
        this.moveRight = <any>0;
        super.destroy();
    }
}
