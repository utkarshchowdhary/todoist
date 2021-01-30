interface Validatable {
  field: string;
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

function validate(validatableInput: Validatable): [boolean, string[]] {
  let isValid = true;
  let errors: string[] = [];

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
      errors.push(
        `${validatableInput.field} should have a minimum length of ${validatableInput.minLength}`
      );
    }
    isValid = isValid && isTruthy;
  }
  if (validatableInput.maxLength != null) {
    let isTruthy = validatableInput.value.length <= validatableInput.maxLength;
    if (!isTruthy) {
      errors.push(
        `${validatableInput.field} can have a maximum length of ${validatableInput.maxLength}`
      );
    }
    isValid = isValid && isTruthy;
  }

  return [isValid, errors];
}

class TaskInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.querySelector(
      "#task-input"
    ) as HTMLTemplateElement;
    this.hostElement = document.querySelector("#app") as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
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

  private submitHandler(event: Event) {
    event.preventDefault();

    const collectedInputs = this.collectInputs();

    if (Array.isArray(collectedInputs)) {
      const [title, desc] = collectedInputs;
      console.log(title, desc);
      this.clearInputs();
    }
  }

  private configure() {
    const formElement = this.element.querySelector("form") as HTMLFormElement;
    formElement.addEventListener("submit", this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class Header {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor() {
    this.templateElement = document.querySelector(
      "#header"
    ) as HTMLTemplateElement;
    this.hostElement = document.querySelector("#app") as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

const header = new Header();

const taskInput = new TaskInput();
