import {IAppAnimation} from "./AppAnimation";

export type IController = {
    add(element: IAppAnimation): void;
    printElements(): void;
    toggleColors(index?: number): void;
};

class Controller implements IController {
    animations: IAppAnimation[] = [];

    public add(element: IAppAnimation): void {
        this.animations.push(element);
    }

    public printElements(): void {
        this.animations.forEach(element => {
            console.log(element);
        });
    }

    toggleColors(index = 0): void {
        if (this.animations.length && index < this.animations.length) {
            this.animations[index].toggleColors();
        }
    }
}


((<any>window)['AppAnimationController']) = new Controller();
