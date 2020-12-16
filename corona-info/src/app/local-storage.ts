export abstract class LocalStorage<T> {

    private items: T[];

    constructor(private readonly key: string) {
        const localStorageItems = localStorage.getItem(this.key)
        if (localStorageItems === null) {
            this.items = [];                                    
        } else {
            this.items = JSON.parse(localStorageItems);            
        }                
    }

    protected setData(items: T[]): void {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        this.items = items.slice(0);
    }

    protected getData(): T[] {
        return this.items.slice(0);
    }
}
