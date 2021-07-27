import {cssConverter, ICssPool} from "./CssClassConverter";
import {IController} from "../Libraries/initOuterVariables";
import {AnimationPlatform} from "../AnimationEngine/rootScenes/AnimationPlatform";
import {IKeyCode, ISize} from "../Store/Types";
import {IMousePosition, MouseStore} from "../Store/MouseStore";
import {EventStore} from "../Store/EventStore";

export type IAppAnimation = HTMLElement & {
    customCanvas: HTMLCanvasElement;
    customWrapper: HTMLElement;
    customStyle: HTMLStyleElement;
    cssPool: ICssPool;
    mouse: MouseStore;
    readonly eventStore: EventStore;
    toggleColors(): void;
    destroy(): void;
};

class AppAnimation extends HTMLElement implements IAppAnimation {
    private keyPressedPool: IKeyCode[] = [];
    customCanvas: HTMLCanvasElement = <any>0;
    customWrapper: HTMLElement = <any>0;
    customStyle: HTMLStyleElement = <any>0;
    cssPool: ICssPool = {};
    mouse: MouseStore = new MouseStore();
    platform: AnimationPlatform = new AnimationPlatform();
    eventStore: EventStore = new EventStore();


    constructor() {
        super();
        this.customInit();
        this.addListeners();
    }

    private customInit(): void {
        const shadow = this.attachShadow({mode: 'open'});
        this.eventStore.defaultCursor$.subscribe(this.handleDefaultCursor.bind(this));

        this.customWrapper = document.createElement('div');
        this.customCanvas = document.createElement('canvas');
        this.customStyle = document.createElement('style');

        AppAnimation.fillCssPool(this.cssPool);
        cssConverter.addClassPool(this.cssPool);
        this.customStyle.textContent = cssConverter.getRules();
        shadow.appendChild(this.customStyle);
        this.customWrapper.setAttribute('class', 'wrapper wrapper__green');
        shadow.appendChild(this.customWrapper);
        this.customWrapper.appendChild(this.customCanvas);
    }

    private addListeners() {
        this.customCanvas.addEventListener('mousemove', this.setMouseMoveLocation.bind(this));
        this.customCanvas.addEventListener('mousedown', this.setMouseDown.bind(this));
        this.customCanvas.addEventListener('mouseup', this.setMouseUp.bind(this));
        this.customCanvas.addEventListener('click', this.setMouseClickLocation.bind(this));
        window.addEventListener('keydown', this.setKeyDown.bind(this), true);
        window.addEventListener('keyup', this.setKeyUp.bind(this), true);
    }

    setKeyDown(event: IKeyCode) {
        const keyCode: IKeyCode = <any>{};
        keyCode.key = event.key;
        keyCode.keyCode = event.keyCode;
        keyCode.code = event.code;

        for (let i = 0; i < this.keyPressedPool.length; i++) {
            const key = this.keyPressedPool[i].key;
            if (key === keyCode.key) {
                return;
            }
        }

        this.keyPressedPool.push(keyCode);
        this.eventStore.keyDownCode$.next(keyCode);
    }

    setKeyUp(event: IKeyCode) {
        const keyCode: IKeyCode = <any>{};
        keyCode.key = event.key;
        keyCode.keyCode = event.keyCode;
        keyCode.code = event.code;

        if (!this.deleteKey(keyCode)) {
            return;
        }

        while (this.deleteKey(keyCode)) {
        }

        this.eventStore.keyUpCode$.next(keyCode);
    }

    deleteKey(keyCode: IKeyCode): boolean {
        let i = 0;
        let isFound = false;
        for (; i < this.keyPressedPool.length; i++) {
            const key = this.keyPressedPool[i].keyCode;
            if (key === keyCode.keyCode) {
                isFound = true;
                break;
            }
        }
        if (!isFound) {
            return false;
        }
        for (; i < this.keyPressedPool.length - 1; i++) {
            this.keyPressedPool[i] = this.keyPressedPool[i + 1];
        }
        this.keyPressedPool.length--;
        return true;
    }

    setMouseDown(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this.convertOuterCoordinates(event, this.mouse.downPosition);
                this.eventStore.mouseLeftDown$.next(this.mouse.downPosition);
                break;
            case 2:
                this.convertOuterCoordinates(event, this.mouse.downPosition);
                this.eventStore.mouseRightDown$.next(this.mouse.downPosition);
                break;
        }
    }

    setMouseUp(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this.convertOuterCoordinates(event, this.mouse.upPosition);
                this.eventStore.mouseLeftUp$.next(this.mouse.upPosition);
                break;
            case 2:
                this.convertOuterCoordinates(event, this.mouse.upPosition);
                this.eventStore.mouseRightUp$.next(this.mouse.upPosition);
                break;
        }
    }

    setMouseMoveLocation(event: MouseEvent): void {
        this.convertOuterCoordinates(event, this.mouse.movePosition);
        this.eventStore.mouseMovePosition$.next(this.mouse.movePosition);
    }

    setMouseClickLocation(event: MouseEvent): void {
        this.convertOuterCoordinates(event, this.mouse.clickPosition);
        this.eventStore.mouseClickPosition$.next(this.mouse.clickPosition);
    }

    private convertOuterCoordinates(event: MouseEvent, coordinates: IMousePosition) {
        event.stopImmediatePropagation();
        coordinates.x = (event.clientX - this.customCanvas.offsetLeft);
        coordinates.y = (event.clientY - this.customCanvas.offsetTop);
    }

    private addCustomEventResizeCustomWrapperListener() {
        let wrapperWidth = 0;
        let wrapperHeight = 0;

        const resizeHandler = () => {
            requestAnimationFrame(resizeHandler);
            if (wrapperWidth != this.customWrapper.offsetWidth || wrapperHeight != this.customWrapper.offsetHeight) {
                wrapperWidth = this.customWrapper.offsetWidth;
                wrapperHeight = this.customWrapper.offsetHeight;
                this.eventStore.globalSize$.next({height: wrapperHeight, width: wrapperWidth});
            }
        };

        resizeHandler();
    }

    connectedCallback() {
        this.eventStore.globalSize$.subscribe(this.setCanvasSize.bind(this));
        this.addCustomEventResizeCustomWrapperListener();
        this.renderCanvas();
        (<IController>(<any>window)['AppAnimationController']).add(this);
    }

    disconnectedCallback() {
        this.customCanvas.removeEventListener('mousemove', this.setMouseMoveLocation.bind(this));
        this.customCanvas.removeEventListener('mousedown', this.setMouseDown.bind(this));
        this.customCanvas.removeEventListener('mouseup', this.setMouseUp.bind(this));
        this.customCanvas.removeEventListener('click', this.setMouseClickLocation.bind(this));
        window.removeEventListener('keydown', this.setKeyDown.bind(this), true);
        window.removeEventListener('keyup', this.setKeyUp.bind(this), true);
    }

    setRedColor(): void {
        this.customWrapper.classList.replace('wrapper__green', 'wrapper__red');
    }

    setGreenColor(): void {
        this.customWrapper.classList.replace('wrapper__red', 'wrapper__green');
    }

    toggleColors(): void {
        if (this.customWrapper.classList.contains('wrapper__green')) {
            this.setRedColor();
        } else {
            this.setGreenColor();
        }
    }

    handleDefaultCursor(isDefault: boolean): void {
        if (isDefault) {
            this.defaultCursorShow();
        } else {
            this.defaultCursorHide();
        }
    }

    defaultCursorHide(): void {
        this.customWrapper.classList.add('wrapper__cursor-hide');
    }

    defaultCursorShow(): void {
        this.customWrapper.classList.remove('wrapper__cursor-hide');
    }

    private renderCanvas() {
        this.platform.setCanvas(this.customCanvas);
        this.platform.execute(this);
    }

    public destroy() {
        this.disconnectedCallback();
        this.eventStore.globalSize$.destroy();
        this.eventStore.mouseClickPosition$.destroy();
        this.eventStore.mouseMovePosition$.destroy();
        this.eventStore.mouseLeftUp$.destroy();
        this.eventStore.mouseRightUp$.destroy();
        this.eventStore.mouseLeftDown$.destroy();
        this.eventStore.mouseRightDown$.destroy();
        this.eventStore.keyUpCode$.destroy();
        this.eventStore.keyDownCode$.destroy();
        this.eventStore.defaultCursor$.destroy();
        this.eventStore = <any>0;
    }

    private setCanvasSize(size: ISize) {
        this.customCanvas.setAttribute('height', '' + size.height);
        this.customCanvas.setAttribute('width', '' + size.width);
    }

    private static fillCssPool(cssPool: ICssPool) {
        cssPool.wrapper = {
            name: 'wrapper',
            rule: {
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        };
        cssPool.wrapperContainer = {
            name: 'wrapper__green',
            rule: {
                // background: 'green'
            }
        };
        cssPool.wrapperContainerRed = {
            name: 'wrapper__red',
            rule: {
                // background: 'red'
            }
        };
        cssPool.wrapperFullScrees = {
            name: 'wrapper__fullscreen',
            rule: {
                position: 'fixed',
                height: '100vh',
                width: '100vw',
            }
        };
        cssPool.wrapperCursorHide = {
            name: 'wrapper__cursor-hide',
            rule: {
                cursor: 'none'
            }
        };
        cssPool.global = {
            name: '*',
            isNoClass: true,
            rule: {
                padding: '0',
                margin: '0',
                boxSizing: 'border-box'
            }
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    customElements.define('app-animation-component', AppAnimation);
});
