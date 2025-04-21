import cookieModule from "./cookie.module";

function getToken() {
    return cookieModule().getCookie("gisToken");
}
function setToken(value) {
    if (getToken()) {
        deleteToken();
        return cookieModule().setCookie("gisToken", value, 24)
    } else {
        return cookieModule().setCookie("gisToken", value, 24)
    }
}
function deleteToken() {
    return cookieModule().deleteCookie("gisToken")
}
export default { getToken, setToken, deleteToken };