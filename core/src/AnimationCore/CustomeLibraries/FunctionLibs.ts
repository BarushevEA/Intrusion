export function findElementOnArray(arr: any[], element: any): number {
    for (let i = 0, k = arr.length - 1; i < arr.length; i++, k--) {
        if (arr[i] === element) {
            return i;
        }
        if (arr[k] === element) {
            return k;
        }
    }
    return -1;
}
