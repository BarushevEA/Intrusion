export type ICustomClass = {
    className: string;
    rule: { [key: string]: string }
};
export type IStyleSheet = HTMLStyleElement & {
    insertRule: (rule: string, index?: number) => void
};
export type IClassManager = {
    addRoot(rootElement?: HTMLElement): void;
    addClassToSheet(customClass: ICustomClass): void;
    addClassToElement(element: HTMLElement, customClass: ICustomClass): void;
}

function getStileElement() {
    let style = document.createElement('style');
    style.id = '$_LIB_CTM_ANIMATION_VID_GET';
    return style;
}

let style = getStileElement();
const rules: { [key: string]: string } = {};
let root: HTMLElement = document.head;

class CssClassManager implements IClassManager {
    addRoot(rootElement?: HTMLElement): void {
        if (rootElement) {
            root = rootElement;
        } else {
            root = document.head;
        }
    }

    addClassToSheet(customClass: ICustomClass): void {
        if (customClass &&
            customClass.rule &&
            customClass.rule) {
            let currentRules = '';
            const className = customClass.className.trim();
            let rule: string;
            if (className[0] === '.') {
                rule = className;
            } else {
                rule = `.${className}`;
            }
            let keys = Object.keys(customClass.rule);
            if (keys.length === 0) {
                return;
            }

            rule += '{';
            keys.forEach(key => {
                const correctedKey = CssClassManager.convertCamelCase(key);
                rule += `${correctedKey}: ${customClass.rule[key]};`
            });
            rule += '}';

            rules[customClass.className] = rule;
            Object.keys(rules).forEach(key => {
                currentRules += rules[key];
            });

            const styles = Array.from(root.getElementsByTagName('style'));
            if (styles.length) {
                let isStylePresent = false;
                for (let i = 0; i < styles.length; i++) {
                    const styleElement = styles[i];
                    if (styleElement.id === style.id) {
                        isStylePresent = true;
                        style = styleElement;
                        break;
                    }
                }
                if (!isStylePresent) {
                    style = getStileElement();
                    root.append(style);
                }
            } else {
                root.append(style);
            }
            style.innerHTML = currentRules;
        }
    }

    addClassToElement(element: HTMLElement, customClass: ICustomClass): void {
        let className = customClass.className.trim();
        if (className[0] === '.') {
            className = className.substr(1);
        }
        element.classList.add(className);
    }

    private static convertCamelCase(str: string): string {
        const letters = ('' + str).split('');
        const lowerLetters = ('' + str).toLowerCase().split('');
        const snakeArr = [];

        for (let i = 0; i < letters.length; i++) {
            if (i) {
                if (letters[i] !== lowerLetters[i]) {
                    snakeArr.push('-');
                    snakeArr.push(lowerLetters[i]);
                } else {
                    snakeArr.push(lowerLetters[i]);
                }
            } else {
                snakeArr.push(lowerLetters[i]);
            }
        }
        return snakeArr.join('');
    }
}

export const cssManager = new CssClassManager();
