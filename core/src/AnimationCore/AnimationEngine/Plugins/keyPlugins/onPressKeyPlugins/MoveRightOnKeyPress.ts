import {AbstractActionOnKeyPress} from "../../root/AbstractActionOnKeyPress";
import {E_KEY_MOVE_PLUGIN} from "../../root/PluginTypes";
import {IScene} from "../../../rootScenes/SceneTypes";

export class MoveRightOnKeyPress extends AbstractActionOnKeyPress {
    constructor(scene: IScene, key: string, step = 10) {
        super(E_KEY_MOVE_PLUGIN.MOVE_KEY_RIGHT, scene, key, step);
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
                    this.root.xPos += this._step;
                    this._onKeyDown$.next(this._step);
                });
        }
    }

    onInit(): void {
    }
}
