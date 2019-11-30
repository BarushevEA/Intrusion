import {cssConverter, ICssPool} from "./CssClassConverter";
import {IController} from "../Libraries/initOuterVariables";
import {
    defaultCursor$, globalSize$,
    keyDownCode$,
    keyUpCode$,
    mouseClickPosition$,
    mouseLeftDown$,
    mouseLeftUp$,
    mouseMovePosition$,
    mouseRightDown$,
    mouseRightUp$
} from "../Store/EventStore";
import {platform} from "../AnimationEngine/rootScenes/AnimationPlatform";
import {IKeyCode, ISize} from "../Store/Types";
import {x_pos, y_pos} from "../Libraries/Types";

export type IAppAnimation = {
    customCanvas: HTMLCanvasElement;
    customWrapper: HTMLElement;
    customStyle: HTMLStyleElement;
    cssPool: ICssPool;
    toggleColors(): void;
};

export type IMousePosition = {
    x: x_pos;
    y: y_pos;
}

export const mouseMovePosition: IMousePosition = {x: 0, y: 0};
export const mouseClickPosition: IMousePosition = {x: 0, y: 0};
export const mouseDownPosition: IMousePosition = {x: 0, y: 0};
export const mouseUpPosition: IMousePosition = {x: 0, y: 0};

class AppAnimation extends HTMLElement implements IAppAnimation {
    private keyPressedPool: IKeyCode[] = [];
    customCanvas: HTMLCanvasElement = <any>0;
    customWrapper: HTMLElement = <any>0;
    customStyle: HTMLStyleElement = <any>0;
    cssPool: ICssPool = {};

    constructor() {
        super();
        this.customInit();
        this.addListeners();
    }

    private customInit(): void {
        const shadow = this.attachShadow({mode: 'open'});
        defaultCursor$.subscribe(this.handleDefaultCursor.bind(this));

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
        keyDownCode$.next(keyCode);
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

        keyUpCode$.next(keyCode);
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
                this.convertOuterCoordinates(event, mouseDownPosition);
                mouseLeftDown$.next(mouseDownPosition);
                break;
            case 2:
                this.convertOuterCoordinates(event, mouseDownPosition);
                mouseRightDown$.next(mouseDownPosition);
                break;
        }
    }

    setMouseUp(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this.convertOuterCoordinates(event, mouseUpPosition);
                mouseLeftUp$.next(mouseUpPosition);
                break;
            case 2:
                this.convertOuterCoordinates(event, mouseUpPosition);
                mouseRightUp$.next(mouseUpPosition);
                break;
        }
    }

    setMouseMoveLocation(event: MouseEvent): void {
        this.convertOuterCoordinates(event, mouseMovePosition);
        mouseMovePosition$.next(mouseMovePosition);
    }

    setMouseClickLocation(event: MouseEvent): void {
        this.convertOuterCoordinates(event, mouseClickPosition);
        mouseClickPosition$.next(mouseClickPosition);
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
                globalSize$.next({height: wrapperHeight, width: wrapperWidth});
            }
        };

        resizeHandler();
    }

    connectedCallback() {
        globalSize$.subscribe(this.setCanvasSize.bind(this));
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
        platform.setCanvas(this.customCanvas);
        platform.execute();
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
