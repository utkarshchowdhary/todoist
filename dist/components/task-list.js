import { Component } from "./base-component.js";
import { TaskItem } from "./task-item.js";
import { TaskStatus } from "../models/task-model.js";
import { taskState } from "../state/task-state.js";
export class TaskList extends Component {
    constructor(type) {
        super("task-list", "app", type);
        this.type = type;
        this.tasks = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
        }
    }
    dropHandler(event) {
        const taskId = event.dataTransfer.getData("text/plain");
        taskState.moveTask(taskId, this.type === "active" ? TaskStatus.Active : TaskStatus.Completed);
    }
    dragLeaveHandler(_event) { }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
        this.element.addEventListener("drop", this.dropHandler.bind(this));
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
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
