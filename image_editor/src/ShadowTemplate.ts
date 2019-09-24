export type IShadowTemplate = {
    getTemplate(): HTMLElement;
    appendChild(child: HTMLElement): void;
    insertStyle(rule: string): void;
    insertTo(element: HTMLElement): void;
}

class ShadowTemplate implements IShadowTemplate {
    template = document.createElement('template');
    style = document.createElement('style');
    content = this.template.content;
    preparedTemplate: HTMLElement;
    templateInserted = false;

    constructor() {
        let content = this.content;
        content.append(this.style);
        customElements.define('div-container',
            class extends HTMLElement {
                constructor() {
                    super();
                    const shadowRoot = this.attachShadow({mode: 'open'});
                    shadowRoot.appendChild(content.cloneNode(true));
                }
            }
        );
        this.preparedTemplate = document.createElement('div-container');
    }

    getTemplate(): HTMLElement {
        return this.preparedTemplate;
    }

    appendChild(child: HTMLElement) {
        this.content.append(child);
    }

    insertStyle(rule: string) {
        this.style.innerHTML = rule;
    }

    insertTo(element: HTMLElement) {
        if (!this.templateInserted) {
            element.append(this.preparedTemplate);
            this.templateInserted = true;
        } else {
            throw Error('template had been inserted');
        }
    }
}

export const shadowTemplate = new ShadowTemplate();
