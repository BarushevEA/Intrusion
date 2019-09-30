import {cssConverter, ICssPool} from "./CssClassConverter";
import {IController} from "./initOuterVariables";
import {HexagonGreed} from "./animation_models/HexagonGreed";
import {MovedCircle} from "./animation_models/MovedCircle";
import {renderController} from "./RenderController";
import {SpaceSpiral} from "./animation_models/SpaceSpiral";

export type IAppAnimation = {
    customCanvas: HTMLCanvasElement;
    customWrapper: HTMLElement;
    customStyle: HTMLStyleElement;
    cssPool: ICssPool;
    toggleColors(): void;
};

class AppAnimation extends HTMLElement implements IAppAnimation {
    customCanvas: HTMLCanvasElement;
    customWrapper: HTMLElement;
    customStyle: HTMLStyleElement;
    cssPool: ICssPool = {};
    renderController = renderController;

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.customWrapper = document.createElement('div');
        this.customCanvas = document.createElement('canvas');
        this.customStyle = document.createElement('style');
        this.renderController.setCanvas(this.customCanvas);
        this.customInit(shadow);
    }

    private customInit(shadow: ShadowRoot): void {
        AppAnimation.fillCssPool(this.cssPool);
        cssConverter.addClassPool(this.cssPool);
        this.customStyle.textContent = cssConverter.getRules();
        shadow.appendChild(this.customStyle);
        this.customWrapper.setAttribute('class', 'wrapper wrapper__green');
        shadow.appendChild(this.customWrapper);
        this.customWrapper.appendChild(this.customCanvas);
    }

    addCustomEventResizeCustomWrapperListener(callback: () => void) {
        let wrapperWidth = 0;
        let wrapperHeight = 0;

        const resizeHandler = () => {
            requestAnimationFrame(resizeHandler);
            if (wrapperWidth != this.customWrapper.offsetWidth || wrapperHeight != this.customWrapper.offsetHeight) {
                wrapperWidth = this.customWrapper.offsetWidth;
                wrapperHeight = this.customWrapper.offsetHeight;
                callback();
            }
        };

        resizeHandler();
    }

    connectedCallback() {
        this.setCanvasSize();
        this.addCustomEventResizeCustomWrapperListener(this.setCanvasSize.bind(this));
        this.renderCanvas();
        (<IController>(<any>window)['AppAnimationController']).add(this);
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

    private renderCanvas() {
        const hexagon = new HexagonGreed(this.customCanvas);
        hexagon.setName('hexagon');
        this.renderController.setDrawElement(hexagon);

        for (let i = 0; i < 1; i++) {
            const spaceSpiral = new SpaceSpiral(this.customCanvas);
            spaceSpiral.setName('spaceSpiral' + i);
            this.renderController.setDrawElement(spaceSpiral);
        }

        for (let i = 0; i < 50; i++) {
            const circles = new MovedCircle(this.customCanvas);
            circles.setName('circles' + i);
            this.renderController.setDrawElement(circles);
        }
        this.renderController.render();
    }

    private setCanvasSize() {
        this.customCanvas.setAttribute('height', '' + this.customWrapper.offsetHeight);
        this.customCanvas.setAttribute('width', '' + this.customWrapper.offsetWidth);
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

customElements.define('app-animation-component', AppAnimation);
