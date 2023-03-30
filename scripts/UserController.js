class UserController {

    constructor(userData) {
        this.userData = userData;
        this.name = userData.name;
        this.username = userData.username ?? null;
        this.email = userData.email;
        this.studentnumber = userData.studentnumber;
        this.anonymous = userData.anonymous ?? null;
        this.key = 'WEBDEVWARS_USER';
    }

    saveUserData = () => {

        if (!this.supports_html5_storage()) { return false; }

        const jsonData = JSON.stringify(this.userData);
        localStorage.setItem(this.key, jsonData);

        return true;
    }

    getUserData = () => {
        if (!this.supports_html5_storage()) { return false; }

        const jsonData = localStorage.getItem(this.key);
        const result = JSON.parse(jsonData)

        return result;
    }
    

    // SOURCE: https://stackoverflow.com/questions/32902659/detect-if-browser-allows-setting-localstorage-setitem
    supports_html5_storage() {
        try {
            if ('localStorage' in window && window['localStorage'] !== null) {
                localStorage.setItem("testitem",true);
                localStorage.getItem("testitem");
                localStorage.removeItem("testitem");
                return true;
            }
        } catch (e) {
            return false;
        }

    }

}

export default UserController;