import { apiBaseUrl } from "./config";

export function numberToArray(n: number) {
    const arr: number[] = [];
    for (let i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}

export function createId() {
    return Math.random().toString(36).substring(2);
}


