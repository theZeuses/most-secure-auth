export function getJwtToken() {
    return localStorage.getItem("jwt")
}

export function setJwtToken(token: string) {
    localStorage.setItem("jwt", token)
}

export function getRefreshToken() {
    return localStorage.getItem("refreshToken")
}

export function setRefreshToken(token: string) {
    localStorage.setItem("refreshToken", token)
}

export function getExpiresIn() {
    return localStorage.getItem("expiresIn")
}

export function setExpiresIn(date: string) {
    localStorage.setItem("expiresIn", date)
}

export function removeJwtToken() {
    localStorage.removeItem("jwt")
}

export function removeRefreshToken() {
    localStorage.removeItem("refreshToken")
}

export function removeExpiresIn() {
    localStorage.removeItem("expiresIn")
}

export function isLoggedIn(){
    if(getRefreshToken() && getJwtToken()){
        const exp = getExpiresIn();
        if(exp && Date.now() < parseInt(exp)){
            return true;
        } 
    };
    removeJwtToken();
    removeRefreshToken();
    removeExpiresIn();
    return false;
}