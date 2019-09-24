import {cssConverter, ICssPool, ICustomClass} from "./CssClassConverter";

class AppAnimation extends HTMLElement {
    customCanvas: HTMLElement;
    customWrapper: HTMLElement;
    customStyle: HTMLElement;
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
        this.customWrapper.setAttribute('class', 'wrapper wrapper__red');
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
    }

    private setCanvasSize() {
        this.customCanvas.setAttribute('height', '' + this.customWrapper.offsetHeight);
        this.customCanvas.setAttribute('width', '' + this.customWrapper.offsetWidth);
    }

    private static fillCssPool(cssPool: { [p: string]: ICustomClass }) {
        cssPool.wrapper = {
            className: 'wrapper',
            rule: {
                padding: '0',
                margin: '0',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        };
        cssPool.wrapperContainer = {
            className: 'wrapper__red',
            rule: {
                background: 'green'
            }
        };
    }
}

customElements.define('app-animation-component', AppAnimation);
