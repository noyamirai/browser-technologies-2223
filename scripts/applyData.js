const userNameTag = document.querySelector('[data-username-tag]');
const defaultUserTag = document.querySelector('[data-username-default]');

const anonymousForm = document.querySelector('#anonymous_mode-form');
const userForm = document.querySelector('#personal_info-form');

const progressBar = document.querySelector('[data-progress-bar]');

const questionnaireWrappers = document.querySelectorAll('[data-grade-wrapper]');
const courseItemIndicators = document.querySelectorAll('[data-course-grade-progress]');

import userController from './UserController.js';
const UserController = new userController({});

import gradingController from './GradingController.js';
const GradingController = new gradingController({});

if (UserController.supports_html5_storage) {
    const userData = UserController.getUserData();
    const progressData = GradingController.getCurrentProgress();

    if (userData && progressData) {
        
        if (userNameTag) {
           setUserName(userData);
        }
        
        if (anonymousForm) {
            setAnonMode(userData);
        }
    
        if (progressBar) {
            setProgressBar(progressData);
        }

        if (questionnaireWrappers.length > 0) {
            const path = window.location.pathname.replace('/', '').replace('.html', '');
            
            for (const key in progressData.courses[path]) {
                const submittedGrade = progressData.courses[path][key];    

                if (key == 'note') {
                    const textareaEl = document.querySelector(`textarea`);
                    textareaEl.value = submittedGrade
                } else {
                    const radioBtn = document.querySelector(`input[name="${key}"][value="${submittedGrade}"]`);
    
                    if (radioBtn) {
                        radioBtn.checked = true;
                    }
                }

            }
        }

        if (courseItemIndicators.length > 0) {
            for (const key in progressData.courses) {

                const amountAnswered = GradingController.checkAmountOfAnswers(progressData.courses[key]);            
                const tagEl = document.querySelector(`[data-course-grade-progress-for="${key}"]`);

                if (amountAnswered == 3) {
                    tagEl.parentElement.classList.add('tag--completed');
                } else {
                    tagEl.parentElement.classList.remove('tag--completed');
                }

                tagEl.innerHTML = `(${amountAnswered}/3)`;
            }

        }

        if (userForm) {
            console.log(userData.anonymous);

            const nameInputField = document.querySelector(`input[name="name"]`);
            const userNameInputField = document.querySelector(`input[name="username"]`);

            if (userData.anonymous != 'on') {

                nameInputField.value = userData.name;
                userNameInputField.value = userData.username;      
            } else {

                nameInputField.closest('div').classList.add('hide');
                userNameInputField.closest('div').classList.add('hide');

                nameInputField.value = null;
                userNameInputField.value = null;      
            }

            const emailInputField = document.querySelector(`input[name="email"]`);
            emailInputField.value = userData.email;

            const studentNumberInputField = document.querySelector(`input[name="studentnumber"]`);
            studentNumberInputField.value = userData.studentnumber;

            const anonModeCheckbox = document.querySelector('input[name="anonymous"]');
            anonModeCheckbox.checked = true;      
            
        }
    }

}

function setProgressBar(userData) {
    progressBar.value = userData.totalProgress;
}

function setAnonMode(userData) {
    const anonymousCheckbox = anonymousForm.querySelector('input');

    if (userData.anonymous) {
        anonymousCheckbox.checked = true;
        return;
    }

    anonymousCheckbox.checked = false;
    return;
}

function setUserName(userData) {

     if (!userData.anonymous) {
        defaultUserTag.innerHTML = '<s>student</s> ';
        userNameTag.innerHTML = userData.username;

        return;
    }

    defaultUserTag.innerHTML = 'student';
    userNameTag.innerHTML = '';

    return;

}