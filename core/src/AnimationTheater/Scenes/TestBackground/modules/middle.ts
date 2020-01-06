import {AbstractScene} from "../../../../AnimationCore/AnimationEngine/rootScenes/AbstractScene";
import {ELayers} from "../../../../AnimationCore/AnimationEngine/rootScenes/scenesEnvironment";
import {LightCircle} from "../../../AnimationModels/circle/LightCircle";
import {BounceOffTheWall} from "../../../Plugins/BounceOffTheWall";
// import {PolygonWeb} from "../../../Plugins/PolygonWeb";
import {AbstractActor} from "../../../../AnimationCore/AnimationEngine/rootModels/AbstractActor/AbstractActor";
import {MoveKeyControls} from "../../../Plugins/MoveKeyControls";
import {RectangleHighlighting} from "../../../Plugins/RectangleHighlighting";
import {BlueFirePlugin} from "../../../Plugins/BlueFire/BlueFirePlugin";
import {getCenterY} from "../../../../AnimationCore/Libraries/FunctionLibs";
import {MovePlaneFramePlugin} from "../../../Plugins/MovePlaneFramePlugin";
import {ShotLightingPlugin} from "../../../Plugins/ShotLighting/ShotLightingPlugin";
import {keyDownCode$, keyUpCode$} from "../../../../AnimationCore/Store/EventStore";
import {IKeyCode} from "../../../../AnimationCore/Store/Types";
import {Plane} from "../../../AnimationModels/Planes/Plane";
import {FatherFrost} from "../../../AnimationModels/FatherFrost/FatherFrost";
import {PointerAndDragCursorPlugin} from "../../../Plugins/PointerAndDragCursorPlugin";
import {Enemy1} from "../../../AnimationModels/Planes/enemy1/Enemy1";
import {HealthPlugin} from "../../../Plugins/HLProgress/HealthPlugin";
import {HealthType} from "../../../Plugins/HLProgress/HealthType";
import {BulletShotPlugin} from "../../../Plugins/Bullet/BulletShotPlugin";
import {EnemySmall1} from "../../../AnimationModels/Planes/enemySmall1/EnemySmall1";
import {Enemy2} from "../../../AnimationModels/Planes/enemy2/Enemy2";
import {Enemy3} from "../../../AnimationModels/Planes/enemy3/Enemy3";
import {EnemySmall2} from "../../../AnimationModels/Planes/enemySmall2/EnemySmall2";

let circles: AbstractActor[] = <any>0;
let plane: AbstractActor = <any>0;
let fatherFrost: AbstractActor = <any>0;
let enemies: AbstractActor[] = <any>0;
let enemiesMiniBosses: AbstractActor[] = <any>0;

export function handleMiddle(scene: AbstractScene): void {
    scene.setActiveLayer(ELayers.MIDDLE);
    clearVariables();
    initActors(scene);
    initActions(scene);
}

function clearVariables() {
    plane = <any>0;
    fatherFrost = <any>0;
    if (!!circles) {
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            circle.destroy();
        }
        circles = <any>0;
    }
    if (!!enemies) {
        for (let i = 0; i < enemies.length; i++) {
            const enemy1 = enemies[i];
            enemy1.destroy();
        }
        enemies = <any>0;
    }
    if (!!enemiesMiniBosses) {
        for (let i = 0; i < enemiesMiniBosses.length; i++) {
            const enemy1 = enemiesMiniBosses[i];
            enemy1.destroy();
        }
        enemiesMiniBosses = <any>0;
    }
}

function initActors(scene: AbstractScene) {
    initEnemies(scene);
    initCircles(scene);
    initFatherFrost(scene);
    initPlane(scene);
}

function initActions(scene: AbstractScene) {
    circlesAction(scene);
    enemy1Actions(scene);
    fatherFrostAction(scene);
    planeAction(scene);
    scene.collect(
        scene.onDestroy$.subscribe(() => {
            clearVariables();
        })
    );
}

function miniBossActivate(miniBoss: AbstractActor, scene: AbstractScene) {
    miniBoss.xPos = scene.generalLayer.width - miniBoss.width;
    scene.setActors(miniBoss);
    enemiesMiniBosses.push(miniBoss);
}

function initEnemies(scene: AbstractScene) {
    enemies = [];
    enemiesMiniBosses = [];

    for (let i = 0; i < 7; i++) {
        const enemy = new EnemySmall1(scene.generalLayer);
        enemies.push(enemy);
        enemy.xPos = scene.generalLayer.width - enemy.width;
        scene.setActors(enemy);
    }

    for (let i = 0; i < 7; i++) {
        const enemy = new EnemySmall2(scene.generalLayer);
        enemies.push(enemy);
        enemy.xPos = scene.generalLayer.width - enemy.width;
        scene.setActors(enemy);
    }

    const miniBoss1 = new Enemy1(scene.generalLayer);
    miniBossActivate(miniBoss1, scene);

    const miniBoss2 = new Enemy2(scene.generalLayer);
    miniBossActivate(miniBoss2, scene);

    const miniBoss3 = new Enemy3(scene.generalLayer);
    miniBossActivate(miniBoss3, scene);
}

function initCircles(scene: AbstractScene) {
    circles = [];
    for (let i = 0; i < 9; i++) {
        const circle = new LightCircle(scene.generalLayer);
        circles.push(circle);
        scene.setActors(circle);
    }
}

function initFatherFrost(scene: AbstractScene) {
    fatherFrost = new FatherFrost(scene.generalLayer);
    fatherFrost.xPos = scene.generalLayer.width - fatherFrost.width;
    fatherFrost.yPos = scene.generalLayer.height - fatherFrost.height;
    scene.setActors(fatherFrost);
}

function initPlane(scene: AbstractScene) {
    plane = new Plane(scene.generalLayer);
    plane.xPos = plane.width;
    plane.yPos = getCenterY(0, scene.generalLayer.height) - Math.round(plane.height / 2);
    scene.setActors(plane);
}

function enemy1Actions(scene: AbstractScene) {
    for (let i = 0; i < enemies.length; i++) {
        const enemy1 = enemies[i];
        const bounce = new BounceOffTheWall(scene, Math.round(scene.generalLayer.width / 3));
        const health = new HealthPlugin(scene, HealthType.NONE, 200);
        enemy1.pluginDock.add(bounce);
        enemy1.pluginDock.add(health);
    }

    for (let i = 0; i < enemiesMiniBosses.length; i++) {
        const miniBoss = enemiesMiniBosses[i];
        const bounce = new BounceOffTheWall(scene, Math.round(scene.generalLayer.width / 3));
        const health = new HealthPlugin(scene);
        miniBoss.pluginDock.add(bounce);
        miniBoss.pluginDock.add(health);
        enemies.push(miniBoss);
    }
}

function fatherFrostAction(scene: AbstractScene) {
    const highlighting = new RectangleHighlighting(scene);
    const cursorBehavior = new PointerAndDragCursorPlugin(scene);
    const bounce = new BounceOffTheWall(scene);
    const health = new HealthPlugin(scene, HealthType.ENEMY_BOSS, 5000);
    enemies.push(fatherFrost);
    scene.moveOnMouseDrag(fatherFrost);
    fatherFrost.pluginDock.add(health);
    fatherFrost.pluginDock.add(highlighting);
    fatherFrost.pluginDock.add(bounce);
    fatherFrost.pluginDock.add(cursorBehavior);
    scene.collect(
        fatherFrost.isMouseOver$.subscribe(() => {
            fatherFrost.pluginDock.unLink(bounce);
            fatherFrost.pluginDock.add(bounce);
        }),
        fatherFrost.isDestroyed$.subscribe(() => {
            scene.destroy();
        })
    );
}

function planeAction(scene: AbstractScene) {
    const moveKeys = new MoveKeyControls(scene, 'w', 's', 'a', 'd');
    const highlighting = new RectangleHighlighting(scene);
    const fire = new BlueFirePlugin(scene);
    const moveFrame = new MovePlaneFramePlugin(scene);
    const shotLighting = new ShotLightingPlugin(scene);
    const health = new HealthPlugin(scene, HealthType.HERO, 5000);
    const bulletShot = new BulletShotPlugin(scene, enemies);
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
        )
    );
}

function circlesAction(scene: AbstractScene) {
    let counter = 0;
    for (let j = 0; j < 3; j++) {
        // const web = new PolygonWeb(
        //     scene,
        //     'rgba(195,195,20,0.5)',
        //     'rgba(5,4,195,0)');
        for (let i = 0; i < 3; i++) {
            const circle = circles[counter];
            const bounce = new BounceOffTheWall(scene);
            const cursorBehavior = new PointerAndDragCursorPlugin(scene);
            const highlighting = new RectangleHighlighting(scene);
            circle.pluginDock.add(bounce);
            circle.pluginDock.add(highlighting);
            // circle.pluginDock.add(web);
            circle.pluginDock.add(cursorBehavior);
            scene.moveOnMouseDrag(circle);
            counter++;
        }
    }
}
