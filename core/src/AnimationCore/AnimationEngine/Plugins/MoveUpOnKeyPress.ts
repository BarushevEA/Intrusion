import {AbstractScene} from "../rootScenes/AbstractScene";
import {E_KEY_MOVE_PLUGIN} from "./PluginTypes";
import {AbstractMoveOnKeyPress} from "./AbstractMoveOnKeyPress";

export class MoveUpOnKeyPress extends AbstractMoveOnKeyPress {
    constructor(scene: AbstractScene, key: string, step = 10) {
        super(E_KEY_MOVE_PLUGIN.MOVE_KEY_UP, scene, key, step);
    }

    protected initOnKeyDown(): void {
        this.keyUp = this.scene
            .tickCount$
            .subscribe(() => {
                this.root.yPos -= this._step;
                this._onKeyDown$.next(this._step);
            });
    }
}
