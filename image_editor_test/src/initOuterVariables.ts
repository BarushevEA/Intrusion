import {IAppAnimation} from "./AppAnimation";

export type IController = {
    add(element: IAppAnimation): void;
    printElements(): void;
    setRed0(): void;
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

    setRed0(): void{
        if (this.animations.length) {
            this.animations[0].setRedColor();
        }
    }
}


((<any>window)['AppAnimationController']) = new Controller();
