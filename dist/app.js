"use strict";
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Active"] = 0] = "Active";
    TaskStatus[TaskStatus["Completed"] = 1] = "Completed";
})(TaskStatus || (TaskStatus = {}));
class Task {
    constructor(id, title, description, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addlistener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class TaskState extends State {
    constructor() {
        super();
        this.tasks = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TaskState();
        }
        return this.instance;
    }
    addTask(title, description) {
        const task = new Task(Date.now().toString(), title, description, TaskStatus.Active);
        this.tasks.push(task);
        for (const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice());
        }
    }
}
const taskState = TaskState.getInstance();
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
class Component {
    constructor(templateId, hostElementId, className, id) {
        this.templateElement = document.querySelector(`#${templateId}`);
        this.hostElement = document.querySelector(`#${hostElementId}`);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (className) {
            this.element.classList.add(className);
        }
        if (id) {
            this.element.id = id;
        }
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
class TaskItem extends Component {
    constructor(hostId, task) {
        super("single-task", hostId, undefined, task.id);
        this.task = task;
        this.renderContent();
    }
    renderContent() {
        this.element.querySelector("h2").textContent = this.task.title;
        this.element.querySelector("p").textContent = this.task.description;
    }
}
class TaskList extends Component {
    constructor(type) {
        super("task-list", "app", type);
        this.type = type;
        this.tasks = [];
        this.configure();
        this.renderContent();
    }
    configure() {
        taskState.addlistener((tasks) => {
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
    renderTasks() {
        document.querySelector(`#tasks-${this.type}`).innerHTML = "";
        for (const task of this.tasks) {
            new TaskItem(`tasks-${this.type}`, task);
        }
    }
    renderContent() {
        this.element.querySelector("ul").id = `tasks-${this.type}`;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} TASKS`;
    }
}
class TaskInput extends Component {
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
class Header extends Component {
    constructor() {
        super("header", "app");
    }
}
new Header();
new TaskInput();
new TaskList("active");
new TaskList("completed");
