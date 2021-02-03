import { Component } from "./base-component.js";
export class TaskItem extends Component {
    constructor(hostId, task) {
        super("single-task", hostId, undefined, task.id);
        this.task = task;
        this.configure();
        this.renderContent();
    }
    dragStartHandler(event) {
        event.dataTransfer.setData("text/plain", this.task.id);
        event.dataTransfer.effectAllowed = "move";
    }
    dragEndHandler(_event) { }
    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler.bind(this));
        this.element.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector("h2").textContent = this.task.title;
        this.element.querySelector("p").textContent = this.task.description;
    }
}
