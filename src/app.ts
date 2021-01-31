enum TaskStatus {
  Active,
  Completed,
}

class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public status: TaskStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;

class Component<T extends HTMLElement, U extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: T;
  protected element: U;

  constructor(templateId: string, hostElementId: string, className?: string) {
    this.templateElement = document.querySelector(
      `#${templateId}`
    ) as HTMLTemplateElement;
    this.hostElement = document.querySelector(`#${hostElementId}`) as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;

    if (className) {
      this.element.classList.add(className);
    }
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class State<T> {
  protected listeners: Listener<T>[] = [];

  addlistener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class TaskState extends State<Task> {
  private static instance: TaskState;
  private tasks: Task[] = [];

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new TaskState();
    }

    return this.instance;
  }

  addTask(title: string, description: string) {
    const task = new Task(
      Date.now().toString(),
      title,
      description,
      TaskStatus.Active
    );
    this.tasks.push(task);
    for (const listenerFn of this.listeners) {
      listenerFn(this.tasks.slice());
    }
  }
}

const taskState = TaskState.getInstance();

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

class TaskList extends Component<HTMLDivElement, HTMLElement> {
  tasks: Task[] = [];

  constructor(private type: "active" | "completed") {
    super("task-list", "app", type);

    this.configure();
    this.renderContent();
  }

  private configure() {
    taskState.addlistener((tasks: Task[]) => {
      const revelantTasks = tasks.filter((task) => {
        if (this.type === "active") {
          return task.status === TaskStatus.Active;
        }
        return task.status === TaskStatus.Completed;
      });
      this.tasks = revelantTasks;
      this.renderTasks();
    });
  }

  private renderTasks() {
    const listEl = this.element.querySelector("ul") as HTMLUListElement;
    listEl.innerHTML = "";

    for (const task of this.tasks) {
      const listItem = document.createElement("li");
      listItem.textContent = task.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} TASKS`;
  }
}

class TaskInput extends Component<HTMLDivElement, HTMLElement> {
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
      taskState.addTask(title, desc);
      this.clearInputs();
    }
  }
}

class Header extends Component<HTMLDivElement, HTMLElement> {
  constructor() {
    super("header", "app");
  }
}

const header = new Header();
const taskInput = new TaskInput();
const activeTaskList = new TaskList("active");
const completedTaskList = new TaskList("completed");
