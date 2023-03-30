class GradingController {

    constructor() {
        this.key = "WEBDEVWARS_USER_PROGRESS";
        this.defaultCourses = {
            'projectweek_1': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'projectweek_2': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'projectweek_3': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'meesterproef': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'browser_technologies': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'css_to_the_rescue': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'human_centered_design': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'progressive_web_apps': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'realtime_web': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null },
            'web_app_from_scratch': { 'material_grade': null, 'teaching_grade': null, 'insights_grade': null, 'note': null }
        }
    }

    saveProgress = () => {
        if (!this.supports_html5_storage()) { return false; }

        const jsonData = JSON.stringify({ totalProgress: 0, courses: this.defaultCourses });
        localStorage.setItem(this.key, jsonData);
        return true;
    }

    updateProgress = (formData) => {
        if (!this.supports_html5_storage()) { return false; }

        if (Object.keys(formData).length > 1) {

            const newData = {
                'material_grade': formData['material_grade'],
                'teaching_grade': formData['teaching_grade'],
                'insights_grade': formData['insights_grade'],
                'note': formData['note']
            }

            const gradingProgress = this.getCurrentProgress();
            const currentCouresProgress = gradingProgress.courses;

            this.defaultCourses = currentCouresProgress;
            this.defaultCourses[formData.course_selection] = newData;

            const finishedAll = (Object.keys(formData).length - 1) == 3 ? true : false;
            const allGradedCourses = this.listGradedCourses();
            const completedBefore = this.checkIfCompletedBefore(formData.course_selection);

            const jsonData = JSON.stringify({ 
                totalProgress: (allGradedCourses + (!completedBefore && finishedAll ? 1 : 0)), 
                courses: this.defaultCourses 
            });

            localStorage.setItem(this.key, jsonData);
            return true;

        }

        return false;
    }

    listGradedCourses = () => {
        const gradingProgress = this.getCurrentProgress();
        const excludeKey = 'note'; // the key to exclude from the check

        const count = Object.keys(gradingProgress.courses).reduce((acc, key) => {
            const hasNonNullValues = Object.keys(gradingProgress.courses[key]).filter(k => k !== excludeKey).some(k => gradingProgress.courses[key][k] !== null);
            return hasNonNullValues ? acc + 1 : acc;
        }, 0);

        return count;
    }

    checkAmountOfAnswers = (item) => {
        const excludeKey = 'note'; // the key to exclude from the check

        const countNonNullValues = Object.values(item)
        .filter((val, index, arr) => arr[index] !== null && Object.keys(item)[index] !== excludeKey)
        .length;

        return countNonNullValues;
    }

    checkIfCompletedBefore = (key) => {
        const gradingProgress = this.getCurrentProgress();
        const excludeKey = 'note'; // the key to exclude from the check

        // console.log(key);
        // console.log(gradingProgress);

        const courseKeys = Object.keys(gradingProgress.courses[key]);
        const allValuesNotNull = Object.values(gradingProgress.courses[key]).flat().filter((item,i) => {
            if (courseKeys[i] != excludeKey) {
                return item !== null;
            }
        });

        return allValuesNotNull;

    }

    getCurrentProgress = () => {
        if (!this.supports_html5_storage()) { return false; }

        const jsonData = localStorage.getItem(this.key);
        const result = JSON.parse(jsonData)

        return result;
    }

    clearProgressData = () => {
        localStorage.removeItem(this.key);
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

export default GradingController;