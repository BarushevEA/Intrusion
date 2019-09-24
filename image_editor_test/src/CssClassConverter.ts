export type ICustomClass = {
    className: string;
    rule: { [key: string]: string }
};

export type IClassConverter = {
    convertCustomClassToString(customClass: ICustomClass): string;
    addClassToSheet(customClass: ICustomClass): string;
    addClassToElement(element: HTMLElement, customClass: ICustomClass): void;
}

const rules: { [key: string]: string } = {};

class CssClassConverter implements IClassConverter {
    convertCustomClassToString(customClass: ICustomClass): string {
        if (customClass &&
            customClass.rule &&
            customClass.rule) {
            const className = customClass.className.trim();
            let rule: string;
            if (className[0] === '.') {
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

    addClassToSheet(customClass: ICustomClass): string {
        let currentRules = '';
        rules[customClass.className] = this.convertCustomClassToString(customClass);
        Object.keys(rules).forEach(key => {
            currentRules += rules[key];
        });

        return currentRules;
    }

    addClassToElement(element: HTMLElement, customClass: ICustomClass): void {
        let className = customClass.className.trim();
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
