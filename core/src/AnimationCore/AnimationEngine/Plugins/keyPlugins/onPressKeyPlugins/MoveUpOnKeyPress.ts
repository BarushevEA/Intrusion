import {AbstractScene} from "../../../rootScenes/AbstractScene";
import {E_KEY_MOVE_PLUGIN} from "../../root/PluginTypes";
import {AbstractActionOnKeyPress} from "../../root/AbstractActionOnKeyPress";

export class MoveUpOnKeyPress extends AbstractActionOnKeyPress {
    constructor(scene: AbstractScene, key: string, step = 10) {
        super(E_KEY_MOVE_PLUGIN.MOVE_KEY_UP, scene, key, step);
    }

    protected initOnKeyDown(): void {
        if (!this.scene) {
            this.destroy();
            return;
        }
        if (!this.keyUp) {
            this.keyUp = this.scene
                .tickCount$
                .subscribe(() => {
                    this.root.yPos -= this._step;
                    this._onKeyDown$.next(this._step);
                });
        }
    }

    onInit(): void {
    }
}
