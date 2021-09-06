import {AbstractActorGroup} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/AbstractActorGroup";
import {Plane} from "../../../../../AnimationModels/Planes/heroes/Plane";
import {getCenterY} from "../../../../../../AnimationCore/Libraries/FunctionLibs";
import {MoveKeyControls} from "../../../../../../AnimationCore/AnimationEngine/Plugins/keyPlugins/MoveKeyControls";
import {RectangleHighlighting} from "../../../../../../AnimationCore/AnimationEngine/Plugins/behaviorPlugins/RectangleHighlighting";
import {BlueFirePlugin} from "../../../../../Plugins/BlueFire/BlueFirePlugin";
import {MovePlaneFramePlugin} from "../../../../../Plugins/MovePlaneFramePlugin";
import {ShotLightingPlugin} from "../../../../../Plugins/ShotLighting/ShotLightingPlugin";
import {HealthPlugin} from "../../../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../../../Plugins/HLProgress/HealthType";
import {BulletShotPlugin} from "../../../../../Plugins/Bullet/BulletShotPlugin";
import {keyDownCode$, keyUpCode$} from "../../../../../../AnimationCore/Store/EventStore";
import {IKeyCode} from "../../../../../../AnimationCore/Store/Types";
import {tickGenerator} from "../../../../../../AnimationCore/Libraries/TickGenerator";
import {IActor} from "../../../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/ActorTypes";
import {IScene} from "../../../../../../AnimationCore/AnimationEngine/rootScenes/SceneTypes";

let plane: IActor = <any>0;
let destroyedCounter = <any>0;

class Heroes extends AbstractActorGroup {
    private _enemies: IActor[] = <any>0;

    set enemies(value: IActor[]) {
        this._enemies = value;
    }

    initActors(scene: IScene): void {
        plane = new Plane(scene.generalLayer);
        plane.xPos = plane.width;
        plane.yPos = getCenterY(0, scene.generalLayer.height) - Math.round(plane.height / 2);
    }

    initActions(scene: IScene): void {
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
                    if (code.code === 'Space' && !plane.isDestroyed) {
                        plane.pluginDock.add(shotLighting);
                        plane.pluginDock.add(bulletShot);
                    }
                }
            ),
            keyUpCode$.subscribe((code: IKeyCode) => {
                    if (code.code === 'Space' && !plane.isDestroyed) {
                        plane.pluginDock.unLink(shotLighting);
                        plane.pluginDock.unLink(bulletShot);
                    }
                }
            ),
            plane.onDestroyed$.subscribe(() => {
                destroyedCounter = tickGenerator.executeTimeout(() => {
                    scene.destroy();
                }, 2000);
            }),
            health.beforeDeath$.subscribe(() => {
            })
        );
    }

    get heroes(): IActor[] {
        return [plane];
    }

    destroy(): void {
        if (plane) {
            plane.destroy();
            plane = <any>0;
        }

        this._enemies = <any>0;
        tickGenerator.clearTimeout(destroyedCounter);
        destroyedCounter = <any>0;
    }
}

export const heroesPool = new Heroes();
