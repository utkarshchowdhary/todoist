"use strict";
function validate(validatableInput) {
    let isValid = true;
    let errors = [];
    if (validatableInput.required) {
        let isTruthy = validatableInput.value.length !== 0;
        if (!isTruthy) {
            errors.push(`${validatableInput.field} is required`);
        }
        isValid = isValid && isTruthy;
    }
    if (validatableInput.minLength != null) {
        let isTruthy = validatableInput.value.length >= validatableInput.minLength;
        if (!isTruthy) {
            errors.push(`${validatableInput.field} should have a minimum length of ${validatableInput.minLength}`);
        }
        isValid = isValid && isTruthy;
    }
    if (validatableInput.maxLength != null) {
        let isTruthy = validatableInput.value.length <= validatableInput.maxLength;
        if (!isTruthy) {
            errors.push(`${validatableInput.field} can have a maximum length of ${validatableInput.maxLength}`);
        }
        isValid = isValid && isTruthy;
    }
    return [isValid, errors];
}
class TaskInput {
    constructor() {
        this.templateElement = document.querySelector("#task-input");
        this.hostElement = document.querySelector("#app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.configure();
        this.attach();
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
    }
    collectInputs() {
        const enteredTitle = this.titleInputElement.value.trim();
        const enteredDescription = this.descriptionInputElement.value.trim();
        const [titleIsValid, titleErrors] = validate({
            field: "title",
            value: enteredTitle,
            required: true,
        });
        const [descriptionIsValid, descriptionErrors] = validate({
            field: "description",
            value: enteredDescription,
            required: true,
            minLength: 5,
        });
        if (!titleIsValid || !descriptionIsValid) {
            let errors = [...titleErrors, ...descriptionErrors];
            alert(`${errors.join(", ")}`);
            return;
        }
        return [enteredTitle, enteredDescription];
    }
    submitHandler(event) {
        event.preventDefault();
        const collectedInputs = this.collectInputs();
        if (Array.isArray(collectedInputs)) {
            const [title, desc] = collectedInputs;
            console.log(title, desc);
            this.clearInputs();
        }
    }
    configure() {
        const formElement = this.element.querySelector("form");
        formElement.addEventListener("submit", this.submitHandler.bind(this));
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
class Header {
    constructor() {
        this.templateElement = document.querySelector("#header");
        this.hostElement = document.querySelector("#app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
const header = new Header();
const taskInput = new TaskInput();
