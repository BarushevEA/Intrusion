export type ICustomClass = {
    className: string;
    rule: { [key: string]: string }
};
export type IStyleSheet = HTMLStyleElement & {
    insertRule: (rule: string, index?: number) => void
};
export type IClassManager = {
    addClassToSheet(customClass: ICustomClass): void;
    addClassToElement(element: HTMLElement, customClass: ICustomClass): void;
}

const newStyle = document.createElement('style');
const rules: { [key: string]: string } = {};
document.head.appendChild(newStyle);

// const newStyleSheet = <IStyleSheet><any>newStyle.sheet;


class CssClassManager implements IClassManager {
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
            newStyle.innerHTML = currentRules;
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
