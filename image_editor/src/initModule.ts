export class InitModule {
    private name = 'Test';

    getName(): string {
        console.log(this.name);
        return this.name;
    }
}
