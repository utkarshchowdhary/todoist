import { Component } from "./base-component.js";
import { taskState } from "../state/task-state.js";
import { validate } from "../utils/validation.js";
export class TaskInput extends Component {
    constructor() {
        super("task-input", "app");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.configure();
    }
    configure() {
        const formElement = this.element.querySelector("form");
        formElement.addEventListener("submit", this.submitHandler.bind(this));
    }
    submitHandler(event) {
        event.preventDefault();
        const collectedInputs = this.collectInputs();
        if (Array.isArray(collectedInputs)) {
            const [title, desc] = collectedInputs;
            taskState.addTask(title, desc);
            this.clearInputs();
        }
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
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
    }
}
