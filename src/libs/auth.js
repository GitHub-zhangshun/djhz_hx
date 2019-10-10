import Cookies from 'js-cookie'

const TokenKey = 'DJHZ_HX_TOKEN'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function deleteToken() {
    return Cookies.remove(TokenKey)
}

export function isLogin() {
    return Cookies.get(TokenKey);
}

export function setIsOpen(isOpen) {
    return Cookies.set("isOpen",isOpen);
}
/**
 * 是否开户
 */
export function isOpen() {
    return Cookies.get("isOpen");
}
