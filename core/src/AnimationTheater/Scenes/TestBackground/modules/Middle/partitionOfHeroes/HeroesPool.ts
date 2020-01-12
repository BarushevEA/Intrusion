import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {AbstractScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {AbstractActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {Plane} from "../../../../../AnimationModels/Planes/heroes/Plane";
import {getCenterY} from "../../../../../../AnimationCore/Libraries/FunctionLibs";
import {MoveKeyControls} from "../../../../../Plugins/MoveKeyControls";
import {RectangleHighlighting} from "../../../../../Plugins/RectangleHighlighting";
import {BlueFirePlugin} from "../../../../../Plugins/BlueFire/BlueFirePlugin";
import {MovePlaneFramePlugin} from "../../../../../Plugins/MovePlaneFramePlugin";
import {ShotLightingPlugin} from "../../../../../Plugins/ShotLighting/ShotLightingPlugin";
import {HealthPlugin} from "../../../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../../../Plugins/HLProgress/HealthType";
import {BulletShotPlugin} from "../../../../../Plugins/Bullet/BulletShotPlugin";
import {keyDownCode$, keyUpCode$} from "../../../../../../AnimationCore/Store/EventStore";
import {IKeyCode} from "../../../../../../AnimationCore/Store/Types";

let plane: AbstractActor = <any>0;

class Heroes extends AbstractActorGroup {
    private _enemies: AbstractActor[] = <any>0;

    set enemies(value: AbstractActor[]) {
        this._enemies = value;
    }

    initActors(scene: AbstractScene): void {
        plane = new Plane(scene.generalLayer);
        plane.xPos = plane.width;
        plane.yPos = getCenterY(0, scene.generalLayer.height) - Math.round(plane.height / 2);
    }

    initActions(scene: AbstractScene): void {
        scene.setActors(plane);

        const moveKeys = new MoveKeyControls(scene, 'w', 's', 'a', 'd');
        const highlighting = new RectangleHighlighting(scene);
        const fire = new BlueFirePlugin(scene);
        const moveFrame = new MovePlaneFramePlugin(scene);
        const shotLighting = new ShotLightingPlugin(scene);
        const health = new HealthPlugin(scene, HealthType.HERO, 5000);
        const bulletShot = new BulletShotPlugin(scene, this._enemies);
        plane.pluginDock.add(fire);
        plane.pluginDock.add(moveKeys);
        plane.pluginDock.add(moveFrame);
        plane.pluginDock.add(highlighting);
        plane.pluginDock.add(health);
        scene.collect(
            keyDownCode$.subscribe((code: IKeyCode) => {
                    if (code.code === 'Space') {
                        plane.pluginDock.add(shotLighting);
                        plane.pluginDock.add(bulletShot);
                    }
                }
            ),
            keyUpCode$.subscribe((code: IKeyCode) => {
                    if (code.code === 'Space') {
                        plane.pluginDock.unLink(shotLighting);
                        plane.pluginDock.unLink(bulletShot);
                    }
                }
            ),
            plane.isDestroyed$.subscribe(() => {
                setTimeout(() => {
                    scene.destroy();
                }, 2000);
            })
        );
    }

    get heroes(): AbstractActor[] {
        return [plane];
    }

    destroy(): void {
        if (plane) {
            plane.destroy();
            plane = <any>0;
        }

        this._enemies = <any>0;
    }
}

export const heroesPool = new Heroes();
