import { apiBaseUrl } from "./config";

export function numberToArray(n: number) {
    const arr: number[] = [];
    for (let i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}

export async function postData(apiPath: string, data: any,) {
    const response = await fetch(apiBaseUrl + apiPath, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}