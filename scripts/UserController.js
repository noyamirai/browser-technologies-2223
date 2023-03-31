import gradingController from './GradingController.js';
const GradingController = new gradingController();

class UserController {

    constructor(userData) {
        this.userData = userData;

        if (Object.keys(this.userData).length > 0) {
            this.name = userData.name;
            this.username = userData.username ?? null;
            this.email = userData.email;
            this.studentnumber = userData.studentnumber;
            this.anonymous = userData.anonymous ?? null;
        }

        this.key = 'WEBDEVWARS_USER';
    }

    clearUserData = () => {
        localStorage.removeItem(this.key);
    }

    saveUserData = () => {

        if (!this.supports_html5_storage()) { return false; }

        this.userData.totalProgress = 0;

        if (this.userData.anonymous) {
            this.userData.name = '';
            this.userData.username = '';
        }

        const jsonData = JSON.stringify(this.userData);
        localStorage.setItem(this.key, jsonData);
        
        GradingController.saveProgress();

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