import {InitModule} from "./initModule";

(<InitModule>(<any>window)['test'])  = new InitModule();
