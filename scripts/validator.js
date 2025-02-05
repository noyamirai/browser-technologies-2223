const anonymousMode = document.querySelector('input[name="anonymous"');

const userDataInputWrappers = document.querySelectorAll('[data-input-wrapper]');
const questionnaireWrappers = document.querySelectorAll('[data-grade-wrapper]');

const submitBtn = document.querySelector('button[type="submit"]');
const userForm = document.querySelector('#personal_info-form');
const questionnaireForm = document.querySelector('#questionnaire-form');

import messageController from './MessageController.js';
const MessageController = new messageController();

import userController from './UserController.js';
import gradingController from './GradingController.js';

window.addEventListener('load', () => {

    if (anonymousMode) {
        
        const userNameField = document.querySelector('[data-input-type="username"]');
        const nameField = document.querySelector('[data-input-type="name"]');
        anonymousMode.addEventListener('change', (e) =>{
            if (e.target.checked) {
                userNameField.classList.add('hide');
                nameField.classList.add('hide');

                if (submitBtn.disabled) {
                    submitBtn.disabled = false;
                }

                return;
            }

            const userNameInput = userNameField.querySelector('input');
            const nameInput = nameField.querySelector('input');

            if ((!submitBtn.disabled && nameInput.value == '') || nameInput.value == '') {
                const errorLabel = document.querySelector('[data-message-label-for="name"]');
                errorLabel.classList.remove('hide');
                submitBtn.disabled = true;
            }

            if ((!submitBtn.disabled && !checkPattern(userNameInput.pattern, userNameInput.value)) || !checkPattern(userNameInput.pattern, userNameInput.value)) {
                const errorLabel = document.querySelector('[data-message-label-for="username"]');
                errorLabel.classList.remove('hide');
                submitBtn.disabled = true;
            }

            nameField.classList.remove('hide');
            userNameField.classList.remove('hide');
            return
        });
    }

    if (userDataInputWrappers.length > 0) {
        userDataInputWrappers.forEach(inputWrapper => {
            const errorLabel = document.createElement('div');
            errorLabel.className = 'message hide';
            const inputType = inputWrapper.getAttribute('data-input-type');
            errorLabel.setAttribute("data-message-label-for", inputType);

            const message = MessageController.getMessage(`no_${inputType}`);
            const errorContent = `<p>${message}</p>`;
            errorLabel.innerHTML = errorContent;

            inputWrapper.appendChild(errorLabel);

            const inputElement = inputWrapper.querySelector('input');

            inputElement.addEventListener('input', debounce(inputHandler, 350))
        });
    }

    if (questionnaireWrappers.length > 0) {

        questionnaireWrappers.forEach(fieldSet => {
            const errorLabel = document.createElement('div');
            errorLabel.className = 'message hide';
            const inputType = fieldSet.getAttribute('data-grade-category');
            errorLabel.setAttribute("data-message-label-for", inputType);

            const message = MessageController.getMessage(`no_${inputType}`);
            const errorContent = `<p>${message}</p>`;
            errorLabel.innerHTML = errorContent;

            fieldSet.appendChild(errorLabel);

            const inputElement = fieldSet.querySelector('input');
            if (inputElement) {
                inputElement.addEventListener('change', inputHandler)
            }

        });
        
    }

});

if (userForm) {
    
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitHandler(e.target)
    });


    document.addEventListener('invalid', (function(){
        return function(e) {
        //prevent the browser from showing default error bubble / hint
        e.preventDefault();

        const inputWrapper = document.querySelector(`[data-input-type="${e.target.name}"]`);

        if (!inputWrapper.className.includes('hide')) {
            inputHandler(e);
        } else {
            submitHandler(userForm);
        }

        };
    })(), true);

    function submitHandler(formEl) {

        const formData = new FormData(formEl);
        const formProps = Object.fromEntries(formData);
        const UserController = new userController(formProps);

        UserController.saveUserData(formProps);

        window.location = './confirmation.html';
    }

}

if (questionnaireForm) {

    questionnaireForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(questionnaireForm);
        const formProps = Object.fromEntries(formData);

        const GradingController = new gradingController(formProps);
        GradingController.updateProgress(formProps);

        window.location = './confirmation.html';
    });

}


function inputHandler(e) {
    const value = e.target.value;
    const inputType = e.target.name;
    const query = userForm ? `[data-input-type="${inputType}"]` : (questionnaireForm ? `[data-grade-category="${inputType}"]` : '');

    const inputWrapper = document.querySelector(query);
    const errorLabel = inputWrapper.querySelector(`[data-message-label-for="${inputType}"]`);

    const inputPattern = e.target.pattern;
    let validPattern;

    if (inputPattern) { validPattern = checkPattern(inputPattern, value); }

    // empty
    if (value == '') {
        const message = MessageController.getMessage(`no_${inputType}`);
        const errorContent = `<p>${message}</p>`;
        errorLabel.innerHTML = errorContent;

        errorLabel.classList.remove('hide');
        submitBtn.disabled = true;
        e.target.focus();

    } else if (inputPattern) {

        if (!validPattern) {
            const message = MessageController.getMessage(`invalid_${inputType}`);
            const errorContent = `<p>${message}</p>`;
            errorLabel.innerHTML = errorContent;

            errorLabel.classList.remove('hide');
            submitBtn.disabled = true;
            e.target.focus();
            return;
        } else {
            if (!errorLabel.className.includes('hide')) errorLabel.classList.add('hide');

            submitBtn.disabled = false;
            return;
        }
    }
    
    else {
        if (!errorLabel.className.includes('hide')) errorLabel.classList.add('hide');
        submitBtn.disabled = false;
    }

    return;
}


function checkPattern(pattern, value) {
    const term = value;
    const re = new RegExp(`${pattern}`);

    return re.test(term);
}

// From https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}