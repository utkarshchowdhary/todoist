import { Component } from "./base-component.js";
import { taskState } from "../state/task-state.js";
import { validate } from "../utils/validation.js";

export class TaskInput extends Component<HTMLDivElement, HTMLElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;

  constructor() {
    super("task-input", "app");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;

    this.configure();
  }

  private configure() {
    const formElement = this.element.querySelector("form") as HTMLFormElement;
    formElement.addEventListener("submit", this.submitHandler.bind(this));
  }

  private submitHandler(event: Event) {
    event.preventDefault();

    const collectedInputs = this.collectInputs();

    if (Array.isArray(collectedInputs)) {
      const [title, desc] = collectedInputs;
      taskState.addTask(title, desc);
      this.clearInputs();
    }
  }

  private collectInputs(): [string, string] | void {
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

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
  }
}
