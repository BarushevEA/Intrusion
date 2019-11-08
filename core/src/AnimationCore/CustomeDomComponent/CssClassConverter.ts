export type ICustomClass = {
    name: string;
    isNoClass?: boolean;
    rule: { [key: string]: string };
};

export type ICssPool = { [key: string]: ICustomClass };

export type IClassConverter = {
    convertCustomClassToString(customClass: ICustomClass): string;
    addClassToSheet(customClass: ICustomClass): void;
    addClassToElement(element: HTMLElement, customClass: ICustomClass): void;
    getRules(): string;
    addClassPool(cssPool: ICssPool): void;
}

const rules: { [key: string]: string } = {};

class CssClassConverter implements IClassConverter {
    convertCustomClassToString(customClass: ICustomClass): string {
        if (customClass &&
            customClass.name &&
            customClass.rule) {
            const className = customClass.name.trim();
            let rule: string;
            if (className[0] === '.' || customClass.isNoClass) {
                rule = className;
            } else {
                rule = `.${className}`;
            }
            let keys = Object.keys(customClass.rule);
            if (keys.length === 0) {
                return '';
            }

            rule += '{';
            keys.forEach(key => {
                const correctedKey = this.convertCamelCase(key);
                rule += `${correctedKey}: ${customClass.rule[key]};`
            });
            rule += '}';
            return rule;
        } else {
            return '';
        }
    }

    addClassToSheet(customClass: ICustomClass): void {
        rules[customClass.name] = this.convertCustomClassToString(customClass);
    }

    addClassPool(cssPool: ICssPool): void {
        Object.keys(cssPool).forEach(key => {
            this.addClassToSheet(cssPool[key]);
        });
    }

    getRules(): string {
        let currentRules = '';
        Object.keys(rules).forEach(key => {
            currentRules += rules[key];
        });
        return currentRules;
    }

    addClassToElement(element: HTMLElement, customClass: ICustomClass): void {
        let className = customClass.name.trim();
        if (className[0] === '.') {
            className = className.substr(1);
        }
        element.classList.add(className);
    }

    public convertCamelCase(str: string): string {
        const tmp = '' + str;
        const letters = tmp.split('');
        const lowerLetters = tmp.toLowerCase().split('');
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

export const cssConverter = new CssClassConverter();
