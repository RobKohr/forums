import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import { createSignal } from "solid-js";


export const [authUserToken, setAuthUserToken] = createSignal<string>("");

export function saveAuthUserToken(token: string) {
    const set = Cookies.set("authUserToken", token);
    setAuthUserToken(token);
    const get = Cookies.get("authUserToken");
    console.log("get", get);
    console.log("set", set);
}

export function setAuthUserTokenFromCookie() {
    const token = Cookies.get("authUserToken");
    console.log("token", token);
    if (token) {
        setAuthUserToken(token);
        getTokenData();
    }
}

export function getTokenData() {
    const token = authUserToken();
    const decoded = jwt_decode(token);
    console.log("decoded", decoded);
    return decoded;
}

export function logout() {
    Cookies.remove("authUserToken");
    setAuthUserToken("");
}