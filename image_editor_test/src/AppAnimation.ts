import {cssConverter, ICssPool} from "./CssClassConverter";
import {MovedCircle} from "./CustomDraw";

class AppAnimation extends HTMLElement {
    customCanvas: HTMLCanvasElement;
    customWrapper: HTMLElement;
    customStyle: HTMLStyleElement;
    cssPool: ICssPool = {};

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.customWrapper = document.createElement('div');
        this.customCanvas = document.createElement('canvas');
        this.customStyle = document.createElement('style');
        this.customInit(shadow);
    }

    private customInit(shadow: ShadowRoot): void {
        AppAnimation.fillCssPool(this.cssPool);
        cssConverter.addClassPool(this.cssPool);
        this.customStyle.textContent = cssConverter.getRules();
        shadow.appendChild(this.customStyle);
        this.customWrapper.setAttribute('class', 'wrapper wrapper__colored');
        shadow.appendChild(this.customWrapper);
        this.customWrapper.appendChild(this.customCanvas);
    }

    addCustomEventResizeCustomWrapperListener(callback: () => void) {
        let wrapperWidth = 0;
        let wrapperHeight = 0;
        setInterval(() => {
            if (wrapperWidth != this.customWrapper.offsetWidth || wrapperHeight != this.customWrapper.offsetHeight) {
                callback();
                wrapperWidth = this.customWrapper.offsetWidth;
                wrapperHeight = this.customWrapper.offsetHeight;
                console.log('addCustomEventResizeCustomWrapper');
            }
        }, 100);
    }

    connectedCallback() {
        this.setCanvasSize();
        this.addCustomEventResizeCustomWrapperListener(this.setCanvasSize.bind(this));
        this.customDraw();
    }

    private customDraw() {
        const circles = new MovedCircle(this.customCanvas);
        circles.start();
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
            name: 'wrapper__colored',
            rule: {
                background: 'green'
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
