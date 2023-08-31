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
export function createServerErrors(response: any) {
    console.log(response)
    if (response.message !== "Validation failed" || !response?.data?.details?.length) {
        return [response.message];
    }
    return response.data.details.map((detail: any) => {
        return `${detail.message} `;
    });
}