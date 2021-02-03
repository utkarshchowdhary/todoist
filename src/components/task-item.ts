import { Component } from "./base-component.js";
import { Draggable } from "../models/drag-drop.js";
import { Task } from "../models/task-model.js";

export class TaskItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private task: Task;

  constructor(hostId: string, task: Task) {
    super("single-task", hostId, undefined, task.id);
    this.task = task;

    this.configure();
    this.renderContent();
  }

  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.task.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_event: DragEvent) {}

  private configure() {
    this.element.addEventListener(
      "dragstart",
      this.dragStartHandler.bind(this)
    );
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  private renderContent() {
    this.element.querySelector("h2")!.textContent = this.task.title;
    this.element.querySelector("p")!.textContent = this.task.description;
  }
}
